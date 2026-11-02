import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/lib/use-catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { data = [] } = useCatalog();
  const featured = data.filter((p) => p.featured);
  return (
    <Shell>
      <section className="border-b border-white/30">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
          <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.1)] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-12">
            <div className="flex flex-col items-center text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Ashveil studio</p>
              <img src="/logo.png" alt="Ashveil" className="mt-6 h-auto w-full max-w-[620px] object-contain outline-none" />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                WORN BY THE ONES WHO STAY. 
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/shop">
                  <Button>Shop the drop</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">Read the story</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4 px-1">
            <h2 className="text-sm uppercase tracking-[0.22em] text-fg">This drop</h2>
            <Link
              to="/shop"
              className="rounded-full border border-white/40 bg-[rgba(255,255,255,0.12)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl transition hover:bg-[rgba(255,255,255,0.18)]"
            >
              All pieces
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-3 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <div key={p.slug} className="overflow-hidden rounded-[1.5rem] border border-white/35 bg-[rgba(255,255,255,0.1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-4 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-6">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Built to keep moving</p>
              <h2 className="mt-2 text-2xl uppercase tracking-[0.18em]">Made for everyday wear.</h2>
            </div>
            <Link
              to="/care"
              className="self-start rounded-full border border-white/40 bg-[rgba(255,255,255,0.12)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl transition hover:bg-[rgba(255,255,255,0.18)]"
            >
              Care notes
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Heavy cotton",
                body: "A dense, structured hand that keeps the silhouette clean through the week.",
              },
              {
                title: "Graphic restraint",
                body: "Black, white, and grainy marks built to read loud up close and stay quiet from a distance.",
              },
              {
                title: "Small runs",
                body: "Each drop is limited and direct from the studio, with no overproduction.",
              },
            ].map((note) => (
              <div
                key={note.title}
                className="rounded-[1.5rem] border border-white/40 bg-[rgba(255,255,255,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{note.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
