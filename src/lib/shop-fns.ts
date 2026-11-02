import { createServerFn } from "@tanstack/react-start";
import { dbSource, getSql } from "@/lib/db";
import { adminMiddleware } from "@/lib/admin-guard";
import { PRODUCTS, slugifyProductName, type Product, type Size } from "@/lib/products";

export type CatalogProduct = Product & {
  id: number;
  active: boolean;
  stock: { size: string; qty: number }[];
};

function asJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  }
  return v as T;
}

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  details: unknown;
  images: unknown;
  sizes: unknown;
  featured: boolean;
  active: boolean;
  baag_url: string;
};

function mapProduct(row: ProductRow, stock: { size: string; qty: number }[]): CatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    category: row.category as CatalogProduct["category"],
    description: row.description,
    details: asJson<string[]>(row.details, []),
    images: asJson<{ src: string; alt: string }[]>(row.images, []),
    sizes: asJson<Size[]>(row.sizes, ["S", "M", "L", "XL"]),
    baagUrl: row.baag_url || "",
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    stock,
  };
}

async function ensureSeed() {
  const sql = await getSql();
  const count = await sql<{ n: number }>`select count(*)::int as n from products`;
  if ((count[0]?.n ?? 0) > 0) return;
  for (const p of PRODUCTS) {
    const inserted = await sql<{ id: number }>`
      insert into products (slug, name, price, category, description, details, images, sizes, featured, active)
      values (
        ${p.slug}, ${p.name}, ${p.price}, ${p.category}, ${p.description},
        ${JSON.stringify(p.details)}, ${JSON.stringify(p.images)}, ${JSON.stringify(p.sizes)},
        ${p.featured ?? false}, ${true}
      )
      returning id
    `;
    const id = inserted[0]?.id;
    if (!id) continue;
    const qty = p.category === "accessories" ? 20 : p.category === "outerwear" ? 8 : 12;
    for (const size of p.sizes) {
      await sql`insert into stock (product_id, size, qty) values (${id}, ${size}, ${qty})`;
    }
  }
}

function builtInCatalog(): CatalogProduct[] {
  return PRODUCTS.map((product, index) => ({
    ...product,
    id: index + 1,
    active: true,
    stock: product.sizes.map((size) => ({
      size,
      qty:
        product.category === "accessories"
          ? 20
          : product.category === "outerwear"
            ? 8
            : 12,
    })),
  }));
}

async function loadStock(productId: number) {
  const sql = await getSql();
  return sql<{ size: string; qty: number }>`
    select size, qty from stock where product_id = ${productId} order by size
  `;
}

async function loadAll(): Promise<CatalogProduct[]> {
  if (dbSource === "unconfigured") return builtInCatalog();
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql<ProductRow>`select * from products order by id`;
  const out: CatalogProduct[] = [];
  for (const row of rows) {
    out.push(mapProduct(row, await loadStock(row.id)));
  }
  return out;
}

export const getShopCapabilities = createServerFn({ method: "GET" }).handler(async () => ({
  databaseConfigured: dbSource !== "unconfigured",
}));

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const all = await loadAll();
  return all.filter((p) => p.active);
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const all = await loadAll();
    return all.find((p) => p.slug === slug && p.active) ?? null;
  });

