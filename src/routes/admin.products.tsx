import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { slugifyProductName, type Size } from "@/lib/products";
import { listAdminCatalog, upsertProduct, type CatalogProduct } from "@/lib/shop-fns";
import { cn, formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({ component: ProductsAdmin });

const ALL_SIZES: Size[] = ["S", "M", "L", "XL"];
const CATS = ["tees", "outerwear", "accessories"] as const;

function blank(): CatalogProduct {
  return {
    id: 0,
    slug: "",
    name: "",
    price: 4800,
    category: "tees",
    description: "",
    details: [],
    images: [{ src: "", alt: "" }],
    baagUrl: "",
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    active: true,
    stock: [],
  };
}

function ProductsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-catalog"], queryFn: () => listAdminCatalog() });
  const [edit, setEdit] = useState<CatalogProduct | null>(null);
  const [busy, setBusy] = useState(false);
  const [sizeDraft, setSizeDraft] = useState("");
  const [search, setSearch] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (q.data ?? []).filter((p) => {
      const matchesHidden = showHidden || p.active;
      if (!matchesHidden) return false;
      if (!term) return true;
      return `${p.name} ${p.category} ${p.slug}`.toLowerCase().includes(term);
    });
  }, [q.data, search, showHidden]);

  async function save() {
    if (!edit) return;
    const safeName = edit.name.trim();
    const safeSlug = (edit.slug.trim() || slugifyProductName(safeName)).toLowerCase();
    const safeDetails = Array.from(new Set(edit.details.map((d) => d.trim()).filter(Boolean))).slice(0, 6);
    const safeImages = edit.images
      .map((img) => ({ src: img.src.trim(), alt: (img.alt || safeName).trim() }))
      .filter((img) => img.src);
    const safeSizes = Array.from(new Set(edit.sizes.map((s) => s.trim()).filter(Boolean)));
    if (!safeName || !safeSlug) {
      toast.error("Give this piece a name before saving.");
      return;
    }
    setBusy(true);
    try {
      await upsertProduct({
        data: {
          id: edit.id || undefined,
          slug: safeSlug,
          name: safeName,
          price: Math.max(0, Math.round(edit.price)),
          category: edit.category,
          description: edit.description.trim(),
          details: safeDetails,
          images: safeImages,
          baagUrl: edit.baagUrl?.trim() ?? "",
          sizes: safeSizes,
          featured: Boolean(edit.featured),
          active: edit.active,
        },
      });
      toast("Saved");
      setEdit(null);
      await qc.invalidateQueries();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl uppercase tracking-[0.2em]">Products</h1>
        <Button type="button" onClick={() => setEdit(blank())}>
          New piece
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3 border border-fg p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or slug"
          />
        </div>
        <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
          <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} />
          Show hidden
        </label>
      </div>

      {edit ? (
        <form
          className="mt-8 grid gap-4 border border-fg p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Field label="Name">
            <Input
              value={edit.name}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  name: e.target.value,
                  slug: edit.slug || slugifyProductName(e.target.value),
                })
              }
              required
            />
          </Field>
          <Field label="Slug">
            <Input
              value={edit.slug}
              onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
              placeholder={slugifyProductName(edit.name || "piece")}
            />
          </Field>
          <Field label="Price (USD)">
            <Input
              type="number"
              min={0}
              step="0.01"
              value={(edit.price / 100).toString()}
              onChange={(e) => setEdit({ ...edit, price: Math.round(Number(e.target.value) * 100) })}
            />
          </Field>
          <Field label="Category">
            <select
              className="h-11 w-full bg-surface px-3 text-sm shadow-[0_0_0_1px_#111111]"
              value={edit.category}
              onChange={(e) => setEdit({ ...edit, category: e.target.value as CatalogProduct["category"] })}
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="BAAG product URL">
            <Input
              type="url"
              value={edit.baagUrl ?? ""}
              onChange={(e) => setEdit({ ...edit, baagUrl: e.target.value })}
              placeholder="https://ashveilvg.baag.cc/..."
            />
          </Field>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Details (one per line)</Label>
            <Textarea
              value={edit.details.join("\n")}
              onChange={(e) => setEdit({ ...edit, details: e.target.value.split("\n") })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Pictures</Label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:border-0 file:bg-ink file:px-4 file:text-xs file:uppercase file:tracking-[0.16em] file:text-bg"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                void Promise.all(files.map((file) => readImage(file, edit.name))).then((added) => {
                  setEdit((current) =>
                    current
                      ? {
                          ...current,
                          images: [...current.images.filter((i) => i.src.trim()), ...added],
                        }
                      : current,
                  );
                });
              }}
            />
            <p className="mt-2 text-xs text-muted">Upload photos from your phone or computer. They save with the product.</p>
            {edit.images.filter((i) => i.src.trim()).length ? (
              <ul className="mt-3 flex flex-wrap gap-3">
                {edit.images
                  .filter((i) => i.src.trim())
                  .map((img, i) => (
                    <li key={`${i}-${img.src.slice(0, 24)}`} className="relative">
                      <img src={img.src} alt="" className="h-24 w-20 object-cover" />
                      <button
                        type="button"
                        className="mt-1 block text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
                        onClick={() =>
                          setEdit({
                            ...edit,
                            images: edit.images.filter((x) => x.src !== img.src),
                          })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
          <fieldset className="md:col-span-2">
            <legend className="mb-2 text-[11px] uppercase tracking-[0.16em]">Sizes</legend>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...ALL_SIZES, ...edit.sizes])).map((size) => {
                const on = edit.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    className={cn("min-h-11 min-w-11 px-3", on ? "bg-ink text-bg" : "shadow-[0_0_0_1px_#111111]")}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        sizes: on ? edit.sizes.filter((s) => s !== size) : [...edit.sizes, size],
                      })
                    }
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={sizeDraft}
                placeholder="Add a size, e.g. XXL or 32"
                onChange={(e) => setSizeDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const next = sizeDraft.trim().toUpperCase();
                    if (!next || edit.sizes.includes(next)) return;
                    setEdit({ ...edit, sizes: [...edit.sizes, next] });
                    setSizeDraft("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const next = sizeDraft.trim().toUpperCase();
                  if (!next || edit.sizes.includes(next)) return;
                  setEdit({ ...edit, sizes: [...edit.sizes, next] });
                  setSizeDraft("");
                }}
              >
                Add size
              </Button>
            </div>
          </fieldset>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={edit.featured}
              onChange={(e) => setEdit({ ...edit, featured: e.target.checked })}
            />
            Featured on home
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={edit.active}
              onChange={(e) => setEdit({ ...edit, active: e.target.checked })}
            />
            Visible in shop
          </label>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted">
        <span>{filtered.length} piece{filtered.length === 1 ? "" : "s"}</span>
        <span>{(q.data ?? []).filter((p) => !p.active).length} hidden</span>
      </div>

      <ul className="mt-3 divide-y divide-fg border border-fg">
        {filtered.map((p) => (
          <li key={p.id} className="flex items-center gap-4 px-3 py-3">
            <img src={p.images[0]?.src || "/logo.png"} alt="" className="h-16 w-12 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm uppercase tracking-[0.12em]">{p.name}</p>
              <p className="text-xs text-muted">
                {p.category} · {formatMoney(p.price)}
                {p.active ? "" : " · hidden"}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => setEdit(p)}>
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function readImage(file: File, alt: string) {
  return new Promise<{ src: string; alt: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read photo"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1200;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ src: String(reader.result), alt });
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ src: canvas.toDataURL("image/jpeg", 0.82), alt });
      };
      img.onerror = () => reject(new Error("Could not read photo"));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
