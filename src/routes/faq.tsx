import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout";

export const Route = createFileRoute("/faq")({ component: FAQ });

const items = [
  {
    q: "How do I order?",
    a: "Pick your size, tap Order on WhatsApp, and send the pre-filled message. We confirm availability, price and delivery with you.",
  },
  {
    q: "Do you deliver?",
    a: "Yes, we deliver in Kigali and can arrange delivery elsewhere in Rwanda. Ask us on WhatsApp for rates.",
  },
  {
    q: "How can I pay?",
    a: "We confirm payment options with you on WhatsApp when you place your order.",
  },
  {
    q: "Can I exchange the size?",
    a: "Message us as soon as you receive your order and we will sort out an exchange if stock allows.",
  },
];

function FAQ() {
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-5 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">FAQ</p>
          <h1 className="mt-3 text-3xl uppercase tracking-[0.18em] md:text-4xl">Everything you need to know.</h1>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.q}
                className="rounded-[1.5rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
              >
                <h2 className="text-sm uppercase tracking-[0.16em]">{item.q}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
