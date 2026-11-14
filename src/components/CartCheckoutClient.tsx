/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import type { Order, Settings, ShippingZone } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

interface CartCheckoutClientProps {
  shippingZones: ShippingZone[];
  settings: Omit<Settings, "adminPassword" | "adminUsername">;
}

export function CartCheckoutClient({ shippingZones, settings }: CartCheckoutClientProps) {
  const router = useRouter();
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();

  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [governorateId, setGovernorateId] = React.useState(shippingZones[0]?.id ?? "");
  const [address, setAddress] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const activeZone =
    shippingZones.find((z) => z.id === governorateId) ?? shippingZones[0];
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : (activeZone?.fee ?? 75);
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          governorateId: activeZone?.id || governorateId,
          address,
          notes,
          items: items.map((it) => ({
            productId: it.productId,
            dropId: it.dropId,
            colorId: it.colorId,
            sizeLabel: it.sizeLabel,
            qty: it.qty,
          })),
        }),
      });
      const data = (await res.json()) as { order?: Order; error?: string };
      if (!res.ok || !data.order) {
        setErrorMsg(data.error || "تعذر إتمام الطلب، برجاء مراجعة البيانات والمحاولة مرة أخرى.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order/${data.order.id}`);
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، برجاء المحاولة مرة أخرى.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 sm:p-14">
          <ShoppingBag className="mx-auto size-11 text-[var(--text-muted)] opacity-60" strokeWidth={1.25} />
          <h1 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
            حقيبة التسوق فارغة حالياً
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
            اختر مقاسك المفضل من تشكيلات MO / KIDS أو ESSENTIALS أو STUDIO واستمتع بمعاينة كاملة للأوردر عند الاستلام.
          </p>
          <div className="mx-auto mt-6 grid max-w-[320px] grid-cols-2 gap-2.5">
            <Link
              href="/shop"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] whitespace-nowrap hover:bg-[var(--brand-accent-hover)]"
            >
              <span>تصفح التشكيلات</span>
              <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
            </Link>
            <Link
              href="/drops"
              className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap hover:border-[var(--text-primary)]"
            >
              <span>الباكدجات</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
          SECURE CHECKOUT
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          مراجعة الحقيبة وإتمام الطلب
        </h1>
        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
          الدفع نقداً عند الاستلام مع حقك الكامل في معاينة القطع والمقاسات مع المندوب قبل الاستلام.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Right Column (in RTL): Bag Items + Delivery Form */}
        <div className="min-w-0 space-y-8">
          {/* Bag Items */}
          <section className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                القطع المختارة ({items.reduce((s, i) => s + i.qty, 0)})
              </h2>
              <Link
                href="/shop"
                className="text-xs font-medium text-[var(--brand-accent)] hover:underline"
              >
                + إضافة قطع أخرى
              </Link>
            </div>

            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-3.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 sm:p-4"
                >
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="aspect-[4/5] w-20 shrink-0 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] object-cover sm:w-24"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span
                          dir="ltr"
                          className="font-en text-[10px] font-semibold tracking-wider text-[var(--brand-accent)]"
                        >
                          {item.subBrand} · {item.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`حذف ${item.nameAr}`}
                          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <h3 className="mt-1 truncate text-xs font-semibold text-[var(--text-primary)] sm:text-sm">
                        {item.nameAr}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="inline-block size-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorNameAr}
                        </span>
                        <span>•</span>
                        <span>
                          المقاس:{" "}
                          <strong dir="ltr" className="font-en text-[var(--text-primary)]">
                            {item.sizeLabel}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label="تقليل الكمية"
                          className="inline-flex size-8 items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                        >
                          <Minus className="size-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center font-en text-xs font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label="زيادة الكمية"
                          className="inline-flex size-8 items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                        >
                          <Plus className="size-3.5" strokeWidth={1.5} />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {formatPrice(item.unitPrice * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Delivery Details Form */}
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-6"
          >
            <h2 className="border-b border-[var(--border-subtle)] pb-3 text-sm font-bold text-[var(--text-primary)]">
              بيانات المستلم وعنوان التوصيل
            </h2>

            {!settings.acceptingOrders && (
              <div className="mt-4 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 text-xs font-semibold text-[var(--brand-accent)]">
                استقبال الطلبات عبر الموقع متوقف مؤقتاً لتحديث المخزون. يمكنك مراسلتنا عبر واتساب.
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 rounded-[4px] border border-red-500/40 bg-red-500/10 p-3 text-xs font-medium text-[var(--text-primary)]">
                {errorMsg}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-semibold text-[var(--text-primary)]">الاسم بالكامل *</span>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-semibold text-[var(--text-primary)]">رقم الموبايل (يدعم واتساب) *</span>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-right font-en text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs sm:col-span-2">
                <span className="font-semibold text-[var(--text-primary)]">المحافظة / منطقة الشحن *</span>
                <select
                  value={activeZone?.id || governorateId}
                  onChange={(e) => setGovernorateId(e.target.value)}
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                >
                  {shippingZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nameAr} — {z.etaAr} ({isFreeShipping ? "شحن مجاني" : formatPrice(z.fee)})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs sm:col-span-2">
                <span className="font-semibold text-[var(--text-primary)]">العنوان بالتفصيل *</span>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المنطقة، اسم الشارع، رقم العقار، الدور والشقة، علامة مميزة..."
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs sm:col-span-2">
                <span className="font-semibold text-[var(--text-primary)]">ملاحظات إضافية للمندوب (اختياري)</span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="موعد الاستلام المفضل أو أي تفاصيل إضافية..."
                  className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>
            </div>
          </form>
        </div>

        {/* Left Column (in RTL): Sticky Order Summary */}
        <aside className="min-w-0">
          <div className="sticky top-24 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <h2 className="border-b border-[var(--border-subtle)] pb-3 text-sm font-bold text-[var(--text-primary)]">
              ملخص الحساب
            </h2>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">المجموع الفرعي</span>
                <span className="font-semibold text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">
                  الشحن ({activeZone?.nameAr || "المحافظة"})
                </span>
                <span className="font-semibold text-[var(--brand-accent)]">
                  {shippingFee === 0 ? "مجاني" : formatPrice(shippingFee)}
                </span>
              </div>
              {activeZone && (
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>موعد التوصيل المتوقع</span>
                  <span>{activeZone.etaAr}</span>
                </div>
              )}
              <div className="border-t border-[var(--border-subtle)] pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[var(--text-primary)]">الإجمالي عند الاستلام</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting || !settings.acceptingOrders}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-3.5 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)] disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" strokeWidth={1.5} />
              <span>{submitting ? "جاري تسجيل الطلب..." : "تأكيد الطلب — الدفع عند الاستلام"}</span>
            </button>

            <div className="mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-[11px] text-[var(--text-muted)]">
              <p className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                <span>مسموح بمعاينة الأوردر بالكامل مع المندوب قبل الدفع</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                <span>استبدال واسترجاع خلال ١٤ يوماً بالتيكت الأصلي</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
