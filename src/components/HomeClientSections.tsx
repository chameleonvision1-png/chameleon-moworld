"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product, SubBrand } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickModal } from "./ProductQuickModal";

const TABS: Array<{ key: "ALL" | SubBrand; labelAr: string; labelEn: string }> = [
  { key: "ALL", labelAr: "مختارات الدار", labelEn: "CURATED EDIT" },
  { key: "MO / KIDS", labelAr: "أطفال", labelEn: "MO / KIDS" },
  { key: "MO / ESSENTIALS", labelAr: "الأساسيات", labelEn: "MO / ESSENTIALS" },
  { key: "MO / STUDIO", labelAr: "الاستوديو", labelEn: "MO / STUDIO" },
  { key: "MO / ARCHIVE", labelAr: "الأرشيف", labelEn: "MO / ARCHIVE" },
];

export function HomeFeaturedGallery({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = React.useState<"ALL" | SubBrand>("ALL");
  const [inspected, setInspected] = React.useState<Product | null>(null);

  const available = React.useMemo(
    () => products.filter((p) => p.isAvailable),
    [products],
  );

  const visibleProducts = React.useMemo(() => {
    if (activeTab === "ALL") {
      const featured = available.filter((p) => p.isFeatured);
      return (featured.length >= 8 ? featured : available).slice(0, 8);
    }
    return available.filter((p) => p.subBrand === activeTab).slice(0, 8);
  }, [available, activeTab]);

  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
              GALLERY CATALOG // 4:5 STUDIO VIEW
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              تشكيلة الموسم المختارة
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              اضغط على علامة (+) لإضافة المقاس مباشرة، أو افتح القطعة لمعاينة الوجه والظهر وجدول المقاسات.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] sm:self-auto"
          >
            <span>عرض الكتالوج الكامل ({available.length})</span>
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Architectural Slash Filter Strip */}
        <div className="no-scrollbar mt-6 flex items-center gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-[4px] border px-3.5 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                }`}
              >
                <span>{tab.labelAr}</span>
                {tab.key !== "ALL" && (
                  <span
                    dir="ltr"
                    className={`font-en text-[10px] tracking-[0.14em] ${
                      active ? "text-[#F6F5F2]/85" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {tab.labelEn}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4:5 Product Grid */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInspect={(p) => setInspected(p)}
            />
          ))}
        </div>
      </div>

      <ProductQuickModal
        product={inspected}
        allProducts={available}
        onSelectProduct={(p) => setInspected(p)}
        onClose={() => setInspected(null)}
      />
    </section>
  );
}
