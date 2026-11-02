import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { addLedgerEntry, listLedger } from "@/lib/shop-fns";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/ledger")({ component: LedgerAdmin });

function LedgerAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["ledger"], queryFn: () => listLedger() });
  const [kind, setKind] = useState<"income" | "expense">("expense");
  const [source, setSource] = useState("other");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const income = (q.data ?? []).filter((r) => r.kind === "income").reduce((n, r) => n + r.amount, 0);
  const expense = (q.data ?? []).filter((r) => r.kind === "expense").reduce((n, r) => n + r.amount, 0);

  async function add(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await addLedgerEntry({
        data: {
          kind,
          source,
          amount: Math.round(Number(amount) * 100),
          note,
        },
      });
      setAmount("");
      setNote("");
      toast("Entry added");
      await qc.invalidateQueries();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl uppercase tracking-[0.2em]">Money</h1>
      <div className="grid gap-px bg-fg sm:grid-cols-3">
        <Box label="Income" value={formatMoney(income)} />
        <Box label="Outcome" value={formatMoney(expense)} />
        <Box label="Net" value={formatMoney(income - expense)} />
      </div>

      <form onSubmit={add} className="grid gap-4 border border-fg p-4 md:grid-cols-2">
        <div>
          <Label>Type</Label>
          <select
            className="h-11 w-full bg-surface px-3 text-sm shadow-[0_0_0_1px_#111111]"
            value={kind}
            onChange={(e) => setKind(e.target.value as "income" | "expense")}
          >
            <option value="income">Income</option>
            <option value="expense">Outcome</option>
          </select>
        </div>
        <div>
          <Label>Source</Label>
          <select
            className="h-11 w-full bg-surface px-3 text-sm shadow-[0_0_0_1px_#111111]"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="sale">Sale</option>
            <option value="restock">Restock</option>
            <option value="shipping">Shipping</option>
            <option value="ads">Ads</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label>Amount (USD)</Label>
          <Input type="number" min={0} step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label>Note</Label>
          <Textarea className="min-h-20" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add entry"}
        </Button>
      </form>

      <ul className="divide-y divide-fg border border-fg text-sm">
        {(q.data ?? []).map((row) => (
          <li key={row.id} className="flex justify-between gap-4 px-3 py-3">
            <div>
              <p className="uppercase tracking-[0.12em]">
                {row.kind} · {row.source}
              </p>
              <p className="text-xs text-muted">
                {row.note}
                {row.order_id ? ` · ${row.order_id}` : ""}
              </p>
            </div>
            <p className={row.kind === "expense" ? "text-danger tabular-nums" : "tabular-nums"}>
              {row.kind === "expense" ? "−" : "+"}
              {formatMoney(row.amount)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg px-4 py-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-xl tabular-nums">{value}</p>
    </div>
  );
}
