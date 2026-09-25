"use client";

// Floating site assistant, mounted once in the root layout. Renders nothing
// unless NEXT_PUBLIC_CHAT_ENABLED is "true", so the button can't appear before
// the API key is configured and every click would fail.
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const ENABLED = process.env.NEXT_PUBLIC_CHAT_ENABLED === "true";

const GREETING =
  "Hi — I can answer questions about our services, products and open roles, or take a service call or project enquiry. What do you need?";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel, matching what people expect of a dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!ENABLED) return null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setDraft("");
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the canned greeting: it isn't part of the real conversation.
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error === "rate-limited" ? "rate" : "fail");
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(
        err instanceof Error && err.message === "rate"
          ? "That's a lot of questions at once — give it a minute."
          : "Something went wrong. Call 1-877-904-8724 ext. 4, or use the contact form."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center border border-border-dark bg-secondary text-on-dark shadow-[4px_4px_0_0_var(--color-primary)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" strokeLinejoin="round" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="JET Automation assistant"
          className="fixed bottom-24 right-3 z-[90] flex h-[min(70vh,540px)] w-[min(calc(100vw-1.5rem),380px)] flex-col border border-border bg-surface shadow-[6px_6px_0_0_var(--color-border)] sm:right-6"
        >
          <header className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3 text-on-dark">
            <div>
              <p className="label-caps text-[10px] text-on-dark-muted">JET Automation</p>
              <p className="text-sm font-bold">Ask us anything</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-on-dark-muted transition-colors hover:text-on-dark"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "self-end border border-primary bg-primary text-surface"
                      : "self-start border border-border bg-surface-raised text-on-surface"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="self-start border border-border bg-surface-raised px-3 py-2 text-sm text-on-surface-muted">
                  Typing…
                </div>
              )}
              {error && (
                <div className="self-start border border-error px-3 py-2 text-sm text-error">
                  {error}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question…"
              maxLength={2000}
              className="min-w-0 flex-1 border border-border bg-surface-raised px-3 py-2 text-base text-on-surface placeholder:text-on-surface-muted focus:border-2 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="label-caps shrink-0 border border-primary bg-primary px-4 py-2 text-surface transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <p className="border-t border-border px-3 py-2 text-[11px] text-on-surface-muted">
            Automated assistant — it can be wrong. For anything urgent call
            1-877-904-8724 ext. 4.
          </p>
        </div>
      )}
    </>
  );
}
