"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLine } from "@/components/ui/StatusLine";
import type { PageAudit } from "@/lib/seo/audit";
import type { PageSpeedScores } from "@/lib/seo/pagespeed";

function scoreColor(score: number | undefined) {
  if (score === undefined) return "text-on-surface-muted";
  if (score >= 90) return "text-success";
  if (score >= 50) return "text-tertiary";
  return "text-error";
}

function PageSpeedRow({ url }: { url: string }) {
  const [scores, setScores] = useState<PageSpeedScores | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setScores(null);
    try {
      const res = await fetch(`/api/seo-pagespeed?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setScores(data.scores ?? { error: data.error || "failed" });
    } catch {
      setScores({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <span className="text-sm text-on-surface-muted">Running Lighthouse… (10–30s)</span>;

  if (scores?.error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-error">{scores.error}</span>
        <button type="button" onClick={run} className="text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  if (scores) {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm spec-mono">
        <span className={scoreColor(scores.performance)}>Perf {scores.performance ?? "–"}</span>
        <span className={scoreColor(scores.seo)}>SEO {scores.seo ?? "–"}</span>
        <span className={scoreColor(scores.accessibility)}>A11y {scores.accessibility ?? "–"}</span>
        <span className={scoreColor(scores.bestPractices)}>Best {scores.bestPractices ?? "–"}</span>
        <button type="button" onClick={run} className="underline text-on-surface-muted">
          Re-run
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={run} className="text-sm text-primary underline">
      Run PageSpeed check
    </button>
  );
}

function AuditRow({ result }: { result: PageAudit }) {
  const [expanded, setExpanded] = useState(false);

  if (!result.ok) {
    return (
      <tr className="border-b border-border">
        <td className="py-3 pr-4 spec-mono">{result.path}</td>
        <td colSpan={5} className="py-3 pr-4 text-error">
          {result.error || `HTTP ${result.status}`}
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="border-b border-border align-top">
        <td className="py-3 pr-4 spec-mono">{result.path}</td>
        <td className="py-3 pr-4">
          {result.titleLength}
          <span className="text-on-surface-muted"> chars</span>
        </td>
        <td className="py-3 pr-4">
          {result.metaDescriptionLength}
          <span className="text-on-surface-muted"> chars</span>
        </td>
        <td className="py-3 pr-4">{result.h1Count}</td>
        <td className="py-3 pr-4">
          {result.imagesMissingAlt}/{result.imagesTotal}
        </td>
        <td className="py-3 pr-4">
          {result.issues.length === 0 ? (
            <span className="text-success">■ Clean</span>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-error underline"
            >
              {result.issues.length} issue{result.issues.length === 1 ? "" : "s"}
            </button>
          )}
        </td>
        <td className="py-3 pr-4">
          <PageSpeedRow url={result.url} />
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-surface-raised">
          <td colSpan={7} className="py-3 pr-4">
            <ul className="flex flex-col gap-1 text-sm text-on-surface-muted">
              {result.issues.map((issue) => (
                <li key={issue}>⚠ {issue}</li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

export function SeoDashboardClient({ defaultBaseUrl }: { defaultBaseUrl: string }) {
  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl);
  const [inputValue, setInputValue] = useState(defaultBaseUrl);
  const [results, setResults] = useState<PageAudit[] | null>(null);
  // Starts true (rather than being set true from the mount effect below) so
  // the initial fetch never needs a synchronous setState call inside that
  // effect — everything it sets happens after an await, in a microtask.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function runAudit(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/seo-audit?baseUrl=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "audit-failed");
      setResults(data.results);
    } catch {
      setError("Audit failed — check the URL is reachable from this server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/seo-audit?baseUrl=${encodeURIComponent(defaultBaseUrl)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.ok) throw new Error(data.error || "audit-failed");
        setResults(data.results);
      } catch {
        if (!cancelled) setError("Audit failed — check the URL is reachable from this server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [defaultBaseUrl]);

  const totalIssues = results?.reduce((sum, r) => sum + r.issues.length, 0) ?? 0;

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-16">
      <h1 className="text-[30px] font-bold">SEO Dashboard</h1>
      <p className="mt-2 text-on-surface-muted">
        On-page audit runs instantly against any reachable URL (no Google account needed).
        PageSpeed checks are on-demand per page since each one runs a real Lighthouse pass
        (10–30s) and only works against a publicly reachable URL, not localhost.
      </p>

      <form
        className="mt-8 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setBaseUrl(inputValue);
          runAudit(inputValue);
        }}
      >
        <input
          type="url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="min-w-[320px] flex-1 border border-border bg-surface-raised px-3 py-2 spec-mono text-on-surface focus:border-2 focus:border-primary focus:outline-none"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Auditing…" : "Run audit"}
        </Button>
      </form>

      {error && (
        <div className="mt-4">
          <StatusLine state="error">{error}</StatusLine>
        </div>
      )}

      {results && (
        <>
          <p className="mt-6 text-sm text-on-surface-muted">
            Audited {results.length} pages against <span className="spec-mono">{baseUrl}</span> —{" "}
            {totalIssues === 0 ? (
              <span className="text-success">no issues found</span>
            ) : (
              <span className="text-error">{totalIssues} total issue(s)</span>
            )}
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="label-caps border-b border-border text-left text-on-surface-muted">
                  <th className="py-3 pr-4 font-medium">Page</th>
                  <th className="py-3 pr-4 font-medium">Title</th>
                  <th className="py-3 pr-4 font-medium">Meta desc.</th>
                  <th className="py-3 pr-4 font-medium">H1s</th>
                  <th className="py-3 pr-4 font-medium">Alt text</th>
                  <th className="py-3 pr-4 font-medium">Issues</th>
                  <th className="py-3 pr-4 font-medium">PageSpeed</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <AuditRow key={r.path} result={r} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
