// Site assistant. Answers as a JET team member from the same content the site
// renders, and can hand a service or project request straight to n8n.
//
// Deliberately NOT streamed. The Professional Engineers Act notice (PEO
// L03 26-OI 18359) means the word "engineer" must never reach a visitor, and
// once a token is streamed it cannot be recalled. Buffering the reply lets the
// regulated-term filter below run before anything is sent. Replies are short,
// so the latency cost is small and the compliance guarantee is worth it.
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getSiteKnowledge } from "@/lib/chat/knowledge";

export const runtime = "nodejs";

const MODEL = "claude-opus-5";
const MAX_TURNS = 20;
const MAX_CHARS = 2000;

// Crude per-IP limiter. In-memory, so it resets on redeploy and isn't shared
// between serverless instances — enough to blunt casual abuse of a paid API,
// not a substitute for a real rate limiter if this ever gets hammered.
const hits = new Map<string, { n: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { n: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}

// Last line of defence for the PEO restriction. The system prompt does the
// real work; this catches a slip before it reaches anyone.
const BANNED = /\bengineer(s|ing|ed)?\b/gi;

function scrub(text: string): { text: string; tripped: boolean } {
  BANNED.lastIndex = 0;
  if (!BANNED.test(text)) return { text, tripped: false };
  BANNED.lastIndex = 0;
  const out = text.replace(BANNED, (m) => {
    const lower = m.toLowerCase();
    if (lower.startsWith("engineering")) return "technical";
    if (lower.startsWith("engineers")) return "specialists";
    return "specialist";
  });
  console.error("[chat] regulated term produced by model and scrubbed");
  return { text: out, tripped: true };
}

const SUBMIT_TOOL: Anthropic.Tool = {
  name: "submit_request",
  description:
    "Send a service call, quote or project enquiry to the JET team. Only call this once you have at minimum the contact's name, an email address, and a description of what they need. Read the details back to them before calling it.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Contact's full name" },
      email: { type: "string", description: "Work email address" },
      company: { type: "string", description: "Company name, or empty string if not given" },
      phone: { type: "string", description: "Phone number, or empty string if not given" },
      kind: {
        type: "string",
        enum: ["Quote", "Service call", "Parts", "Project", "Other"],
        description: "Type of enquiry",
      },
      details: {
        type: "string",
        description: "What they need, in their own words where possible",
      },
    },
    required: ["name", "email", "company", "phone", "kind", "details"],
    additionalProperties: false,
  },
  strict: true,
};

function systemPrompt(knowledge: string): string {
  return [
    "You are the site assistant for JET Automation Inc., an industrial automation company in Mississauga, Ontario. You speak as a member of the team (\"we\", \"our shop\") in a plain, practical, shop-floor register. Short answers. No marketing gloss, no exclamation marks, no emoji.",
    "",
    "CRITICAL LEGAL RESTRICTION - this overrides everything else:",
    "JET does not hold a certificate of authorization under Ontario's Professional Engineers Act and has no P.Eng on staff. You must NEVER use the words \"engineer\", \"engineers\", \"engineering\" or \"engineered\", in any context, about JET or anyone else. Never describe JET as providing engineering services, and never call a colleague an engineer. Use \"specialist\", \"technician\", \"designer\", \"our technical team\", \"technical design\", \"controls design\" or \"build\" instead. The regulator has already written to the company about this wording, so it carries real legal exposure. If someone asks directly whether JET does engineering, say we do automation design, controls design, panel build and integration, and that work requiring a licensed professional gets referred out.",
    "",
    "What you do:",
    "- Answer questions about our services, products, job openings, hours and location using ONLY the facts below.",
    "- Help people find the right page and give them the path (for example /services#s04).",
    "- Take service calls, quotes and project enquiries: gather name, email and what they need (company and phone if they'll give them), read the details back, then call submit_request.",
    "",
    "Rules:",
    "- If you do not know, say so and point them to the technical support line (1-877-904-8724 ext. 4) or /contact-us. Never invent specifications, prices, lead times, capabilities or people.",
    "- We do not publish pricing. A quote comes from the team once they describe the application.",
    "- Never promise a delivery date, a price, or a capability not listed below.",
    "- Keep replies under about 120 words unless asked for more.",
    "",
    "FACTS - the only source you may answer from:",
    knowledge,
  ].join("\n");
}

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set - chat disabled.");
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (incoming.length === 0) {
    return NextResponse.json({ ok: false, error: "no-messages" }, { status: 400 });
  }

  // Trim history and message length so a long session can't run up the bill.
  const history: Anthropic.MessageParam[] = incoming
    .slice(-MAX_TURNS)
    .filter(
      (m) =>
        m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  const client = new Anthropic({ apiKey });
  const knowledge = await getSiteKnowledge();

  const messages: Anthropic.MessageParam[] = [...history];
  let submitted = false;

  try {
    for (let round = 0; round < 3; round++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        // Chat is latency-sensitive and mostly lookup, so low effort - the
        // quality/cost tradeoff that suits this route specifically.
        output_config: { effort: "low" },
        system: [
          {
            type: "text",
            text: systemPrompt(knowledge),
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [SUBMIT_TOOL],
        messages,
      });

      if (response.stop_reason === "refusal") {
        return NextResponse.json({
          ok: true,
          reply:
            "Sorry, I can't help with that one. For anything technical, call 1-877-904-8724 ext. 4.",
          submitted: false,
        });
      }

      const toolUse = response.content.find(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      if (response.stop_reason === "tool_use" && toolUse) {
        const input = toolUse.input as Record<string, string>;
        const forwarded = await forwardToN8n(input);
        submitted = submitted || forwarded;
        messages.push({ role: "assistant", content: response.content });
        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              is_error: !forwarded,
              content: forwarded
                ? "Sent to the team. Tell them it is in, and that someone replies within one business day."
                : "Could not send. Apologise and give them 1-877-904-8724 or /contact-us instead.",
            },
          ],
        });
        continue;
      }

      const raw = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      const { text } = scrub(raw);
      return NextResponse.json({
        ok: true,
        reply: text || "Sorry, I didn't catch that. Could you rephrase?",
        submitted,
      });
    }

    return NextResponse.json({
      ok: true,
      reply:
        "Let me hand this to the team - call 1-877-904-8724 ext. 4, or use /contact-us.",
      submitted,
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ ok: false, error: "busy" }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("[chat] Anthropic API error", err.status, err.message);
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
    console.error("[chat] unexpected error", err);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}

// Reuses the contact webhook so chat-captured enquiries land in the same n8n
// workflow as the contact form, tagged by source so they can be told apart.
async function forwardToN8n(input: Record<string, string>): Promise<boolean> {
  const url = process.env.N8N_CONTACT_WEBHOOK_URL;
  if (!url) {
    console.error("N8N_CONTACT_WEBHOOK_URL not set - chat request dropped.");
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "jetautomation.ca/chat-assistant",
        submittedAt: new Date().toISOString(),
        name: input.name ?? "",
        company: input.company ?? "",
        email: input.email ?? "",
        phone: input.phone ?? "",
        enquiryType: input.kind ?? "Other",
        message: input.details ?? "",
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[chat] n8n webhook unreachable", err);
    return false;
  }
}
