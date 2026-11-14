"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product, SubBrand } from "@/lib/types";
import { OpeningSoonBoard } from "./OpeningSoonBoard";
import { ProductCard } from "./ProductCard";
import { ProductQuickModal } from "./ProductQuickModal";

const TABS: Array<{ key: "ALL" | SubBrand; labelAr: string; openingSoon?: boolean }> = [
  { key: "MO / KIDS", labelAr: "أطفال" },
  { key: "ALL", labelAr: "الكل" },
  { key: "MO / ESSENTIALS", labelAr: "الأساسيات • قريباً", openingSoon: true },
  { key: "MO / STUDIO", labelAr: "الاستوديو • قريباً", openingSoon: true },
  { key: "MO / ARCHIVE", labelAr: "الأرشيف • قريباً", openingSoon: true },
];

export function HomeFeaturedGallery({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = React.useState<"ALL" | SubBrand>("MO / KIDS");
  const [inspected, setInspected] = React.useState<Product | null>(null);

  const available = React.useMemo(
    () => products.filter((p) => p.isAvailable),
    [products],
  );

  const isSectionLocked =
    activeTab === "MO / ESSENTIALS" ||
    activeTab === "MO / STUDIO" ||
    activeTab === "MO / ARCHIVE";

  const visibleProducts = React.useMemo(() => {
    if (activeTab === "MO / KIDS") {
      return available.filter((p) => p.subBrand === "MO / KIDS").slice(0, 8);
    }
    if (activeTab === "ALL") {
      const kids = available.filter((p) => p.subBrand === "MO / KIDS");
      const youthPreview = available.filter((p) => p.subBrand !== "MO / KIDS").slice(0, 4);
      return [...kids, ...youthPreview];
    }
    return available.filter((p) => p.subBrand === activeTab).slice(0, 8);
  }, [available, activeTab]);

  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Symmetric Centered Header */}
        <div className="mx-auto max-w-xl text-center">
          <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
            {isSectionLocked ? `${activeTab} // OPENING SOON` : "MO / KIDS • OPEN NOW"}
          </p>
          <h2 className="mt-1.5 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            {isSectionLocked ? "معاينة مسبقة لقسم الشباب" : "تشكيلة الأطفال الشتوية"}
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
            {isSectionLocked
              ? "هذا القسم معروض للمعاينة فقط قبل الافتتاح الرسمي ولا يمكن الشراء منه حالياً."
              : "اضغط (+) لإضافة مقاس طفلك مباشرة أو افتح الطقم لمعاينة الوجه والظهر."}
          </p>
        </div>

        {/* Symmetric Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex h-8.5 items-center justify-center rounded-[4px] border px-3 text-xs font-semibold whitespace-nowrap transition-colors sm:h-9 sm:px-3.5 ${
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

        {/* 4:5 Product Grid + Large Floating Opening Soon Board for Locked Youth Sections */}
        <div className="relative mt-8">
          <div
            aria-hidden={isSectionLocked || undefined}
            className={`grid grid-cols-2 gap-x-3.5 gap-y-7 transition-all duration-300 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-4 ${
              isSectionLocked
                ? "pointer-events-none min-h-[420px] select-none opacity-35 blur-[1.5px]"
                : ""
            }`}
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInspect={(p) => setInspected(p)}
              />
            ))}
          </div>

          {isSectionLocked && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-6">
              <OpeningSoonBoard
                subBrandLabel={`${activeTab} // PREVIEW ONLY`}
                titleEn="OPENING SOON"
                titleAr="قسم الشباب يُفتتح قريباً"
                onSwitchToKids={() => setActiveTab("MO / KIDS")}
              />
            </div>
          )}
        </div>

        {/* Centered Symmetric View-All Action */}
        <div className="mt-9 flex justify-center">
          <Link
            href="/shop?sub=MO+%2F+KIDS"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
          >
            <span>تصفح كتالوج الأطفال الكامل</span>
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
