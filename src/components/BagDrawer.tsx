/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

export function BagDrawer({ freeShippingThreshold = 2500 }: { freeShippingThreshold?: number }) {
  const { items, totalCount, subtotal, bagOpen, setBagOpen, updateQty, removeItem } = useCart();
  useLockBodyScroll(bagOpen);

  if (!bagOpen) return null;

  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, Math.round((subtotal / Math.max(1, freeShippingThreshold)) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="حقيبة التسوق"
      className="fixed inset-0 z-[65]"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs"
        onClick={() => setBagOpen(false)}
      />

      <aside
        dir="rtl"
        className="animate-drawer-left fixed inset-y-0 left-0 z-10 flex w-[min(92vw,420px)] flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-primary)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              حقيبة التسوق ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setBagOpen(false)}
            aria-label="إغلاق الحقيبة"
            className="inline-flex size-8 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Free shipping meter */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3">
          <p className="text-xs text-[var(--text-primary)]">
            {remainingForFree === 0 ? (
              <span className="font-semibold text-[var(--brand-accent)]">
                طلبك مؤهل للشحن المجاني مع معاينة الأوردر عند الاستلام
              </span>
            ) : (
              <>
                أضف <span className="font-semibold">{formatPrice(remainingForFree)}</span> للحصول على شحن مجاني لجميع المحافظات
              </>
            )}
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-[2px] bg-[var(--border-subtle)]">
            <div
              className="h-full bg-[var(--brand-accent)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Items list */}
        <div data-modal-scroll className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="size-10 text-[var(--text-muted)] opacity-50" strokeWidth={1.25} />
              <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                حقيبة التسوق فارغة حالياً
              </p>
              <p className="mt-1 max-w-[26ch] text-xs text-[var(--text-muted)]">
                استكشف تشكيلات MO / KIDS و ESSENTIALS و STUDIO وأضف مقاسك مباشرة.
              </p>
              <Link
                href="/shop"
                onClick={() => setBagOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-2.5 text-xs font-medium text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
              >
                <span>تصفح التشكيلة</span>
                <ArrowLeft className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-3.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3"
                >
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="aspect-[4/5] w-20 shrink-0 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span dir="ltr" className="font-en text-[10px] font-semibold tracking-wider text-[var(--brand-accent)]">
                          {item.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`حذف ${item.nameAr}`}
                          className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                        >
                          <Trash2 className="size-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <h3 className="mt-0.5 line-clamp-1 text-xs font-semibold text-[var(--text-primary)]">
                        {item.nameAr}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="inline-block size-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorNameAr}
                        </span>
                        <span>•</span>
                        <span dir="ltr" className="font-en font-semibold text-[var(--text-primary)]">
                          {item.sizeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label="تقليل الكمية"
                          className="inline-flex size-7 items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-7 text-center font-en text-xs font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label="زيادة الكمية"
                          className="inline-flex size-7 items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                        >
                          <Plus className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {formatPrice(item.unitPrice * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer checkout CTA */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">المجموع الفرعي</span>
              <span className="font-semibold text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              الدفع عند الاستلام • مسموح بمعاينة القطع مع المندوب قبل الاستلام
            </p>
            <div className="mt-3.5 grid grid-cols-1 gap-2">
              <Link
                href="/cart"
                onClick={() => setBagOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-4 py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
              >
                <span>إتمام الطلب وتحديد العنوان</span>
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