export const listAdminCatalog = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => loadAll());

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(
    (d: {
      id?: number;
      slug: string;
      name: string;
      price: number;
      category: string;
      description: string;
      details: string[];
      images: { src: string; alt: string }[];
      sizes: Size[];
      featured: boolean;
      active: boolean;
      baagUrl: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const safeName = data.name.trim();
    const slug = (data.slug.trim() || slugifyProductName(safeName)).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const price = Math.max(0, Math.round(data.price));
    if (!safeName || !slug) throw new Error("Name and slug are required");
    const baagUrl = data.baagUrl.trim();
    if (baagUrl) {
      let url: URL;
      try {
        url = new URL(baagUrl);
      } catch {
        throw new Error("Enter a valid BAAG product URL.");
      }
      if (
        url.protocol !== "https:" ||
        (url.hostname !== "baag.cc" && !url.hostname.endsWith(".baag.cc")) ||
        url.username ||
        url.password
      ) {
        throw new Error("The product link must be an HTTPS URL on baag.cc.");
      }
    }
    let id = data.id;
    if (id) {
      await sql`
        update products set
          slug = ${slug},
          name = ${safeName},
          price = ${price},
          category = ${data.category},
          description = ${data.description.trim()},
          details = ${JSON.stringify(data.details.map((d) => d.trim()).filter(Boolean))},
          images = ${JSON.stringify(data.images.filter((img) => img.src.trim()).map((img) => ({ ...img, alt: img.alt || safeName, src: img.src.trim() })))},
          sizes = ${JSON.stringify(Array.from(new Set(data.sizes.map((s) => String(s).trim()).filter(Boolean))) )},
          baag_url = ${baagUrl},
          featured = ${data.featured},
          active = ${data.active}
        where id = ${id}
      `;
    } else {
      const inserted = await sql<{ id: number }>`
        insert into products (slug, name, price, category, description, details, images, sizes, baag_url, featured, active)
        values (
          ${slug}, ${safeName}, ${price}, ${data.category}, ${data.description.trim()},
          ${JSON.stringify(data.details.map((d) => d.trim()).filter(Boolean))}, ${JSON.stringify(data.images.filter((img) => img.src.trim()).map((img) => ({ ...img, alt: img.alt || safeName, src: img.src.trim() })))}, ${JSON.stringify(Array.from(new Set(data.sizes.map((s) => String(s).trim()).filter(Boolean))))}, ${baagUrl},
          ${data.featured}, ${data.active}
        )
        returning id
      `;
      id = inserted[0]?.id;
    }
    if (!id) throw new Error("Could not save product");
    const existing = await sql<{ size: string }>`select size from stock where product_id = ${id}`;
    const have = new Set(existing.map((r) => r.size));
    for (const size of data.sizes) {
      if (!have.has(size)) {
        await sql`insert into stock (product_id, size, qty) values (${id}, ${size}, ${0})`;
      }
    }
    return { id };
  });

export const setStockQty = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator((d: { productId: number; size: string; qty: number }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const qty = Math.max(0, Math.round(data.qty));
    await sql`
      insert into stock (product_id, size, qty) values (${data.productId}, ${data.size}, ${qty})
      on conflict (product_id, size) do update set qty = ${qty}
    `;
  });

export const addLedgerEntry = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator((d: { kind: "income" | "expense"; source: string; amount: number; note: string }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const amount = Math.max(0, Math.round(data.amount));
    if (!amount) throw new Error("Amount required");
    await sql`
      insert into ledger (kind, source, amount, note)
      values (${data.kind}, ${data.source}, ${amount}, ${data.note.trim()})
    `;
  });

export const listLedger = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    if (dbSource === "unconfigured") return [];
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      kind: string;
      source: string;
      amount: number;
      note: string;
      order_id: string | null;
      created_at: string;
    }>`select id, kind, source, amount, note, order_id, created_at from ledger order by created_at desc, id desc`;
    return rows.map((r) => ({ ...r, amount: Number(r.amount) }));
  });

export const getStudioSummary = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    if (dbSource === "unconfigured") {
      const catalog = builtInCatalog();
      const units = catalog.reduce(
        (total, product) =>
          total + product.stock.reduce((stockTotal, item) => stockTotal + item.qty, 0),
        0,
      );
      const low = catalog.flatMap((product) =>
        product.stock
          .filter((item) => item.qty <= 3)
          .map((item) => ({
            name: product.name,
            slug: product.slug,
            size: item.size,
            qty: item.qty,
          })),
      );
      return { income: 0, expense: 0, net: 0, units, low };
    }
    const sql = await getSql();
    const money = await sql<{ kind: string; total: number }>`
      select kind, coalesce(sum(amount), 0)::int as total from ledger group by kind
    `;
    const income = Number(money.find((r) => r.kind === "income")?.total ?? 0);
    const expense = Number(money.find((r) => r.kind === "expense")?.total ?? 0);
    const catalog = await loadAll();
    const units = catalog.reduce((n, p) => n + p.stock.reduce((s, x) => s + Number(x.qty), 0), 0);
    const low = catalog.flatMap((p) =>
      p.stock
        .filter((s) => Number(s.qty) <= 3)
        .map((s) => ({ name: p.name, slug: p.slug, size: s.size, qty: Number(s.qty) })),
    );
    return { income, expense, net: income - expense, units, low };
  });

export const recordSale = createServerFn({ method: "POST" })
  .validator(
    (d: {
      orderId: string;
      total: number;
      items: { slug: string; size: string; qty: number }[];
    }) => d,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const catalog = await loadAll();
    for (const item of data.items) {
      const p = catalog.find((x) => x.slug === item.slug);
      if (!p) continue;
      const row = p.stock.find((s) => s.size === item.size);
      const next = Math.max(0, Number(row?.qty ?? 0) - item.qty);
      await sql`
        insert into stock (product_id, size, qty) values (${p.id}, ${item.size}, ${next})
        on conflict (product_id, size) do update set qty = ${next}
      `;
    }
    await sql`
      insert into ledger (kind, source, amount, note, order_id)
      values (${"income"}, ${"sale"}, ${Math.max(0, Math.round(data.total))}, ${"Store sale"}, ${data.orderId})
    `;
  });
