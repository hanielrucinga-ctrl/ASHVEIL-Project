import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Shell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { whatsappCartOrderUrl } from "@/lib/brand";
import { FREE_SHIPPING_AT, SHIPPING_CENTS } from "@/lib/products";
import { cartSubtotal, useCart } from "@/lib/store/cart";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const subtotal = cartSubtotal(lines);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_CENTS;
  const total = subtotal + shipping;

  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", deliveryNotes: "" });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (lines.length === 0) {
    return (
      <Shell>
        <div className="px-4 py-20 text-center">
          <p className="uppercase tracking-[0.2em]">Bag is empty</p>
          <Link to="/shop" className="mt-4 inline-block underline underline-offset-4">
            Shop
          </Link>
        </div>
      </Shell>
    );
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const url = whatsappCartOrderUrl({
      ...form,
      items: lines.map((line) => ({
        name: line.name || line.slug,
        size: line.size,
        qty: line.qty,
        unitCents: line.unitPrice,
      })),
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: total,
    });
    window.location.assign(url);
  }

  return (
    <Shell>
      <form
        onSubmit={placeOrder}
        className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-8"
      >
        <div>
          <h1 className="text-2xl uppercase tracking-[0.24em]">Checkout</h1>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Send your bag to Ashveil on WhatsApp. We’ll confirm availability, final delivery cost, and payment
            options in the chat. No card details are collected here.
          </p>

          <h2 className="mt-8 text-xs uppercase tracking-[0.18em]">Your details</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Name">
              <Input
                autoComplete="name"
                required
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
              />
            </Field>
            <Field label="WhatsApp or phone number">
              <Input
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
              />
            </Field>
            <Field label="Delivery area or notes (optional)">
              <Textarea
                value={form.deliveryNotes}
                onChange={(event) => set("deliveryNotes", event.target.value)}
                placeholder="Tell us your area or anything we should know"
              />
            </Field>
          </div>

          <Button type="submit" className="mt-8 w-full" disabled={busy}>
            {busy ? "Opening WhatsApp…" : "Send order on WhatsApp"}
          </Button>
        </div>

        <aside className="h-fit border border-fg p-5">
          <h2 className="text-xs uppercase tracking-[0.18em]">Order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((line) => (
              <li key={`${line.slug}-${line.size}`} className="flex gap-3 text-sm">
                <img src={line.image || "/logo.png"} alt="" className="h-16 w-12 object-cover" />
                <div className="flex-1">
                  <p>{line.name || line.slug}</p>
                  <p className="text-xs text-muted">
                    {line.size} · ×{line.qty}
                  </p>
                </div>
                <span className="tabular-nums">{formatMoney(line.unitPrice * line.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-1 border-t border-fg pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Estimated shipping</span>
              <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
            </div>
            <div className="flex justify-between pt-2 uppercase tracking-[0.12em]">
              <span>Estimated total</span>
              <span className="tabular-nums">{formatMoney(total)}</span>
            </div>
            <p className="pt-3 text-xs leading-relaxed text-muted">
              Delivery and payment are confirmed with you on WhatsApp before your order is final.
            </p>
          </div>
        </aside>
      </form>
    </Shell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
