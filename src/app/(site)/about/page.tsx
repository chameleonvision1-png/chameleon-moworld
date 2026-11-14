/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "قصة MO WORLD | من ملابس الأطفال إلى دار أزياء عصرية",
  description:
    "رحلة التطور الاستراتيجي من MO Children's World إلى الهوية الشاملة MO WORLD — Frontier Fashion Hub.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="text-center lg:col-span-6 lg:text-right">
          <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
            OUR EVOLUTION
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-4xl">
            من أزياء الأطفال إلى دار أزياء عصرية متكاملة
          </h1>
          <p
            dir="ltr"
            className="font-editorial mt-2 text-xl text-[var(--text-muted)] sm:text-3xl"
          >
            Frontier Fashion Hub — Built for Every Generation.
          </p>

          <div className="mt-5 space-y-3.5 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
            <p>
              بدأت حكاية الدار كمجتمع متخصص في ملابس الأطفال العصرية وأطقم الخروج المتناسقة التي تمنح الطفل راحة حقيقية وأناقة هادئة بعيداً عن الرسومات المزدحمة التقليدية.
            </p>
            <p>
              ومع نمو ثقة العائلات وطلب الشباب المستمر لنفس جودة القطن المصري الثقيل والقصّات الهادئة، تطورت العلامة استراتيجياً إلى دار أزياء شاملة تحتفظ بملابس الأطفال كركيزة أساسية، بالتوازي مع التوسع الكامل في خطوط الشباب واليونيسكس والجاكيتات الموسمية.
            </p>
          </div>

          <div className="mx-auto mt-7 grid max-w-[320px] grid-cols-2 gap-2.5 sm:max-w-sm lg:mx-0">
            <Link
              href="/shop"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] whitespace-nowrap hover:bg-[var(--brand-accent-hover)]"
            >
              <span>تصفح التشكيلة</span>
              <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
            </Link>
            <Link
              href="/brand"
              className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap hover:border-[var(--text-primary)]"
            >
              <span>الهوية والتغليف</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-6">
          <img
            src="/images/brand/launch-manifesto.webp"
            alt="MO WORLD Brand Manifesto"
            className="aspect-[4/5] w-full rounded-[4px] border border-[var(--border-subtle)] object-cover"
          />
          <img
            src="/images/brand/editorial-winter-campaign.webp"
            alt="MO WORLD Editorial Campaign"
            className="aspect-[4/5] w-full rounded-[4px] border border-[var(--border-subtle)] object-cover"
          />
        </div>
      </div>

      {/* Three Pillars */}
      <div className="mt-16 grid grid-cols-1 gap-5 border-t border-[var(--border-subtle)] pt-12 md:grid-cols-3">
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-accent)]">
            01 // EGYPTIAN HEAVYWEIGHT COTTON
          </p>
          <h2 className="mt-2 text-base font-bold text-[var(--text-primary)]">
            خامات قطن مصري من ٢٤٠ إلى ٤٢٠ جرام
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            نختار خيوط القطن المصري الممشط بعناية فائقة ومعالجة ضد الانكماش والوبرة لضمان ملمس ناعم على بشرة الأطفال وقوام متماسك يدوم لسنوات.
          </p>
        </div>

        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-accent)]">
            02 // SLASH ARCHITECTURE
          </p>
          <h2 className="mt-2 text-base font-bold text-[var(--text-primary)]">
            تنظيم واضح عبر أربعة خطوط متخصصة
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            تقسيم معماري صريح يفصل بين أطقم الأطفال (KIDS) والأساسيات اليومية (ESSENTIALS) والقطع الموسمية المركبة (STUDIO) والإصدارات المحدودة (ARCHIVE).
          </p>
        </div>

        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-accent)]">
            03 // TRANSPARENT COMMERCE
          </p>
          <h2 className="mt-2 text-base font-bold text-[var(--text-primary)]">
            ثقة الشراء أونلاين ومعاينة فعلية
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            قياس فعلي بالسنتيمتر لكل قطعة، دفع عند الاستلام، ومعاينة كاملة للأوردر مع المندوب قبل الاستلام مع ضمان استبدال واسترجاع خلال ١٤ يوماً.
          </p>
        </div>
      </div>
    </div>
  );
}
