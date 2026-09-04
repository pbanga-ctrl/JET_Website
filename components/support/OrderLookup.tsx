"use client";

// Order lookup form on the support page. Prototype only — any submitted
// order number/email combination "finds" the same hardcoded shipped order
// below; there's no real order database behind this yet.
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLine } from "@/components/ui/StatusLine";

const inputClass =
  "w-full border border-border bg-surface-raised px-3 py-2 text-on-surface placeholder:text-on-surface-muted focus:border-2 focus:border-primary focus:outline-none";

export function OrderLookup() {
  const [found, setFound] = useState(false);

  return (
    <div>
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          setFound(true);
        }}
      >
        <label className="flex flex-col gap-2">
          <span className="label-caps text-on-surface-muted">
            Order number
          </span>
          <input
            type="text"
            required
            placeholder="JA-000000"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label-caps text-on-surface-muted">
            Email on order
          </span>
          <input
            type="email"
            required
            placeholder="jane@acme.com"
            className={inputClass}
          />
        </label>
        <Button type="submit" variant="primary" className="self-end">
          Look up
        </Button>
      </form>

      {found && (
        <div className="mt-6 border border-border bg-surface-raised p-6">
          <StatusLine state="success">Shipped</StatusLine>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ResultField label="Order" value="JA-104882" />
            <ResultField label="Tracking" value="1Z 999 AA1 01" />
            <ResultField label="ETA" value="2 business days" />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps text-on-surface-muted">{label}</p>
      <p className="spec-mono mt-1">{value}</p>
    </div>
  );
}
