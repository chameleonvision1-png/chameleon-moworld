"use client";

import * as React from "react";
import { Check, Copy, Download, X } from "lucide-react";
import { generateQrMatrix } from "@/lib/qrcode";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { BrandLogo } from "./BrandLogo";

interface QrModalProps {
  open: boolean;
  onClose: () => void;
  url?: string;
}

export function QrModal({ open, onClose, url = "https://moworld.chameleon.vision" }: QrModalProps) {
  useLockBodyScroll(open);
  const [copied, setCopied] = React.useState(false);

  const matrix = React.useMemo(() => generateQrMatrix(url, "Q"), [url]);
  const n = matrix.length;
  const quiet = 3;
  const total = n + quiet * 2;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleDownload = () => {
    const scale = 20;
    const sizePx = total * scale;
    const canvas = document.createElement("canvas");
    canvas.width = sizePx;
    canvas.height = sizePx + 120;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#F6F5F2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0E1012";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    ctx.fillStyle = "#0E1012";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r]?.[c]) {
          ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
        }
      }
    }

    ctx.font = "600 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MO WORLD — FRONTIER FASHION HUB", canvas.width / 2, sizePx + 42);
    ctx.fillStyle = "#1F5668";
    ctx.font = "500 20px sans-serif";
    ctx.fillText("moworld.chameleon.vision", canvas.width / 2, sizePx + 78);

    const link = document.createElement("a");
    link.download = "MO-WORLD-QR.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="رمز الاستجابة السريع لمتجر MO WORLD"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        data-modal-scroll
        className="no-scrollbar relative z-10 w-full max-w-sm overflow-y-auto rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 text-center"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <BrandLogo variant="monogram" className="h-6 w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="inline-flex size-8 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <p dir="ltr" className="micro-label mt-5 text-[var(--brand-accent)]">
          SCAN STOREFRONT // QR
        </p>
        <h3 className="mt-1 text-base font-semibold text-[var(--text-primary)]">
          امسح الكود لفتح متجر MO WORLD مباشرة
        </h3>

        <div className="mx-auto mt-4 w-56 rounded-[4px] border border-[#DCD8CF] bg-[#F6F5F2] p-3">
          <svg
            viewBox={`0 0 ${total} ${total}`}
            className="size-full"
            shapeRendering="crispEdges"
          >
            <rect width={total} height={total} fill="#F6F5F2" />
            {matrix.map((row, r) =>
              row.map((cell, c) =>
                cell ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c + quiet}
                    y={r + quiet}
                    width={1}
                    height={1}
                    fill="#0E1012"
                  />
                ) : null,
              ),
            )}
          </svg>
        </div>

        <p dir="ltr" className="mt-3 font-en text-xs text-[var(--text-muted)]">
          {url}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
          >
            {copied ? <Check className="size-3.5" strokeWidth={1.5} /> : <Copy className="size-3.5" strokeWidth={1.5} />}
            <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-3 py-2.5 text-xs font-medium text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
          >
            <Download className="size-3.5" strokeWidth={1.5} />
            <span>تحميل PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
