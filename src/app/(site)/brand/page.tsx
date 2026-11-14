/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "الهوية البصرية والتغليف | Atelier",
  description:
    "استعرض تفاصيل الهوية المعمارية لـ MO WORLD، الشعار المنحوت، نظام الألوان، وتفاصيل الليبل والتغليف الرسمي.",
};

const PALETTE = [
  { nameEn: "STUDIO ALABASTER", nameAr: "ألاباستر الاستوديو", hex: "#F6F5F2", textDark: true },
  { nameEn: "WARM STONE", nameAr: "ستون دافئ", hex: "#DDD8CE", textDark: true },
  { nameEn: "DEEP OBSIDIAN", nameAr: "أوبسيديان داكن", hex: "#0E1012", textDark: false },
  { nameEn: "PETROL SLATE", nameAr: "بترولي سليت", hex: "#1F5668", textDark: false },
];

const TOUCHPOINTS = [
  {
    code: "TOUCHPOINT // 01",
    titleAr: "الليبل المنسوج والتيكت القطني ٧٠٠ جرام",
    descAr:
      "ليبل رقبة منسوج بنول عالي الكثافة على خلفية أوبسيديان غير لامعة مع تيكت قطني سميك بدبوس معدني مطفي يحمل شعار MO المنحوت.",
    img: "/images/brand/tags-labels-hardware.webp",
  },
  {
    code: "TOUCHPOINT // 02",
    titleAr: "صندوق الهدايا المغناطيسي وصالة العرض",
    descAr:
      "علبة صلبة مطفية بلون الألاباستر للإصدارات الخاصة وأطقم الهدايا مع ورق زبدة داخلي مختوم بشعار الدار.",
    img: "/images/brand/unboxing-showroom.webp",
  },
  {
    code: "TOUCHPOINT // 03",
    titleAr: "أكياس الشحن المقاومة للمياه وكارت العناية",
    descAr:
      "أكياس شحن سميكة مقاومة للرطوبة والتمزق مرفق بها كارت إرشادات الغسيل وسياسة المعاينة والاستبدال خلال ١٤ يوماً.",
    img: "/images/brand/mailers-care-card.webp",
  },
  {
    code: "TOUCHPOINT // 04",
    titleAr: "مطبوعات الاستوديو وبطاقات الهوية",
    descAr:
      "بطاقات قطنية بحواف مطلية باللون البترولي تعكس الدقة السويسرية في كل تفصيلة داخل منظومة MO WORLD.",
    img: "/images/brand/staff-id-cards.webp",
  },
];

export default function BrandAtelierPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-8">
        <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
          ATELIER &amp; DESIGN SYSTEM // CONCEPT 07
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          الهوية البصرية، الشعار المنحوت وتفاصيل التغليف
        </h1>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
          صُممت هوية MO WORLD لتجمع بين البساطة المعمارية السويسرية وبين علامة تايبوغرافية منحوتة بدقة فائقة (Sculptural Concept 07) تحافظ على ثباتها ووضوحها على الشاشات الرقمية والمنسوجات الفاخرة.
        </p>
      </div>

      {/* 4 Sculptural SVG Lockups Live Preview */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
            النسخ الأربع المعتمدة للشعار (Vector SVG)
          </h2>
          <span dir="ltr" className="font-en text-[11px] font-semibold tracking-wider text-[var(--text-muted)]">
            LIGHT / DARK ADAPTIVE
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <span dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)]">
              01 // LOGO ICON
            </span>
            <div className="my-8 flex items-center justify-center">
              <BrandLogo variant="monogram" className="h-14 w-auto" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              أيقونة الشعار المختصرة (MO) للعلامات المنسوجة والأختام المعدنية والمساحات المحدودة.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <span dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)]">
              02 // CIRCULAR SEAL
            </span>
            <div className="my-8 flex items-center justify-center">
              <BrandLogo variant="icon" className="h-20 w-20" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              ختم الحسابات الرسمية وصور العرض المربعة وإكسسوارات السحاب.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <span dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)]">
              03 // FULL LOGO
            </span>
            <div className="my-8 flex items-center justify-center">
              <BrandLogo variant="full" className="h-11 w-auto" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              الشعار الكامل المعتمد لشريط التصفح الرئيسي، التيكت القطني، علب الهدايا وأكياس الشحن.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <span dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)]">
              04 // DISPLAY WORDMARK
            </span>
            <div className="my-8 flex items-center justify-center">
              <BrandLogo variant="wordmark" className="h-8 w-auto" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              الكلمة المنحوتة لتطريز الصدر البارز وعناوين الحملات الموسمية.
            </p>
          </div>
        </div>
      </section>

      {/* Official Color Tokens */}
      <section className="mt-14">
        <h2 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
          نظام الألوان المعماري
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PALETTE.map((swatch) => (
            <div
              key={swatch.hex}
              className="overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
            >
              <div
                className="flex h-28 items-end justify-between p-3.5"
                style={{ backgroundColor: swatch.hex }}
              >
                <span
                  dir="ltr"
                  className={`font-en text-xs font-bold tracking-wider ${
                    swatch.textDark ? "text-[#0E1012]" : "text-[#F6F5F2]"
                  }`}
                >
                  {swatch.hex}
                </span>
              </div>
              <div className="p-3.5">
                <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.18em] text-[var(--brand-accent)]">
                  {swatch.nameEn}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[var(--text-primary)]">
                  {swatch.nameAr}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Physical Packaging & Garment Hardware Gallery */}
      <section className="mt-14">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
              PHYSICAL TOUCHPOINTS
            </p>
            <h2 className="mt-1.5 text-lg font-bold text-[var(--text-primary)] sm:text-2xl">
              تفاصيل الليبل، التغليف وتجربة الاستلام
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-accent)] hover:underline"
          >
            <span>تصفح التشكيلة المتاحة الآن</span>
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {TOUCHPOINTS.map((tp) => (
            <article
              key={tp.code}
              className="overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
            >
              <img
                src={tp.img}
                alt={tp.titleAr}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="p-5">
                <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-accent)]">
                  {tp.code}
                </p>
                <h3 className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                  {tp.titleAr}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                  {tp.descAr}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
