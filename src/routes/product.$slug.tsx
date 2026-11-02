import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BAAG_STORE_URL, whatsappOrderUrl } from "@/lib/brand";
import type { Size } from "@/lib/products";
import { useCart } from "@/lib/store/cart";
import { useCatalogProduct } from "@/lib/use-catalog";
import { cn, formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({ component: ProductPage });

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: productData, isPending, isError, refetch } = useCatalogProduct(slug);
  const cart = useCart((s) => s.lines);
  const addToCart = useCart((s) => s.add);
  const [size, setSize] = useState<Size>("M");
  const [shot, setShot] = useState(0);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (productData?.sizes[0]) setSize(productData.sizes[0]);
  }, [productData?.slug, productData?.sizes]);

  useEffect(() => {
    setAmount(1);
  }, [size, productData?.slug]);

  if (isPending) {
    return (
      <Shell>
        <p className="px-4 py-20 text-center text-[11px] uppercase tracking-[0.2em] text-muted">Loading</p>
      </Shell>
    );
  }

  if (isError) {
    return (
      <Shell>
        <div role="alert" className="px-4 py-20 text-center">
          <p className="uppercase tracking-[0.2em]">This piece could not be loaded.</p>
          <p className="mt-2 text-sm text-muted">Check your connection and try again.</p>
          <Button variant="outline" className="mt-5" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </Shell>
    );
  }

  if (!productData) {
    return (
      <Shell>
        <div className="px-4 py-20 text-center">
          <p className="uppercase tracking-[0.2em]">Piece not found</p>
          <Link to="/shop" className="mt-4 inline-block underline underline-offset-4">
            Back to shop
          </Link>
        </div>
      </Shell>
    );
  }

  const product = productData;
  const stock = product.stock.find((s) => s.size === size)?.qty ?? 0;
  const max = Math.max(1, stock || 1);
  const orderUrl = whatsappOrderUrl({
    name: product.name,
    size,
    qty: amount,
    unitCents: product.price,
  });

  function handleAddToBag() {
    if (stock <= 0) {
      toast.error("This size is sold out.");
      return;
    }
    const currentQty = cart.find((line) => line.slug === product.slug && line.size === size)?.qty ?? 0;
    const available = Math.max(0, stock - currentQty);
    if (available <= 0) {
      toast.error("You already have the full stock of this size in your bag.");
      return;
    }
    const safeQty = Math.min(amount, available);
    addToCart(
      {
        slug: product.slug,
        size,
        name: product.name,
        image: product.images[0]?.src ?? "/logo.png",
        unitPrice: product.price,
      },
      safeQty,
      stock,
    );
    toast.success(`${product.name} added to bag`);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl">
          <div className="grid md:grid-cols-2">
            <div className="border-b border-white/35 p-3 md:border-b-0 md:border-r md:p-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/35 bg-[rgba(255,255,255,0.06)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                <img
                  src={product.images[shot]?.src}
                  alt={product.images[shot]?.alt}
                  className="aspect-[3/4] w-full rounded-[1.1rem] object-cover object-top"
                />
              </div>
              {product.images.length > 1 ? (
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={`${i}-${img.src.slice(0, 32)}`}
                      type="button"
                      onClick={() => setShot(i)}
                      className={cn(
                        "size-16 overflow-hidden rounded-full border border-white/35 bg-[rgba(255,255,255,0.08)] p-1 transition",
                        shot === i ? "shadow-[0_0_0_2px_rgba(17,17,17,0.1)]" : "opacity-70",
                      )}
                    >
                      <img src={img.src} alt="" className="h-full w-full rounded-full object-cover outline-none" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col justify-center px-4 py-8 md:px-10 md:py-10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{product.category}</p>
              <h1 className="mt-2 text-2xl uppercase tracking-[0.18em] md:text-[2rem]">{product.name}</h1>
              <p className="mt-3 text-lg tabular-nums text-fg">{formatMoney(product.price)}</p>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{product.description}</p>

              <fieldset className="mt-8">
                <legend className="mb-3 text-[10px] uppercase tracking-[0.16em] text-muted">Size</legend>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        "min-h-10 min-w-10 rounded-full border px-3 text-sm transition",
                        size === s
                          ? "border-white/45 bg-[rgba(255,255,255,0.18)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                          : "border-white/30 bg-[rgba(255,255,255,0.06)] text-muted",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="mb-3 text-[10px] uppercase tracking-[0.16em] text-muted">Amount</legend>
                <div className="flex w-fit items-center overflow-hidden rounded-full border border-white/35 bg-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center text-lg"
                    aria-label="Decrease amount"
                    onClick={() => setAmount((n) => Math.max(1, n - 1))}
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm tabular-nums">{amount}</span>
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center text-lg"
                    aria-label="Increase amount"
                    onClick={() => setAmount((n) => Math.min(max, n + 1))}
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {stock > 0 ? `${stock} in stock` : "Ask on WhatsApp"} · Total {formatMoney(product.price * amount)}
                </p>
              </fieldset>

              <div className="mt-8 flex flex-col gap-3 md:flex-row">
                <Button className="w-full rounded-full md:w-auto" onClick={handleAddToBag} disabled={stock <= 0}>
                  {stock > 0 ? "Add to bag" : "Sold out"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full md:w-auto"
                  onClick={() => window.open(orderUrl, "_blank", "noopener,noreferrer")}
                >
                  Order on WhatsApp
                </Button>
                <a
                  href={product.baagUrl?.trim() || BAAG_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] px-5 text-xs uppercase tracking-[0.18em] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_30px_rgba(17,17,17,0.08)] backdrop-blur-xl transition hover:bg-[rgba(255,255,255,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:w-auto"
                >
                  Order at BAAG
                </a>
              </div>
              <p className="mt-2 text-xs text-muted">Opens a chat to +250 787 360 229 with this piece, size, and amount.</p>

              <ul className="mt-10 space-y-2 border-t border-white/35 pt-6 text-sm text-muted">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}