"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageSquare, Moon, Phone, QrCode, Search, ShoppingBag, Sun, X } from "lucide-react";
import type { Settings } from "@/lib/types";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { BrandLogo } from "./BrandLogo";
import { useCart } from "./CartProvider";
import { useTheme } from "./ThemeProvider";
import { QrModal } from "./QrModal";

interface HeaderProps {
  settings: Omit<Settings, "adminPassword" | "adminUsername">;
}

const SLASH_NAV = [
  { href: "/shop?filter=new", labelEn: "NEW DROPS", labelAr: "وصل حديثاً" },
  { href: "/shop?sub=MO+%2F+KIDS", labelEn: "MO / KIDS", labelAr: "أطفال" },
  { href: "/shop?sub=MO+%2F+ESSENTIALS", labelEn: "MO / ESSENTIALS", labelAr: "الأساسيات" },
  { href: "/shop?sub=MO+%2F+STUDIO", labelEn: "MO / STUDIO", labelAr: "الاستوديو" },
  { href: "/shop?sub=MO+%2F+ARCHIVE", labelEn: "MO / ARCHIVE", labelAr: "الأرشيف" },
];

const SITE_LINKS = [
  { href: "/", labelAr: "الرئيسية", labelEn: "HOME" },
  { href: "/shop", labelAr: "تصفح جميع التشكيلات", labelEn: "ALL COLLECTIONS" },
  { href: "/drops", labelAr: "الكبسولات والأطقم المجمعة", labelEn: "CAPSULE DROPS" },
  { href: "/size-guide", labelAr: "دليل المقاسات والعناية", labelEn: "SIZE & CARE GUIDE" },
  { href: "/brand", labelAr: "الهوية البصرية والتغليف", labelEn: "ATELIER & IDENTITY" },
  { href: "/about", labelAr: "قصة MO WORLD", labelEn: "OUR EVOLUTION" },
  { href: "/contact", labelAr: "الفروع والتواصل والسياسات", labelEn: "CONTACT & POLICIES" },
];

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { totalCount, setBagOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [drawerState, setDrawerState] = React.useState<{ open: boolean; forPath: string }>({
    open: false,
    forPath: pathname,
  });
  const [qrOpen, setQrOpen] = React.useState(false);

  const drawerOpen = drawerState.open && drawerState.forPath === pathname;
  useLockBodyScroll(drawerOpen);

  const openDrawer = () => setDrawerState({ open: true, forPath: pathname });
  const closeDrawer = () => setDrawerState({ open: false, forPath: pathname });

  return (
    <>
      {settings.announcementAr && (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-center text-xs font-medium text-[var(--text-primary)]">
          <span>{settings.announcementAr}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        {/* Main Header Bar (LTR layout: Horizontal Lockup left, Slash Nav center, Utility Icons right) */}
        <div
          dir="ltr"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8"
        >
          <Link
            href="/"
            aria-label="MO WORLD — الصفحة الرئيسية"
            className="inline-flex shrink-0 items-center py-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <BrandLogo variant="horizontal" className="h-7 w-auto sm:h-8" />
          </Link>

          <nav
            aria-label="خطوط MO WORLD"
            className="hidden items-center gap-6 lg:flex"
          >
            {SLASH_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-en text-[11px] font-semibold tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                {item.labelEn}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/shop"
              aria-label="البحث وتصفح المتجر"
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-transparent text-[var(--text-primary)] transition-colors hover:border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-transparent text-[var(--text-primary)] transition-colors hover:border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]"
            >
              {theme === "dark" ? (
                <Sun className="size-[18px]" strokeWidth={1.5} />
              ) : (
                <Moon className="size-[18px]" strokeWidth={1.5} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label={`حقيبة التسوق (${totalCount})`}
              className="relative inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
            >
              <ShoppingBag className="size-[17px]" strokeWidth={1.5} />
              <span className="font-en text-xs font-semibold">{totalCount}</span>
            </button>

            <button
              type="button"
              onClick={openDrawer}
              aria-label="فتح القائمة الجانبية"
              aria-expanded={drawerOpen}
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
            >
              <Menu className="size-[18px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Sub-brand Slash Strip on Mobile/Tablet */}
        <div
          dir="ltr"
          className="no-scrollbar flex items-center gap-5 overflow-x-auto border-t border-[var(--border-subtle)] px-4 py-2 lg:hidden"
        >
          {SLASH_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {item.labelEn}
            </Link>
          ))}
        </div>
      </header>

      {/* RTL Slide-Over Navigation Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="القائمة الرئيسية"
          className="fixed inset-0 z-[60]"
        >
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={closeDrawer}
          />
          <aside
            dir="rtl"
            data-modal-scroll
            className="no-scrollbar animate-drawer-right fixed inset-y-0 right-0 z-10 flex w-[min(88vw,380px)] flex-col justify-between overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <BrandLogo variant="horizontal" className="h-7 w-auto" />
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="إغلاق القائمة"
                  className="inline-flex size-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-5">
                <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
                  SLASH ARCHITECTURE
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {SLASH_NAV.slice(1).map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={closeDrawer}
                      className="flex flex-col rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 transition-colors hover:border-[var(--brand-accent)]"
                    >
                      <span dir="ltr" className="font-en text-[11px] font-semibold tracking-[0.14em] text-[var(--text-primary)]">
                        {sub.labelEn}
                      </span>
                      <span className="mt-0.5 text-xs text-[var(--text-muted)]">{sub.labelAr}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <nav aria-label="روابط الموقع" className="mt-6 flex flex-col divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                {SITE_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeDrawer}
                      className={`flex items-center justify-between py-3 text-sm font-medium transition-colors ${
                        active ? "text-[var(--brand-accent)] font-semibold" : "text-[var(--text-primary)] hover:text-[var(--brand-accent)]"
                      }`}
                    >
                      <span>{link.labelAr}</span>
                      <span dir="ltr" className="font-en text-[10px] tracking-[0.18em] text-[var(--text-muted)]">
                        {link.labelEn}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-6 space-y-3 pt-2">
              <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-xs text-[var(--text-muted)]">
                <p className="font-semibold text-[var(--text-primary)]">{settings.workingHoursAr}</p>
                <p className="mt-1">{settings.deliveryPromiseAr}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={buildDirectWhatsAppUrl(
                    settings.whatsapp,
                    "أهلاً MO WORLD، أرغب في الاستفسار عن التشكيلة المتاحة والمقاسات.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-3 py-2.5 text-xs font-medium text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
                >
                  <MessageSquare className="size-3.5" strokeWidth={1.5} />
                  <span>واتساب مباشر</span>
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
                >
                  <Phone className="size-3.5" strokeWidth={1.5} />
                  <span dir="ltr" className="font-en">{settings.phone}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  setQrOpen(true);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] px-3 py-2.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
              >
                <QrCode className="size-3.5" strokeWidth={1.5} />
                <span>مشاركة QR المتجر</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
