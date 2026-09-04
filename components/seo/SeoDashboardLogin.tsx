"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusLine } from "@/components/ui/StatusLine";

export function SeoDashboardLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/seo-dashboard-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      // Cookie is set — re-run the Server Component so it sees it and
      // swaps this login form for the dashboard.
      router.refresh();
    } catch {
      setError("Wrong password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[420px] flex-col justify-center px-8 py-32">
      <Card>
        <h1 className="text-[22px] font-bold">SEO Dashboard</h1>
        <p className="mt-2 text-sm text-on-surface-muted">
          Internal tool — not indexed, not linked from the site.
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-surface-raised px-3 py-2 text-on-surface focus:border-2 focus:border-primary focus:outline-none"
          />
          {error && <StatusLine state="error">{error}</StatusLine>}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Checking…" : "Enter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
