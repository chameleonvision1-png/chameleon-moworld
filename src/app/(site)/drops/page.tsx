import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { publicDB } from "@/lib/db";
import { DropCard } from "@/components/DropCard";

export const metadata: Metadata = {
  title: "الكبسولات والأطقم المجمعة",
  description:
    "إصدارات الكبسولات الموسمية والأطقم المنسقة للأطفال والشباب من MO WORLD بسعر باكدج خاص.",
};

export default async function DropsPage() {
  const data = await publicDB();
  const availableProducts = data.products.filter((p) => p.isAvailable);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="border-b border-[var(--border-subtle)] pb-8">
        <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
          SEASONAL CAPSULES &amp; BUNDLES
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              الكبسولات والأطقم المجمعة
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
              نسّقنا لك أفضل القطع المتناغمة في باكدجات جاهزة للأطفال والشباب بأسعار مخفضة وتغليف الهدايا المعتمد من MO WORLD مع معاينة كاملة عند الاستلام.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] sm:self-auto"
          >
            <span>تصفح القطع الفردية</span>
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {data.drops.length === 0 ? (
        <div className="my-16 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            يتم تجهيز كبسولة الموسم الجديدة حالياً
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-2.5 text-xs font-semibold text-[#F6F5F2]"
          >
            <span>تصفح الكتالوج الكامل</span>
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.drops.map((drop) => (
            <DropCard key={drop.id} drop={drop} products={availableProducts} />
          ))}
        </div>
      )}
    </div>
  );
}
