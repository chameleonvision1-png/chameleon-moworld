import type { Metadata } from "next";
import { Clock, MapPin, MessageSquare, Phone, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { publicDB } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "التواصل، الشحن وسياسة الاستبدال",
  description:
    "قنوات التواصل مع MO WORLD، مواعيد العمل، أسعار ومواعيد الشحن للمحافظات، وسياسة المعاينة والاستبدال خلال ١٤ يوماً.",
};

export default async function ContactPage() {
  const data = await publicDB();
  const { settings, shippingZones } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="border-b border-[var(--border-subtle)] pb-8">
        <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
          CLIENT SERVICES &amp; SHIPPING
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          خدمة العملاء، الشحن وسياسة المعاينة
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
          فريق خدمة عملاء MO WORLD متاح يومياً لمساعدتك في اختيار المقاس الدقيق أو متابعة شحنتك أو تنسيق طلبات الاستبدال.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div>
            <MessageSquare className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="mt-3 text-base font-bold text-[var(--text-primary)]">
              واتساب خدمة العملاء السريع
            </h2>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              تواصل معنا مباشرة للاستفسار عن المقاسات، الخامات، أو تأكيد ومتابعة طلبك الحالي.
            </p>
          </div>
          <a
            href={buildDirectWhatsAppUrl(
              settings.whatsapp,
              "أهلاً فريق MO WORLD، أرغب في الاستفسار عن التشكيلة والمقاسات.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-[4px] bg-[var(--brand-accent)] px-4 py-2.5 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
          >
            محادثة واتساب الآن
          </a>
        </div>

        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div>
            <Phone className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="mt-3 text-base font-bold text-[var(--text-primary)]">
              الاتصال الهاتفي ومواعيد العمل
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Clock className="size-3.5 shrink-0" strokeWidth={1.5} />
              <span>{settings.workingHoursAr}</span>
            </p>
          </div>
          <a
            href={`tel:${settings.phone}`}
            dir="ltr"
            className="mt-5 inline-flex items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-2.5 font-en text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-primary)]"
          >
            {settings.phone}
          </a>
        </div>

        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
          <div>
            <MapPin className="size-5 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="mt-3 text-base font-bold text-[var(--text-primary)]">
              {settings.showroomNameAr}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
              {settings.showroomAddressAr}
            </p>
          </div>
          <p className="mt-5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 text-[11px] text-[var(--text-muted)]">
            التوصيل المنزلي متاح لجميع محافظات الجمهورية مع معاينة كاملة عند الاستلام.
          </p>
        </div>
      </div>

      {/* Shipping Zones & Policies */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 lg:col-span-7">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
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
            <table className="w-full min-w-[280px] border-collapse text-right text-xs">
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
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                سياسة معاينة الأوردر عند الاستلام
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              {settings.deliveryPromiseAr}. في حال عدم مناسبة المقاس أثناء المعاينة، يمكنك طلب تبديل المقاس فوراً مع خدمة العملاء.
            </p>
          </div>

          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                سياسة الاستبدال والاسترجاع (١٤ يوماً)
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              {settings.exchangePolicyAr}. كل ما عليك هو مراسلتنا عبر واتساب برقم الطلب وسيقوم المندوب بتسليم المقاس البديل واستلام القطعة في نفس الزيارة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
