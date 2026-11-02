import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_AT, SHIPPING_CENTS } from "@/lib/products";
import { cartSubtotal, useCart } from "@/lib/store/cart";
import { useCatalog } from "@/lib/use-catalog";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { data: catalog = [] } = useCatalog();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartSubtotal(lines);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_CENTS;
  const stockByLine = new Map(
    catalog.flatMap((product) =>
      product.stock.map((stock) => [`${product.slug}:${stock.size}`, Number(stock.qty) || 0] as const),
    ),
  );

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h1 className="text-2xl uppercase tracking-[0.24em]">Bag</h1>
          {lines.length > 0 ? (
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {lines.length} piece{lines.length === 1 ? "" : "s"} · free shipping over {formatMoney(FREE_SHIPPING_AT)}
            </p>
          ) : null}
        </div>
        {lines.length === 0 ? (
          <div className="mt-10 max-w-md">
            <p className="text-sm text-muted">Your bag is empty.</p>
            <p className="mt-2 text-sm text-muted">Browse the current drop and return when you’re ready.</p>
            <Link to="/shop" className="mt-6 inline-block">
              <Button>Continue shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-fg border-y border-fg">
              {lines.map((line) => (
                <li key={`${line.slug}-${line.size}`} className="flex gap-4 py-5">
                  <img src={line.image || "/logo.png"} alt="" className="h-28 w-24 object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.12em]">{line.name || line.slug}</p>
                        <p className="mt-1 text-xs text-muted">Size {line.size}</p>
                      </div>
                      <p className="text-sm tabular-nums">{formatMoney(line.unitPrice * line.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center shadow-[0_0_0_1px_#111111]">
                        <button
                          type="button"
                          className="flex size-11 items-center justify-center"
                          onClick={() =>
                            setQty(
                              line.slug,
                              line.size,
                              Math.max(1, line.qty - 1),
                              stockByLine.get(`${line.slug}:${line.size}`) ?? line.qty,
                            )
                          }
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          className="flex size-11 items-center justify-center"
                          onClick={() =>
                            setQty(
                              line.slug,
                              line.size,
                              line.qty + 1,
                              stockByLine.get(`${line.slug}:${line.size}`) ?? line.qty,
                            )
                          }
                          aria-label="Increase"
                          disabled={(stockByLine.get(`${line.slug}:${line.size}`) ?? 0) <= line.qty}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
                        onClick={() => remove(line.slug, line.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="tabular-nums">{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-fg pt-3 text-base uppercase tracking-[0.12em]">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(subtotal + shipping)}</span>
              </div>
              {subtotal < FREE_SHIPPING_AT ? (
                <p className="pt-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                  Add {formatMoney(FREE_SHIPPING_AT - subtotal)} for free shipping.
                </p>
              ) : null}
            </div>
            <Link to="/checkout" className="mt-8 block">
              <Button className="w-full">Checkout</Button>
            </Link>
          </>
        )}
      </div>
    </Shell>
  );
}
