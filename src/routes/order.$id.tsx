import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout";
import { WHATSAPP_NUMBER } from "@/lib/brand";

export const Route = createFileRoute("/order/$id")({ component: OrderPage });

function OrderPage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Ashveil, I’d like to follow up about my order.")}`;

  return (
    <Shell>
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Ashveil orders</p>
        <h1 className="mt-3 text-2xl uppercase tracking-[0.2em]">Order via WhatsApp</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Orders are arranged directly with Ashveil. Availability, delivery, and payment are confirmed in the
          WhatsApp chat; this site does not take payment or store orders.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block text-sm uppercase tracking-[0.16em] underline underline-offset-4"
        >
          Continue on WhatsApp
        </a>
        <Link to="/shop" className="mt-4 block text-sm underline underline-offset-4">
          Back to shop
        </Link>
      </div>
    </Shell>
  );
}
