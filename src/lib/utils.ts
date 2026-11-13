export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} ج.م`;
}

export function formatPriceTag(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} EGP`;
}

export function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}
