import type { Order } from "./types";

export function buildOrderWhatsAppUrl(whatsappNumber: string, order: Order, originUrl?: string): string {
  const cleanPhone = whatsappNumber.replace(/[^\d]/g, "");
  const lines: string[] = [
    `MO WORLD | طلب جديد رقم #${order.id.slice(-6).toUpperCase()}`,
    "────────────────────",
    `العميل: ${order.customerName}`,
    `الموبايل: ${order.customerPhone}`,
    `المحافظة: ${order.governorateName}`,
    `العنوان: ${order.address}`,
    "────────────────────",
    "القطع المطلوبة:",
  ];

  for (const item of order.items) {
    lines.push(
      `• [${item.code}] ${item.nameAr} — اللون: ${item.colorNameAr} | المقاس: ${item.sizeLabel} × ${item.qty} (${(item.unitPrice * item.qty).toLocaleString("en-US")} ج.م)`,
    );
  }

  lines.push("────────────────────");
  lines.push(`المجموع الفرعي: ${order.subtotal.toLocaleString("en-US")} ج.م`);
  lines.push(
    `الشحن: ${order.shippingFee === 0 ? "مجاني" : `${order.shippingFee.toLocaleString("en-US")} ج.م`}`,
  );
  lines.push(`الإجمالي الكلي: ${order.total.toLocaleString("en-US")} ج.م`);
  if (order.notes) {
    lines.push(`ملاحظات: ${order.notes}`);
  }
  lines.push("نظام الاستلام: الدفع عند الاستلام مع إتاحة معاينة الأوردر مع المندوب.");
  if (originUrl) {
    lines.push(`رابط متابعة الطلب: ${originUrl}/order/${order.id}`);
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildDirectWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanPhone = whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
