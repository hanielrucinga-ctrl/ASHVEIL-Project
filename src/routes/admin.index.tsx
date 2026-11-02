import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStudioSummary, listLedger } from "@/lib/shop-fns";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const summary = useQuery({ queryKey: ["studio-summary"], queryFn: () => getStudioSummary() });
  const ledger = useQuery({ queryKey: ["ledger"], queryFn: () => listLedger() });
  const s = summary.data;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl uppercase tracking-[0.2em]">Overview</h1>
      <div className="grid gap-px bg-fg sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Income" value={s ? formatMoney(s.income) : "—"} />
        <Stat label="Outcome" value={s ? formatMoney(s.expense) : "—"} />
        <Stat label="Net" value={s ? formatMoney(s.net) : "—"} />
        <Stat label="Units in stock" value={s ? String(s.units) : "—"} />
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xs uppercase tracking-[0.18em]">Low stock</h2>
          <Link to="/admin/stock" className="text-[11px] uppercase tracking-[0.14em] underline underline-offset-4">
            Manage
          </Link>
        </div>
        {s?.low.length ? (
          <ul className="divide-y divide-fg border border-fg text-sm">
            {s.low.map((row) => (
              <li key={`${row.slug}-${row.size}`} className="flex justify-between px-3 py-3">
                <span>
                  {row.name} · {row.size}
                </span>
                <span className="tabular-nums">{row.qty}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No sizes at 3 or fewer.</p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xs uppercase tracking-[0.18em]">Recent money</h2>
          <Link to="/admin/ledger" className="text-[11px] uppercase tracking-[0.14em] underline underline-offset-4">
            Ledger
          </Link>
        </div>
        <ul className="divide-y divide-fg border border-fg text-sm">
          {(ledger.data ?? []).slice(0, 8).map((row) => (
            <li key={row.id} className="flex justify-between gap-3 px-3 py-3">
              <span>
                {row.kind} · {row.source}
                {row.note ? ` — ${row.note}` : ""}
              </span>
              <span className={row.kind === "expense" ? "text-danger tabular-nums" : "tabular-nums"}>
                {row.kind === "expense" ? "−" : "+"}
                {formatMoney(row.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg px-4 py-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-xl tabular-nums">{value}</p>
    </div>
  );
}
