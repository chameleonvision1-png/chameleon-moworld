/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import { SizeGuideCalculator } from "@/components/SizeGuideCalculator";

export const metadata: Metadata = {
  title: "دليل المقاسات وتعليمات العناية",
  description:
    "جدول المقاسات بالسنتيمتر لملابس الأطفال MO / KIDS والخطوط الشبابية واليومية مع حاسبة المقاس التفاعلية.",
};

const KIDS_ROWS = [
  { size: "2 – 5", height: "88 – 115 سم", chest: "33 – 39 سم", topLen: "38 – 47 سم", pantLen: "52 – 65 سم" },
  { size: "6", height: "112 – 120 سم", chest: "40 سم", topLen: "49 سم", pantLen: "70 سم" },
  { size: "8", height: "121 – 130 سم", chest: "43 سم", topLen: "53 سم", pantLen: "78 سم" },
  { size: "10", height: "131 – 142 سم", chest: "46 سم", topLen: "58 سم", pantLen: "85 سم" },
  { size: "12", height: "143 – 153 سم", chest: "49 سم", topLen: "63 سم", pantLen: "92 سم" },
];

const ADULT_ROWS = [
  { size: "S", chest: "58 سم", length: "70 سم", shoulder: "54 سم", weight: "52 – 65 كجم" },
  { size: "M", chest: "61 سم", length: "72 سم", shoulder: "56 سم", weight: "65 – 78 كجم" },
  { size: "L", chest: "64 سم", length: "74 سم", shoulder: "58 سم", weight: "78 – 92 كجم" },
  { size: "XL", chest: "67 سم", length: "76 سم", shoulder: "60 سم", weight: "92 – 108 كجم" },
];

export default async function SizeGuidePage() {
  const data = await publicDB();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="border-b border-[var(--border-subtle)] pb-8 text-center sm:text-right">
        <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
          FIT &amp; GARMENT CARE
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          دليل المقاسات وتعليمات العناية
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
          جميع القياسات الموضحة أدناه مأخوذة بالسنتيمتر للقطعة مفرودة على سطح مستوٍ (عرض الصدر من الإبط للإبط). وتذكّر دائماً أنه متاح لك معاينة الأوردر مع المندوب قبل الاستلام أو الاستبدال خلال ١٤ يوماً.
        </p>
      </div>

      {/* Interactive Calculator */}
      <div className="mt-8">
        <SizeGuideCalculator />
      </div>

      {/* Tables */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Adult / Youth Table */}
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
          <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
            MO / ESSENTIALS &amp; STUDIO
          </p>
          <h2 className="mt-1.5 text-lg font-bold text-[var(--text-primary)]">
            مقاسات الخطوط الشبابية واليونيسكس (S – XL)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[300px] border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <th className="py-2.5 font-semibold">المقاس</th>
                  <th className="py-2.5 font-semibold">عرض الصدر</th>
                  <th className="py-2.5 font-semibold">الطول الكلي</th>
                  <th className="py-2.5 font-semibold">عرض الكتف</th>
                  <th className="py-2.5 font-semibold">الوزن الاسترشادي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {ADULT_ROWS.map((row) => (
                  <tr key={row.size} className="text-[var(--text-primary)]">
                    <td dir="ltr" className="py-3 text-right font-en font-bold text-[var(--brand-accent)]">
                      {row.size}
                    </td>
                    <td className="py-3">{row.chest}</td>
                    <td className="py-3">{row.length}</td>
                    <td className="py-3">{row.shoulder}</td>
                    <td className="py-3 text-[var(--text-muted)]">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kids Table */}
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
          <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
            MO / KIDS STREETWEAR
          </p>
          <h2 className="mt-1.5 text-lg font-bold text-[var(--text-primary)]">
            مقاسات الأطفال والأطقم الكاملة (مقاسات 2 – 12)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[300px] border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <th className="py-2.5 font-semibold">المقاس</th>
                  <th className="py-2.5 font-semibold">طول الطفل</th>
                  <th className="py-2.5 font-semibold">عرض الصدر</th>
                  <th className="py-2.5 font-semibold">طول الهودي</th>
                  <th className="py-2.5 font-semibold">طول البنطلون</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {KIDS_ROWS.map((row) => (
                  <tr key={row.size} className="text-[var(--text-primary)]">
                    <td dir="ltr" className="py-3 text-right font-en font-bold text-[var(--brand-accent)]">
                      {row.size}
                    </td>
                    <td className="py-3">{row.height}</td>
                    <td className="py-3">{row.chest}</td>
                    <td className="py-3">{row.topLen}</td>
                    <td className="py-3">{row.pantLen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Garment Care & Mailer Card */}
      <div className="mt-12 grid grid-cols-1 items-center gap-8 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 lg:grid-cols-12 lg:p-8">
        <div className="lg:col-span-6">
          <img
            src="/images/brand/mailers-care-card.webp"
            alt="أكياس الشحن وكارت العناية بالقطن — MO WORLD"
            loading="lazy"
            className="w-full rounded-[4px] border border-[var(--border-subtle)] object-cover"
          />
        </div>
        <div className="space-y-4 lg:col-span-6">
          <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
            HEAVYWEIGHT COTTON CARE
          </p>
          <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
            كيف تحافظ على قوام القطن المصري الثقيل والطبعات؟
          </h2>
          <p className="text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
            {data.settings.careInstructionAr}. صممنا قطع MO WORLD لتزداد نعومة مع الاستخدام دون أن تفقد تماسك الياقة أو ثبات اللون.
          </p>
          <ul className="space-y-2.5 text-xs text-[var(--text-primary)]">
            <li className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3">
              ١. اقلب القطعة على الوجه الداخلي قبل الغسيل لحماية النسيج الخارجي والتطريز المنحوت.
            </li>
            <li className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3">
              ٢. اغسل بماء بارد لا يتجاوز ٣٠ درجة مئوية مع دورة عصر خفيفة وبدون كلور أو مبيضات.
            </li>
            <li className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3">
              ٣. جفف القطعة في الظل على شماعة عريضة وتجنب المجفف الحراري العالي والكي المباشر فوق الطبعة.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
