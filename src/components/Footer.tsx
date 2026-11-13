import Link from "next/link";
import type { Settings } from "@/lib/types";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";
import { BrandLogo } from "./BrandLogo";

export function Footer({
  settings,
}: {
  settings: Omit<Settings, "adminPassword" | "adminUsername">;
}) {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Identity */}
          <div className="space-y-4">
            <BrandLogo variant="horizontal" className="h-8 w-auto" />
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              من MO Children&apos;s World إلى الهوية الشاملة MO WORLD — دار أزياء عصرية تجمع بين خامات القطن المصري الثقيل والقصّات المعمارية الهادئة للأطفال والشباب.
            </p>
            <p dir="ltr" className="font-en text-[10px] tracking-[0.22em] text-[var(--brand-accent)]">
              FRONTIER FASHION HUB
            </p>
          </div>

          {/* Column 2: Slash Collections */}
          <div>
            <h3 dir="ltr" className="micro-label text-right text-[var(--text-primary)]">
              COLLECTIONS
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--text-muted)]">
              <li>
                <Link href="/shop?sub=MO+%2F+KIDS" className="transition-colors hover:text-[var(--text-primary)]">
                  <span dir="ltr" className="font-en font-semibold text-[var(--text-primary)]">MO / KIDS</span> — أطقم الأطفال والفليس
                </Link>
              </li>
              <li>
                <Link href="/shop?sub=MO+%2F+ESSENTIALS" className="transition-colors hover:text-[var(--text-primary)]">
                  <span dir="ltr" className="font-en font-semibold text-[var(--text-primary)]">MO / ESSENTIALS</span> — الأساسيات الثقيلة
                </Link>
              </li>
              <li>
                <Link href="/shop?sub=MO+%2F+STUDIO" className="transition-colors hover:text-[var(--text-primary)]">
                  <span dir="ltr" className="font-en font-semibold text-[var(--text-primary)]">MO / STUDIO</span> — الجاكيتات والكارجو
                </Link>
              </li>
              <li>
                <Link href="/shop?sub=MO+%2F+ARCHIVE" className="transition-colors hover:text-[var(--text-primary)]">
                  <span dir="ltr" className="font-en font-semibold text-[var(--text-primary)]">MO / ARCHIVE</span> — الإصدارات المحدودة
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[var(--text-primary)]">
              خدمة العملاء والسياسات
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--text-muted)]">
              <li>
                <Link href="/drops" className="transition-colors hover:text-[var(--text-primary)]">
                  الكبسولات والباكدجات المجمعة
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="transition-colors hover:text-[var(--text-primary)]">
                  جدول المقاسات وتعليمات الغسيل
                </Link>
              </li>
              <li>
                <Link href="/brand" className="transition-colors hover:text-[var(--text-primary)]">
                  التفاصيل، التغليف والهوية البصرية
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[var(--text-primary)]">
                  قصة التحول إلى MO WORLD
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[var(--text-primary)]">
                  سياسة المعاينة والاستبدال (١٤ يوماً)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom & Direct Channels */}
          <div className="space-y-2.5 text-xs text-[var(--text-muted)]">
            <h3 className="text-xs font-semibold tracking-wide text-[var(--text-primary)]">
              التواصل ومواعيد العمل
            </h3>
            <p className="pt-1.5 text-[var(--text-primary)]">{settings.showroomAddressAr}</p>
            <p>{settings.workingHoursAr}</p>
            <p>{settings.deliveryPromiseAr}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={buildDirectWhatsAppUrl(
                  settings.whatsapp,
                  "أهلاً MO WORLD، أود الاستفسار عن المقاسات والقطع المتوفرة.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[4px] bg-[var(--brand-accent)] px-3.5 py-2 text-xs font-medium text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
              >
                تواصل عبر واتساب
              </a>
              <a
                href={`tel:${settings.phone}`}
                dir="ltr"
                className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2 font-en text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
              >
                {settings.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} MO WORLD — Frontier Fashion Hub. جميع الحقوق محفوظة.</p>
          <p>
            تصميم وتطوير{" "}
            <a
              href="https://chameleon.vision"
              target="_blank"
              rel="noopener noreferrer"
              className="font-en font-semibold text-[var(--text-primary)] hover:text-[var(--brand-accent)]"
            >
              Chameleon Vision
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
