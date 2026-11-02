import { useQuery } from "@tanstack/react-query";
import { PRODUCTS } from "@/lib/products";
import { getProductBySlug, listProducts, type CatalogProduct } from "@/lib/shop-fns";

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: () => listProducts(),
    placeholderData: PRODUCTS.map((p, i) => ({
      ...p,
      id: i + 1,
      active: true,
      stock: p.sizes.map((size) => ({ size, qty: 12 })),
    })) as CatalogProduct[],
  });
}

export function useCatalogProduct(slug: string) {
  return useQuery({
    queryKey: ["catalog", slug],
    queryFn: () => getProductBySlug({ data: slug }),
  });
}
