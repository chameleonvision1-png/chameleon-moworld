import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Link2, MapPin, MessageSquare, Phone, RefreshCw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { publicDB } from "@/lib/db";
import { cleanPhone } from "@/lib/link-hub";
import { formatPrice } from "@/lib/utils";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "الشحن، المعاينة وسياسة الاستبدال",
  description:
    "أسعار ومواعيد الشحن للمحافظات، سياسة المعاينة عند الاستلام، الاستبدال خلال ١٤ يوماً، والروابط الرسمية لدار MO WORLD.",
};

export default async function ContactPage() {
  const data = await publicDB();
  const { settings, shippingZones } = data;
  const validWa = cleanPhone(settings.whatsapp)?.replace(/[^\d]/g, "") || "";
  const validPhone = cleanPhone(settings.phone);
  const validAddress = (settings.showroomAddressAr || "").trim();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="border-b border-[var(--border-subtle)] pb-8 text-center sm:text-right">
        <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
          SHIPPING &amp; POLICIES
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          الشحن، المعاينة وسياسة الاستبدال
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)] sm:mx-0 sm:text-sm">
          التسوق متاح أونلاين على مدار الساعة مع توصيل لجميع المحافظات وحق المعاينة الكاملة قبل الاستلام.
        </p>
      </div>

      {/* Symmetric Service / Link Hub Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div>
            <MessageSquare className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="mt-3 text-sm font-bold text-[var(--text-primary)] sm:text-base">
              {validWa ? "واتساب خدمة العملاء" : "الطلب المباشر عبر المتجر"}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
              {validWa
                ? "تواصل معنا مباشرة للاستفسار عن المقاسات أو متابعة شحنتك."
                : "أضف القطع والمقاسات إلى الحقيبة وأكمل بيانات التوصيل مباشرة بنظام الدفع عند الاستلام."}
            </p>
          </div>
          {validWa ? (
            <a
              href={buildDirectWhatsAppUrl(
                validWa,
                "أهلاً فريق MO WORLD، أرغب في الاستفسار عن التشكيلة والمقاسات.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-[4px] bg-[var(--brand-accent)] px-4 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
            >
              محادثة واتساب الآن
            </a>
          ) : (
            <Link
              href="/shop"
              className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-4 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
            >
              <ShoppingBag className="size-3.5" strokeWidth={1.5} />
              <span>تصفح الكتالوج والطلب</span>
            </Link>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div>
            {validPhone ? (
              <Phone className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            ) : (
              <Link2 className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            )}
            <h2 className="mt-3 text-sm font-bold text-[var(--text-primary)] sm:text-base">
              {validPhone ? "التواصل الهاتفي" : "مركز الروابط الرسمية (Link Hub)"}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Clock className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span>{settings.workingHoursAr}</span>
            </p>
          </div>
          {validPhone ? (
            <a
              href={`tel:${validPhone}`}
              dir="ltr"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 font-en text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-primary)]"
            >
              {validPhone}
            </a>
          ) : (
            <Link
              href="/links"
              className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-accent)]"
            >
              <Link2 className="size-3.5 text-[var(--brand-accent)]" strokeWidth={1.5} />
              <span>فتح القنوات والروابط الرسمية</span>
            </Link>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div>
            <MapPin className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="mt-3 text-sm font-bold text-[var(--text-primary)] sm:text-base">
              {validAddress ? settings.showroomNameAr : "توصيل منزلي لجميع المحافظات"}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
              {validAddress || settings.deliveryPromiseAr}
            </p>
          </div>
          <p className="mt-4 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 text-center text-[11px] font-medium text-[var(--text-muted)]">
            شحن مجاني للطلبات فوق {formatPrice(settings.freeShippingThreshold)}
          </p>
        </div>
      </div>

      {/* Shipping Zones & Policies */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 lg:col-span-7">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
              مناطق ومواعيد الشحن للمحافظات
            </h2>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            شحن مجاني تلقائي لأي طلب تتجاوز قيمته{" "}
            <strong className="text-[var(--text-primary)]">
              {formatPrice(settings.freeShippingThreshold)}
            </strong>{" "}
            في جميع المحافظات.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[260px] border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <th className="py-2.5 font-semibold">المنطقة / المحافظة</th>
                  <th className="py-2.5 font-semibold">مدة التوصيل</th>
                  <th className="py-2.5 font-semibold">رسوم الشحن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {shippingZones.map((zone) => (
                  <tr key={zone.id} className="text-[var(--text-primary)]">
                    <td className="py-3 font-semibold">{zone.nameAr}</td>
                    <td className="py-3 text-[var(--text-muted)]">{zone.etaAr}</td>
                    <td className="py-3 font-semibold text-[var(--brand-accent)]">
                      {formatPrice(zone.fee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                سياسة معاينة الأوردر عند الاستلام
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              {settings.deliveryPromiseAr}. يحق لك التأكد من الخامة والمقاس مع المندوب قبل الدفع.
            </p>
          </div>

          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                سياسة الاستبدال والاسترجاع (١٤ يوماً)
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              {settings.exchangePolicyAr}. يتم التنسيق لتسليم المقاس البديل واستلام القطعة في نفس الزيارة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
