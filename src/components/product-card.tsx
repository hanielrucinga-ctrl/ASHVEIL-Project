import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { BAAG_STORE_URL } from "@/lib/brand";
import type { Product } from "@/lib/products";
import { formatMoney } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const img = product.images[0] ?? { src: "/logo.png", alt: product.name };
  return (
    <div className="rounded-[1.5rem] p-2">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
        <div className="relative overflow-hidden rounded-[1.25rem] border border-white/35 bg-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-[rgba(245,245,220,0.26)] px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-fg backdrop-blur-md">
            {product.category}
          </span>
        </div>
        <div className="mt-2 flex items-start justify-between gap-3 rounded-[1rem] border border-white/30 bg-[rgba(255,255,255,0.08)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em]">{product.name}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted">Small run / studio issue</p>
          </div>
          <p className="text-[11px] tabular-nums text-fg">{formatMoney(product.price)}</p>
        </div>
      </Link>
      <a
        href={product.baagUrl?.trim() || BAAG_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] px-3 text-[10px] uppercase tracking-[0.14em] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ShoppingBag className="size-4" aria-hidden="true" />
        Order at BAAG
      </a>
    </div>
  );
}
