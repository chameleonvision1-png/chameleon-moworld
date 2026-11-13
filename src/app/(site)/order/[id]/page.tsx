/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MessageSquare, Package, ShieldCheck, Truck } from "lucide-react";
import { readDB } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "متابعة الطلب",
};

const STATUS_STEPS: Array<{ key: OrderStatus; labelAr: string }> = [
  { key: "new", labelAr: "تم استلام الطلب" },
  { key: "confirmed", labelAr: "تم التأكيد والتجهيز" },
  { key: "shipped", labelAr: "خرج مع المندوب" },
  { key: "completed", labelAr: "تم التسليم" },
];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await readDB();
  const order = db.orders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  const shortRef = order.id.slice(-6).toUpperCase();
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const waConfirmUrl = buildOrderWhatsAppUrl(
    db.settings.whatsapp,
    order,
    "https://moworld.chameleon.vision",
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[var(--brand-accent)]">
              <CheckCircle2 className="size-4" strokeWidth={1.75} />
              <span dir="ltr" className="font-en text-xs font-bold tracking-[0.18em]">
                ORDER #{shortRef}
              </span>
            </div>
            <h1 className="mt-1.5 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
              شكراً لطلبك من MO WORLD، {order.customerName}
            </h1>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              تم تسجيل طلبك بنجاح. يمكنك إرسال رسالة التأكيد المباشرة عبر واتساب لتسريع التجهيز.
            </p>
          </div>

          <a
            href={waConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
          >
            <MessageSquare className="size-4" strokeWidth={1.5} />
            <span>تأكيد الطلب عبر واتساب</span>
          </a>
        </div>

        {/* Status Tracker */}
        {order.status === "cancelled" ? (
          <div className="mt-6 rounded-[4px] border border-red-500/35 bg-red-500/10 p-4 text-xs font-semibold text-[var(--text-primary)]">
            حالة الطلب الحالية: ملغي. للتواصل والاستفسار يرجى مراسلتنا عبر واتساب.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {STATUS_STEPS.map((step, idx) => {
              const reached = currentStepIdx >= idx;
              return (
                <div
                  key={step.key}
                  className={`rounded-[4px] border p-3 ${
                    reached
                      ? "border-[var(--brand-accent)] bg-[var(--bg-primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 opacity-60"
                  }`}
                >
                  <p dir="ltr" className="text-right font-en text-[10px] font-bold text-[var(--brand-accent)]">
                    0{idx + 1}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                    {step.labelAr}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Package className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <span>تفاصيل القطع المطلوبة</span>
          </h2>
          <ul className="mt-3 divide-y divide-[var(--border-subtle)] rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
            {order.items.map((item, i) => (
              <li key={`${item.productId}-${i}`} className="flex items-center gap-3.5 p-3.5">
                <img
                  src={item.image}
                  alt={item.nameAr}
                  className="aspect-[4/5] w-14 shrink-0 rounded-[3px] border border-[var(--border-subtle)] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p dir="ltr" className="text-right font-en text-[10px] font-semibold text-[var(--brand-accent)]">
                    {item.code}
                  </p>
                  <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                    {item.nameAr}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                    اللون: {item.colorNameAr} • المقاس:{" "}
                    <strong dir="ltr" className="font-en text-[var(--text-primary)]">
                      {item.sizeLabel}
                    </strong>{" "}
                    × {item.qty}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-[var(--text-primary)]">
                  {formatPrice(item.unitPrice * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Address & Totals */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 text-xs">
            <h3 className="font-bold text-[var(--text-primary)]">عنوان التوصيل</h3>
            <p className="mt-2 font-semibold text-[var(--text-primary)]">{order.customerName}</p>
            <p dir="ltr" className="mt-0.5 text-right font-en text-[var(--text-muted)]">
              {order.customerPhone}
            </p>
            <p className="mt-1 text-[var(--text-muted)]">
              {order.governorateName} — {order.address}
            </p>
            {order.notes && (
              <p className="mt-1.5 border-t border-[var(--border-subtle)] pt-1.5 text-[11px] text-[var(--text-muted)]">
                ملاحظات: {order.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">المجموع الفرعي</span>
                <span className="font-semibold">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">رسوم الشحن</span>
                <span className="font-semibold text-[var(--brand-accent)]">
                  {order.shippingFee === 0 ? "مجاني" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2 text-sm font-bold">
                <span>الإجمالي عند الاستلام</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
              <ShieldCheck className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
              <span>مسموح بمعاينة القطع مع المندوب قبل الدفع</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5">
          <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Truck className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <span>احتفظ برابط هذه الصفحة لمتابعة حالة شحنتك في أي وقت.</span>
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-accent)] hover:underline"
          >
            <span>متابعة التسوق في MO WORLD</span>
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
