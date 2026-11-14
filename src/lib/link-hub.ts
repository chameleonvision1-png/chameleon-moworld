import type { Settings } from "./types";
import { buildDirectWhatsAppUrl } from "./whatsapp";

export type PublicSettings = Omit<Settings, "adminPassword" | "adminUsername">;

export interface HubChannelItem {
  id: string;
  labelAr: string;
  labelEn: string;
  subtitleAr: string;
  href: string | null;
  external?: boolean;
}

const PLACEHOLDER_DOMAINS = new Set([
  "https://instagram.com",
  "https://www.instagram.com",
  "https://facebook.com",
  "https://www.facebook.com",
  "https://tiktok.com",
  "https://www.tiktok.com",
  "http://instagram.com",
  "http://facebook.com",
  "http://tiktok.com",
]);

export function cleanExternalUrl(raw?: string): string | null {
  const v = (raw || "").trim();
  if (!v) return null;
  const normalized = v.replace(/\/+$/, "").toLowerCase();
  if (PLACEHOLDER_DOMAINS.has(normalized)) return null;
  return v;
}

export function cleanPhone(raw?: string): string | null {
  const digits = (raw || "").replace(/[^\d+]/g, "").trim();
  if (!digits || digits === "01024885590" || digits === "201024885590") return null;
  return raw!.trim();
}

export function buildOfficialHubChannels(settings: PublicSettings): HubChannelItem[] {
  const waDigits = cleanPhone(settings.whatsapp)?.replace(/[^\d]/g, "") || "";
  const phoneVal = cleanPhone(settings.phone);

  const channels: HubChannelItem[] = [
    {
      id: "instagram",
      labelAr: "انستجرام الرسمي",
      labelEn: "INSTAGRAM",
      subtitleAr: "أحدث جلسات التصوير والإصدارات",
      href: cleanExternalUrl(settings.instagramUrl),
      external: true,
    },
    {
      id: "tiktok",
      labelAr: "تيك توك",
      labelEn: "TIKTOK",
      subtitleAr: "فيديوهات الخامات وتنسيق الإطلالات",
      href: cleanExternalUrl(settings.tiktokUrl),
      external: true,
    },
    {
      id: "facebook",
      labelAr: "فيسبوك",
      labelEn: "FACEBOOK",
      subtitleAr: "الصفحة الرسمية لدار MO WORLD",
      href: cleanExternalUrl(settings.facebookUrl),
      external: true,
    },
    {
      id: "whatsapp-group",
      labelAr: "جروب ومجتمع الواتساب",
      labelEn: "VIP GROUP",
      subtitleAr: "أولوية الحجز وتنبيهات الكبسولات",
      href: cleanExternalUrl(settings.whatsappGroupUrl),
      external: true,
    },
    {
      id: "whatsapp-care",
      labelAr: "واتساب خدمة العملاء",
      labelEn: "WHATSAPP",
      subtitleAr: "استفسارات المقاسات ومتابعة الشحن",
      href: waDigits
        ? buildDirectWhatsAppUrl(
            waDigits,
            "أهلاً MO WORLD، أرغب في الاستفسار عن التشكيلة المتاحة والمقاسات.",
          )
        : null,
      external: true,
    },
  ];

  if (cleanExternalUrl(settings.telegramUrl)) {
    channels.push({
      id: "telegram",
      labelAr: "قناة تيليجرام",
      labelEn: "TELEGRAM",
      subtitleAr: "التحديثات الفورية والأرشيف",
      href: cleanExternalUrl(settings.telegramUrl),
      external: true,
    });
  }

  if (phoneVal) {
    channels.push({
      id: "phone",
      labelAr: "الاتصال المباشر",
      labelEn: phoneVal,
      subtitleAr: settings.workingHoursAr || "خدمة العملاء",
      href: `tel:${phoneVal}`,
      external: false,
    });
  }

  return channels;
}
