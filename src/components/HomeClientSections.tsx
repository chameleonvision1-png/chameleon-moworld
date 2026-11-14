"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product, SubBrand } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickModal } from "./ProductQuickModal";

const TABS: Array<{ key: "ALL" | SubBrand; labelAr: string }> = [
  { key: "ALL", labelAr: "الكل" },
  { key: "MO / KIDS", labelAr: "أطفال" },
  { key: "MO / ESSENTIALS", labelAr: "الأساسيات" },
  { key: "MO / STUDIO", labelAr: "الاستوديو" },
  { key: "MO / ARCHIVE", labelAr: "الأرشيف" },
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
    <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Symmetric Centered Header */}
        <div className="mx-auto max-w-xl text-center">
          <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
            GALLERY EDIT
          </p>
          <h2 className="mt-1.5 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            مختارات الموسم
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
            اضغط (+) لإضافة مقاسك مباشرة أو افتح القطعة لمعاينة التفاصيل.
          </p>
        </div>

        {/* Symmetric Single-Row Filter Pills (Fits 100% on mobile without clipping) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex h-8.5 items-center justify-center rounded-[4px] border px-3 text-xs font-semibold whitespace-nowrap transition-colors sm:h-9 sm:px-4 ${
                  active
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                }`}
              >
                {tab.labelAr}
              </button>
            );
          })}
        </div>

        {/* 4:5 Product Grid */}
        <div className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-7 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInspect={(p) => setInspected(p)}
            />
          ))}
        </div>

        {/* Centered Symmetric View-All Action */}
        <div className="mt-9 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
          >
            <span>عرض الكتالوج الكامل ({available.length})</span>
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </Link>
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
