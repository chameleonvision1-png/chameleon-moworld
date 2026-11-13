"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Ruler } from "lucide-react";

export function SizeGuideCalculator() {
  const [mode, setMode] = React.useState<"adult" | "kids">("adult");
  const [height, setHeight] = React.useState("175");
  const [weight, setWeight] = React.useState("74");
  const [fitPref, setFitPref] = React.useState<"regular" | "oversized">("oversized");

  const result = React.useMemo(() => {
    const h = Number(height) || 0;
    const w = Number(weight) || 0;

    if (mode === "kids") {
      if (h <= 112) return { size: "4-5Y", note: "مناسب لطول ١٠٤–١١٢ سم براحة كاملة للحركة" };
      if (h <= 125) return { size: "6-7Y", note: "مناسب لطول ١١٣–١٢٥ سم مع طول أكمام متوازن" };
      if (h <= 138) return { size: "8-9Y", note: "مناسب لطول ١٢٦–١٣٨ سم بقصّة Relaxed" };
      return { size: "10-12Y", note: "مناسب لطول ١٣٩–١٥٢ سم (ولأطول من ١٥٣ سم ننصح بمقاس S شبابي)" };
    }

    const idx =
      w < 64 && h < 173
        ? 0
        : w < 78 && h < 181
          ? 1
          : w < 92 && h < 188
            ? 2
            : 3;
    const scale = ["S", "M", "L", "XL"];
    const adjusted = fitPref === "oversized" ? idx : Math.max(0, idx - (w < 70 ? 0 : 0));
    return {
      size: scale[adjusted] ?? "L",
      note:
        fitPref === "oversized"
          ? "يحافظ على سقوط الأكتاف المعماري الخاص بـ MO WORLD دون مبالغة."
          : "قصّة متوازنة ومريحة للاستخدام اليومي تحت الجاكيتات والمعاطف.",
    };
  }, [mode, height, weight, fitPref]);

  return (
    <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2">
          <Ruler className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            حاسبة المقاس التفاعلية (Smart Fit Finder)
          </h2>
        </div>

        <div className="inline-flex rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("adult");
              setHeight("175");
            }}
            className={`rounded-[3px] px-3 py-1.5 font-medium transition-colors ${
              mode === "adult"
                ? "bg-[var(--brand-accent)] text-[#F6F5F2]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            شبابي ويونيسكس (S–XL)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("kids");
              setHeight("122");
            }}
            className={`rounded-[3px] px-3 py-1.5 font-medium transition-colors ${
              mode === "kids"
                ? "bg-[var(--brand-accent)] text-[#F6F5F2]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            MO / KIDS أطفال
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs">
          <span className="font-semibold text-[var(--text-primary)]">
            {mode === "kids" ? "طول الطفل (بالسنتيمتر)" : "الطول (بالسنتيمتر)"}
          </span>
          <input
            type="number"
            min={90}
            max={210}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
          />
        </label>

        {mode === "adult" ? (
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-semibold text-[var(--text-primary)]">الوزن (بالكيلوجرام)</span>
            <input
              type="number"
              min={40}
              max={150}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
            />
          </label>
        ) : (
          <div className="flex flex-col justify-end text-xs text-[var(--text-muted)]">
            <p className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2.5">
              نعتمد في مقاسات الأطفال على الطول بالسم لضمان دقة طول الأكمام والبنطلون أكثر من العمر التقريبي.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5 text-xs">
          <span className="font-semibold text-[var(--text-primary)]">شكل الإطلالة المفضل</span>
          <div className="grid h-10 grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setFitPref("oversized")}
              className={`rounded-[4px] border text-xs font-medium transition-colors ${
                fitPref === "oversized"
                  ? "border-[var(--brand-accent)] bg-[var(--bg-primary)] font-semibold text-[var(--brand-accent)]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-muted)]"
              }`}
            >
              Oversized عصري
            </button>
            <button
              type="button"
              onClick={() => setFitPref("regular")}
              className={`rounded-[4px] border text-xs font-medium transition-colors ${
                fitPref === "regular"
                  ? "border-[var(--brand-accent)] bg-[var(--bg-primary)] font-semibold text-[var(--brand-accent)]"
                  : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-muted)]"
              }`}
            >
              Relaxed متوازن
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs text-[var(--text-muted)]">المقاس الأنسب لك في قصّات MO WORLD:</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span dir="ltr" className="font-en text-2xl font-bold text-[var(--brand-accent)]">
              {result.size}
            </span>
            <span className="text-xs text-[var(--text-primary)]">{result.note}</span>
          </div>
        </div>

        <Link
          href={mode === "kids" ? "/shop?sub=MO+%2F+KIDS" : "/shop"}
          className="inline-flex shrink-0 items-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-2.5 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
        >
          <span>تسوق مقاس {result.size}</span>
          <ArrowLeft className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
