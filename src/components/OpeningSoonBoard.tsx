"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface OpeningSoonBoardProps {
  subBrandLabel?: string;
  titleEn?: string;
  titleAr?: string;
  descriptionAr?: string;
  onSwitchToKids?: () => void;
}

export function OpeningSoonBoard({
  subBrandLabel = "YOUTH & ADULT COLLECTIONS",
  titleEn = "OPENING SOON",
  titleAr = "هذا القسم يُفتتح قريباً",
  descriptionAr = "قطع الشباب والأساسيات معروضة للمعاينة المسبقة فقط قبل الافتتاح الرسمي — تشكيلة أزياء الأطفال متاحة الآن للطلب الفوري مع المعاينة عند الاستلام.",
  onSwitchToKids,
}: OpeningSoonBoardProps) {
  return (
    <div className="pointer-events-auto mx-auto w-full max-w-lg rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 px-6 py-7 text-center shadow-[0_24px_64px_-16px_rgba(0,0,0,0.38)] backdrop-blur-md sm:px-9 sm:py-9">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2">
        <BrandLogo variant="icon" className="size-full" />
      </div>

      <p
        dir="ltr"
        className="mt-4 font-en text-[10px] font-semibold tracking-[0.22em] text-[var(--brand-accent)] sm:text-[11px]"
      >
        {subBrandLabel}
      </p>

      <h3
        dir="ltr"
        className="mt-1.5 font-en text-2xl font-bold tracking-[0.18em] text-[var(--text-primary)] sm:text-3xl"
      >
        {titleEn}
      </h3>

      <p className="mt-2 text-base font-bold text-[var(--text-primary)] sm:text-lg">
        {titleAr}
      </p>

      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
        {descriptionAr}
      </p>

      <div className="mt-6 flex justify-center">
        {onSwitchToKids ? (
          <button
            type="button"
            onClick={onSwitchToKids}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-6 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
          >
            <span>تسوق قسم الأطفال المتاح الآن</span>
            <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
          </button>
        ) : (
          <Link
            href="/shop?sub=MO+%2F+KIDS"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-6 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
          >
            <span>تسوق قسم الأطفال المتاح الآن</span>
            <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
