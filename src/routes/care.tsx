import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout";

export const Route = createFileRoute("/care")({ component: CarePage });

function CarePage() {
  return (
    <Shell>
      <article className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-5 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Care + notes</p>
          <h1 className="mt-3 text-2xl uppercase tracking-[0.24em]">Keep the drop alive.</h1>

          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
            <p>
              Ashveil pieces are washed for softness but still built like workwear: a little structure, a little grain,
              and enough weight to hold their shape.
            </p>
            <p>
              Wash cold on a gentle cycle. Turn pieces inside out. Skip bleach, fabric softener, and high-heat drying,
              and let the cotton keep its hand.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              <p className="text-[11px] uppercase tracking-[0.16em]">Fit</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">Boxy, oversized, and meant to sit relaxed.</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              <p className="text-[11px] uppercase tracking-[0.16em]">Laundry</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">Cold wash, low tumble, no harsh detergents.</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/35 bg-[rgba(255,255,255,0.08)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              <p className="text-[11px] uppercase tracking-[0.16em]">Wear</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">Built for everyday rotation, not delicate storage.</p>
            </div>
          </div>

          <div className="mt-10 text-sm leading-relaxed text-muted">
            <p>
              If you need help with sizing or a custom order, reach out through the contact page and we’ll reply direct.
            </p>
          </div>
        </div>
      </article>
    </Shell>
  );
}
