import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--bg-primary)] px-4 text-center text-[var(--text-primary)]">
      <BrandLogo variant="stacked" className="h-20 w-auto" />
      <p dir="ltr" className="micro-label mt-6 text-[var(--brand-accent)]">
        ERROR 404 // PAGE NOT FOUND
      </p>
      <h1 className="mt-2 text-2xl font-bold">الصفحة المطلوبة غير متوفرة</h1>
      <p className="mt-2 max-w-md text-xs text-[var(--text-muted)] sm:text-sm">
        ربما تم نقل هذا الرابط أو انتهى عرض هذه القطعة. يمكنك العودة إلى الصفحة الرئيسية أو استعراض التشكيلات المتاحة.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-6 py-3 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
        >
          <span>العودة للرئيسية</span>
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-primary)]"
        >
          <span>تصفح المتجر</span>
        </Link>
      </div>
    </div>
  );
}
