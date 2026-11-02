import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addLedgerEntry, listAdminCatalog, setStockQty } from "@/lib/shop-fns";

export const Route = createFileRoute("/admin/stock")({ component: StockAdmin });

function StockAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-catalog"], queryFn: () => listAdminCatalog() });
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [cost, setCost] = useState("");

  function key(id: number, size: string) {
    return `${id}:${size}`;
  }

  async function saveRow(productId: number, size: string, current: number) {
    const raw = draft[key(productId, size)];
    const qty = raw === undefined ? current : Math.max(0, Math.round(Number(raw)));
    const added = qty - current;
    try {
      await setStockQty({ data: { productId, size, qty } });
      if (added > 0 && cost) {
        const dollars = Number(cost);
        if (dollars > 0) {
          await addLedgerEntry({
            data: {
              kind: "expense",
              source: "restock",
              amount: Math.round(dollars * 100),
              note: `Restock ${size} ×${added}`,
            },
          });
        }
      }
      toast("Stock updated");
      await qc.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update stock");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl uppercase tracking-[0.2em]">Stock</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Set units per size. If you fill restock cost, increasing qty logs an outcome in the ledger.
      </p>
      <div className="mt-4 max-w-xs">
        <p className="mb-1 text-[11px] uppercase tracking-[0.16em]">Restock cost (USD, optional)</p>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="0.00"
        />
      </div>
      <div className="mt-8 overflow-x-auto border border-fg">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-fg text-[11px] uppercase tracking-[0.14em]">
            <tr>
              <th className="px-3 py-3">Piece</th>
              <th className="px-3 py-3">Size</th>
              <th className="px-3 py-3">Qty</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).flatMap((p) =>
              (p.sizes.length ? p.sizes : ["M"]).map((size) => {
                const row = p.stock.find((s) => s.size === size);
                const qty = Number(row?.qty ?? 0);
                const k = key(p.id, size);
                return (
                  <tr key={k} className="border-t border-fg">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{size}</td>
                    <td className="px-3 py-2">
                      <Input
                        className="h-11 w-24"
                        type="number"
                        min={0}
                        value={draft[k] ?? String(qty)}
                        onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Button type="button" variant="outline" onClick={() => void saveRow(p.id, size, qty)}>
                        Save
                      </Button>
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
