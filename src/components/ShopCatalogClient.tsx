"use client";

import * as React from "react";
import { Grid2X2, LayoutGrid, Rows2, Search, X } from "lucide-react";
import type { Category, Product, SubBrand } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickModal } from "./ProductQuickModal";

interface ShopCatalogClientProps {
  products: Product[];
  categories: Category[];
  initialSub?: string;
  initialFilter?: string;
  initialQuery?: string;
}

const SUB_BRANDS: SubBrand[] = [
  "MO / KIDS",
  "MO / ESSENTIALS",
  "MO / STUDIO",
  "MO / ARCHIVE",
];

export function ShopCatalogClient({
  products,
  categories,
  initialSub = "",
  initialFilter = "",
  initialQuery = "",
}: ShopCatalogClientProps) {
  const propSyncKey = `${initialSub}|${initialFilter}|${initialQuery}`;
  const [trackedKey, setTrackedKey] = React.useState(propSyncKey);

  const validInitialSub = SUB_BRANDS.includes(initialSub as SubBrand)
    ? (initialSub as SubBrand)
    : "ALL";

  const [selectedSub, setSelectedSub] = React.useState<"ALL" | "NEW" | SubBrand>(
    initialFilter === "new" ? "NEW" : validInitialSub,
  );
  const [ageFilter, setAgeFilter] = React.useState<"all" | "kids" | "adult" | "oversized">("all");
  const [query, setQuery] = React.useState(initialQuery);
  const [gridDensity, setGridDensity] = React.useState<"editorial" | "standard" | "compact">("standard");
  const [inspected, setInspected] = React.useState<Product | null>(null);

  if (propSyncKey !== trackedKey) {
    setTrackedKey(propSyncKey);
    setSelectedSub(
      initialFilter === "new"
        ? "NEW"
        : SUB_BRANDS.includes(initialSub as SubBrand)
          ? (initialSub as SubBrand)
          : "ALL",
    );
    setQuery(initialQuery);
  }

  const available = React.useMemo(
    () => products.filter((p) => p.isAvailable),
    [products],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return available.filter((p) => {
      if (selectedSub === "NEW" && !p.isNewDrop) return false;
      if (selectedSub !== "ALL" && selectedSub !== "NEW" && p.subBrand !== selectedSub) {
        return false;
      }
      if (ageFilter === "kids" && p.ageGroup !== "kids") return false;
      if (ageFilter === "adult" && p.ageGroup === "kids") return false;
      if (ageFilter === "oversized" && p.fitType !== "Oversized" && p.fitType !== "Boxy") {
        return false;
      }
      if (q) {
        const hay = `${p.nameAr} ${p.nameEn} ${p.code} ${p.subBrand} ${p.fabricSpec}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [available, selectedSub, ageFilter, query]);

  const activeCategoryMeta = categories.find((c) => c.subBrand === selectedSub);

  const gridClasses =
    gridDensity === "editorial"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-10"
      : gridDensity === "compact"
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-7"
        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-9";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
          {selectedSub === "ALL"
            ? "MO WORLD // FULL ARCHIVE & SEASONAL CATALOG"
            : selectedSub === "NEW"
              ? "MO WORLD // NEW DROPS"
              : selectedSub}
        </p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              {activeCategoryMeta
                ? activeCategoryMeta.nameAr
                : selectedSub === "NEW"
                  ? "أحدث الإصدارات الشتوية"
                  : "جميع تشكيلات الدار"}
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-[var(--text-muted)] sm:text-sm">
              {activeCategoryMeta
                ? activeCategoryMeta.descriptionAr
                : "تصفح جميع خطوط الدار من ملابس الأطفال الفليس والكارجو حتى الأساسيات الثقيلة وإصدارات الاستوديو."}
            </p>
          </div>
          <p dir="ltr" className="font-en text-xs font-semibold tracking-wider text-[var(--text-muted)]">
            SHOWING {filtered.length} / {available.length} PIECES
          </p>
        </div>
      </div>

      {/* Controls Bar: Slash Tabs + Search + Zara Grid Density Switcher */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          {/* Sub-brand pills */}
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedSub("ALL")}
              className={`shrink-0 rounded-[4px] border px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedSub === "ALL"
                  ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
              }`}
            >
              الكل ({available.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedSub("NEW")}
              className={`shrink-0 rounded-[4px] border px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedSub === "NEW"
                  ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
              }`}
            >
              وصل حديثاً
            </button>
            {SUB_BRANDS.map((sb) => (
              <button
                key={sb}
                type="button"
                dir="ltr"
                onClick={() => setSelectedSub(sb)}
                className={`shrink-0 rounded-[4px] border px-3.5 py-2 font-en text-[11px] font-semibold tracking-[0.14em] transition-colors ${
                  selectedSub === sb
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                }`}
              >
                {sb}
              </button>
            ))}
          </div>

          {/* Search + View Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]"
                strokeWidth={1.5}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الكود (MW-KD-01)..."
                className="h-9 w-full rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] pr-9 pl-8 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-accent)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="مسح البحث"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Zara View Density Switcher */}
            <div
              role="group"
              aria-label="طريقة عرض الشبكة"
              className="inline-flex shrink-0 items-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5"
            >
              <button
                type="button"
                onClick={() => setGridDensity("editorial")}
                aria-label="عرض كبير"
                title="عرض كبير"
                className={`inline-flex size-8 items-center justify-center rounded-[3px] transition-colors ${
                  gridDensity === "editorial"
                    ? "bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Rows2 className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setGridDensity("standard")}
                aria-label="عرض قياسي"
                title="عرض قياسي"
                className={`inline-flex size-8 items-center justify-center rounded-[3px] transition-colors ${
                  gridDensity === "standard"
                    ? "bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Grid2X2 className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setGridDensity("compact")}
                aria-label="عرض مكثف"
                title="عرض مكثف"
                className={`inline-flex size-8 items-center justify-center rounded-[3px] transition-colors ${
                  gridDensity === "compact"
                    ? "bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <LayoutGrid className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Fit / Age Filter */}
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-[var(--border-subtle)] pb-4 text-xs">
          <span className="shrink-0 text-[var(--text-muted)]">تصفية حسب القصّة والفئة:</span>
          {[
            { id: "all", label: "الكل" },
            { id: "kids", label: "أطفال (4-12 سنة)" },
            { id: "adult", label: "شبابي ويونيسكس (S–XL)" },
            { id: "oversized", label: "قصّة Oversized / Boxy" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setAgeFilter(f.id as typeof ageFilter)}
              className={`shrink-0 rounded-[4px] border px-3 py-1 transition-colors ${
                ageFilter === f.id
                  ? "border-[var(--text-primary)] bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="my-16 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            لا توجد قطع مطابقة لخيارات التصفية الحالية
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            جرب إعادة ضبط الفلتر لاستعراض جميع خطوط MO WORLD المتاحة.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSub("ALL");
              setAgeFilter("all");
              setQuery("");
            }}
            className="mt-4 rounded-[4px] bg-[var(--brand-accent)] px-5 py-2.5 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
          >
            عرض جميع القطع
          </button>
        </div>
      ) : (
        <div className={`mt-8 grid ${gridClasses}`}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact={gridDensity === "compact"}
              onInspect={(p) => setInspected(p)}
            />
          ))}
        </div>
      )}

      <ProductQuickModal
        product={inspected}
        allProducts={available}
        onSelectProduct={(p) => setInspected(p)}
        onClose={() => setInspected(null)}
      />
    </div>
  );
}
