import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES } from "@/lib/products";
import { useCatalog } from "@/lib/use-catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({ component: Shop });

function Shop() {
  const { data = [] } = useCatalog();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]["id"]>("all");
  const items = useMemo(
    () => (cat === "all" ? data : data.filter((p) => p.category === cat)),
    [cat, data],
  );

  return (
    <Shell>
      <div className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-4 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-6">
          <div className="grid gap-6 rounded-[1.5rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-4 md:grid-cols-[1.3fr_0.7fr] md:p-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Studio archive</p>
              <h1 className="mt-3 text-4xl uppercase tracking-[0.2em] md:text-5xl">Built for daily motion.</h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Heavy cotton, minimal graphics, and silhouettes made to outlast the week.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.25rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-4 text-sm text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
              <div className="flex items-center justify-between border-b border-white/30 pb-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-fg">Run</span>
                <span className="text-fg">Small, direct</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/30 pb-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-fg">Material</span>
                <span>Heavy cotton</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-fg">Shipping</span>
                <span>Worldwide</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-[11px] uppercase tracking-[0.16em] transition backdrop-blur-xl",
                  cat === c.id
                    ? "border-white/40 bg-[rgba(255,255,255,0.2)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                    : "border-white/25 bg-[rgba(255,255,255,0.06)] text-muted hover:bg-[rgba(255,255,255,0.12)]",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-3 shadow-[0_18px_40px_rgba(17,17,17,0.06)] backdrop-blur-xl md:p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <div key={p.slug} className="overflow-hidden rounded-[1.5rem] border border-white/35 bg-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
