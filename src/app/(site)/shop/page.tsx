import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import { ShopCatalogClient } from "@/components/ShopCatalogClient";

export const metadata: Metadata = {
  title: "تصفح التشكيلات | المتجر",
  description:
    "استعرض جميع تشكيلات MO WORLD من ملابس الأطفال MO / KIDS والأساسيات الثقيلة MO / ESSENTIALS وإصدارات الاستوديو.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; filter?: string; q?: string }>;
}) {
  const [data, params] = await Promise.all([publicDB(), searchParams]);

  return (
    <ShopCatalogClient
      products={data.products}
      categories={data.categories}
      initialSub={params.sub ?? ""}
      initialFilter={params.filter ?? ""}
      initialQuery={params.q ?? ""}
    />
  );
}
