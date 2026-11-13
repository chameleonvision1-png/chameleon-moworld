/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  LogOut,
  MessageSquare,
  Moon,
  Package,
  Plus,
  Settings as SettingsIcon,
  ShoppingBag,
  Sun,
  Trash2,
  Truck,
  Upload,
} from "lucide-react";
import type {
  AgeGroup,
  DB,
  DropBundle,
  FitType,
  GarmentColor,
  GarmentSize,
  Order,
  OrderStatus,
  Product,
  Settings,
  ShippingZone,
  SubBrand,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { useTheme } from "./ThemeProvider";

const SUB_BRANDS: SubBrand[] = [
  "MO / KIDS",
  "MO / ESSENTIALS",
  "MO / STUDIO",
  "MO / ARCHIVE",
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "طلب جديد",
  confirmed: "تم التأكيد",
  shipped: "خرج للشحن",
  completed: "مكتمل",
  cancelled: "ملغي",
};

function emptyProductDraft(): Partial<Product> {
  return {
    code: `MW-${Math.floor(100 + Math.random() * 899)}`,
    subBrand: "MO / ESSENTIALS",
    categoryId: "cat-essentials",
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    fabricSpec: "100% Egyptian Cotton • 240 GSM",
    fitType: "Oversized",
    ageGroup: "unisex",
    price: 750,
    oldPrice: undefined,
    isAvailable: true,
    isFeatured: true,
    isNewDrop: true,
    onHeroRail: false,
    colors: [
      {
        id: "primary",
        nameAr: "ألاباستر",
        nameEn: "Alabaster",
        hex: "#F6F5F2",
        frontImage: "/images/products/bone-tee-front.webp",
        backImage: "/images/products/bone-tee-back.webp",
      },
    ],
    sizes: [
      { id: "s", label: "S", stock: 12 },
      { id: "m", label: "M", stock: 15 },
      { id: "l", label: "L", stock: 15 },
      { id: "xl", label: "XL", stock: 10 },
    ],
  };
}

export function AdminDashboard({
  initialAuthed,
  initialData,
}: {
  initialAuthed: boolean;
  initialData: DB | null;
}) {
  const { theme, toggleTheme } = useTheme();

  // Login State
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [loginErr, setLoginErr] = React.useState("");
  const [loginBusy, setLoginBusy] = React.useState(false);

  // Dashboard State
  const [tab, setTab] = React.useState<"orders" | "products" | "drops" | "zones" | "settings">("orders");
  const [orders, setOrders] = React.useState<Order[]>(initialData?.orders ?? []);
  const [products, setProducts] = React.useState<Product[]>(initialData?.products ?? []);
  const [drops, setDrops] = React.useState<DropBundle[]>(initialData?.drops ?? []);
  const [zones, setZones] = React.useState<ShippingZone[]>(initialData?.shippingZones ?? []);
  const [settings, setSettings] = React.useState<Settings | null>(initialData?.settings ?? null);
  const [toast, setToast] = React.useState<string>("");

  // Order filter
  const [orderFilter, setOrderFilter] = React.useState<"all" | OrderStatus>("all");

  // Product Editor State
  const [editingProduct, setEditingProduct] = React.useState<Partial<Product> | null>(null);
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);

  // Drop Editor State
  const [editingDrop, setEditingDrop] = React.useState<Partial<DropBundle> | null>(null);

  // Zone Editor State
  const [editingZone, setEditingZone] = React.useState<Partial<ShippingZone> | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    setLoginBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setLoginErr(json.error || "بيانات الدخول غير صحيحة");
        setLoginBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setLoginErr("تعذر الاتصال بالخادم");
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const uploadFile = async (file: File, tag: string): Promise<string | null> => {
    setUploadingField(tag);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        notify(data.error || "تعذر رفع الصورة");
        return null;
      }
      notify("تم رفع الصورة وتحويلها إلى WebP بنجاح");
      return data.url;
    } catch {
      notify("حدث خطأ أثناء رفع الصورة");
      return null;
    } finally {
      setUploadingField(null);
    }
  };

  if (!initialAuthed || !initialData || !settings) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[var(--bg-primary)] p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
        >
          <div className="flex flex-col items-center text-center">
            <BrandLogo variant="stacked" className="h-16 w-auto" />
            <p dir="ltr" className="micro-label mt-4 text-[var(--brand-accent)]">
              ADMINISTRATION CONSOLE
            </p>
            <h1 className="mt-1 text-lg font-bold text-[var(--text-primary)]">
              تسجيل دخول إدارة المتجر
            </h1>
          </div>

          {loginErr && (
            <div className="mt-4 rounded-[4px] border border-red-500/40 bg-red-500/10 p-2.5 text-center text-xs text-[var(--text-primary)]">
              {loginErr}
            </div>
          )}

          <div className="mt-5 space-y-3.5">
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-[var(--text-primary)]">اسم المستخدم</span>
              <input
                type="text"
                required
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-[var(--text-primary)]">كلمة المرور</span>
              <input
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loginBusy}
            className="mt-5 w-full rounded-[4px] bg-[var(--brand-accent)] py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)] disabled:opacity-50"
          >
            {loginBusy ? "جاري التحقق..." : "دخول لوحة التحكم"}
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              العودة لواجهة المتجر
            </Link>
          </div>
        </form>
      </div>
    );
  }

  // Orders Actions
  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      notify("تم تحديث حالة الطلب");
    }
  };

  // Product Actions
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const categoryMap: Record<SubBrand, string> = {
      "MO / KIDS": "cat-kids",
      "MO / ESSENTIALS": "cat-essentials",
      "MO / STUDIO": "cat-studio",
      "MO / ARCHIVE": "cat-archive",
    };
    const payload = {
      ...editingProduct,
      categoryId: categoryMap[editingProduct.subBrand || "MO / ESSENTIALS"],
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { product?: Product };
    if (res.ok && data.product) {
      const saved = data.product;
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      setEditingProduct(null);
      notify("تم حفظ بيانات القطعة");
    }
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify("تم حذف القطعة");
    }
  };

  // Drop Actions
  const saveDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDrop) return;
    const res = await fetch("/api/admin/drops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingDrop),
    });
    const data = (await res.json()) as { drop?: DropBundle };
    if (res.ok && data.drop) {
      const saved = data.drop;
      setDrops((prev) => {
        const idx = prev.findIndex((d) => d.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      setEditingDrop(null);
      notify("تم حفظ الباكدج بنجاح");
    }
  };

  const deleteDrop = async (id: string) => {
    const res = await fetch(`/api/admin/drops?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDrops((prev) => prev.filter((d) => d.id !== id));
      notify("تم حذف الباكدج");
    }
  };

  // Zone Actions
  const saveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    const res = await fetch("/api/admin/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingZone),
    });
    const data = (await res.json()) as { zone?: ShippingZone };
    if (res.ok && data.zone) {
      const saved = data.zone;
      setZones((prev) => {
        const idx = prev.findIndex((z) => z.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [...prev, saved];
      });
      setEditingZone(null);
      notify("تم حفظ منطقة الشحن");
    }
  };

  const deleteZone = async (id: string) => {
    const res = await fetch(`/api/admin/zones?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setZones((prev) => prev.filter((z) => z.id !== id));
      notify("تم حذف منطقة الشحن");
    }
  };

  // Settings Action
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setSettings((s) => (s ? { ...s, adminPassword: "" } : s));
      notify("تم حفظ إعدادات المتجر بنجاح");
    }
  };

  const filteredOrders =
    orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);
  const activeRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BrandLogo variant="horizontal" className="h-7 w-auto" />
            <span className="hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-accent)] sm:inline-block">
              لوحة الإدارة
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="تبديل المظهر"
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)]"
            >
              <span>معاينة المتجر</span>
              <ExternalLink className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] px-3 text-xs font-medium text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-4 py-2.5 text-xs font-semibold text-[#F6F5F2] shadow-lg">
          <Check className="size-4" />
          <span>{toast}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <p className="text-xs text-[var(--text-muted)]">إجمالي الطلبات</p>
            <p className="mt-1 font-en text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <p className="text-xs text-[var(--text-muted)]">طلبات جديدة بانتظار التأكيد</p>
            <p className="mt-1 font-en text-2xl font-bold text-[var(--brand-accent)]">
              {orders.filter((o) => o.status === "new").length}
            </p>
          </div>
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <p className="text-xs text-[var(--text-muted)]">عدد القطع في الكتالوج</p>
            <p className="mt-1 font-en text-2xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <p className="text-xs text-[var(--text-muted)]">إجمالي المبيعات المسجلة</p>
            <p className="mt-1 text-xl font-bold">{formatPrice(activeRevenue)}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="no-scrollbar mt-6 flex items-center gap-2 overflow-x-auto border-b border-[var(--border-subtle)] pb-3">
          {[
            { id: "orders", label: `الطلبات (${orders.length})`, icon: ShoppingBag },
            { id: "products", label: `القطع والمنتجات (${products.length})`, icon: Package },
            { id: "drops", label: `الكبسولات والباكدجات (${drops.length})`, icon: Package },
            { id: "zones", label: `مناطق الشحن (${zones.length})`, icon: Truck },
            { id: "settings", label: "إعدادات المتجر", icon: SettingsIcon },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-[4px] border px-4 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                }`}
              >
                <Icon className="size-3.5" strokeWidth={1.5} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS */}
        {tab === "orders" && (
          <div className="mt-6 space-y-4">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {(["all", "new", "confirmed", "shipped", "completed", "cancelled"] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderFilter(st)}
                    className={`shrink-0 rounded-[4px] border px-3 py-1.5 text-xs font-medium ${
                      orderFilter === st
                        ? "border-[var(--text-primary)] bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]"
                        : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-subtle)]"
                    }`}
                  >
                    {st === "all" ? "الكل" : ORDER_STATUS_LABELS[st]}
                  </button>
                ),
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 text-center text-xs text-[var(--text-muted)]">
                لا توجد طلبات مسجلة في هذا التصنيف حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const cleanCustPhone = order.customerPhone.replace(/[^\d]/g, "");
                  const custWa = cleanCustPhone.startsWith("0")
                    ? `2${cleanCustPhone}`
                    : cleanCustPhone;
                  return (
                    <div
                      key={order.id}
                      className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                        <div>
                          <span dir="ltr" className="font-en text-xs font-bold text-[var(--brand-accent)]">
                            #{order.id.slice(-6).toUpperCase()}
                          </span>
                          <span className="mx-2 text-[var(--border-subtle)]">|</span>
                          <span className="text-xs font-bold">{order.customerName}</span>
                          <span className="mx-2 text-[var(--border-subtle)]">|</span>
                          <span dir="ltr" className="font-en text-xs text-[var(--text-muted)]">
                            {order.customerPhone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="h-8 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 text-xs font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                          >
                            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((k) => (
                              <option key={k} value={k}>
                                {ORDER_STATUS_LABELS[k]}
                              </option>
                            ))}
                          </select>

                          <a
                            href={`https://wa.me/${custWa}?text=${encodeURIComponent(
                              `أهلاً ${order.customerName}، معك خدمة عملاء MO WORLD بخصوص طلبك رقم #${order.id
                                .slice(-6)
                                .toUpperCase()}.`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 items-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2]"
                          >
                            <MessageSquare className="size-3.5" />
                            <span>مراسلة العميل</span>
                          </a>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2 text-xs">
                          <p className="text-[var(--text-muted)]">
                            <strong className="text-[var(--text-primary)]">العنوان:</strong>{" "}
                            {order.governorateName} — {order.address}
                          </p>
                          {order.notes && (
                            <p className="text-[var(--text-muted)]">
                              <strong className="text-[var(--text-primary)]">ملاحظات:</strong>{" "}
                              {order.notes}
                            </p>
                          )}
                          <p className="font-bold text-[var(--text-primary)]">
                            الإجمالي عند الاستلام: {formatPrice(order.total)} (شامل الشحن:{" "}
                            {order.shippingFee === 0 ? "مجاني" : formatPrice(order.shippingFee)})
                          </p>
                        </div>

                        <ul className="space-y-1.5 text-xs">
                          {order.items.map((it, idx) => (
                            <li
                              key={`${it.productId}-${idx}`}
                              className="flex items-center justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1.5"
                            >
                              <span>
                                <strong dir="ltr" className="font-en text-[var(--brand-accent)]">
                                  [{it.code}]
                                </strong>{" "}
                                {it.nameAr} — {it.colorNameAr} ({it.sizeLabel}) × {it.qty}
                              </span>
                              <span className="font-semibold">
                                {formatPrice(it.unitPrice * it.qty)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {tab === "products" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">إدارة القطع والمقاسات</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(emptyProductDraft())}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-4 py-2 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
              >
                <Plus className="size-4" />
                <span>إضافة قطعة جديدة</span>
              </button>
            </div>

            {editingProduct && (
              <form
                onSubmit={saveProduct}
                className="rounded-[4px] border border-[var(--brand-accent)] bg-[var(--bg-surface)] p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <h3 className="text-sm font-bold">
                    {editingProduct.id ? "تعديل بيانات القطعة" : "إضافة قطعة جديدة للكتالوج"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    إلغاء
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">كود القطعة (SKU)</span>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={editingProduct.code || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, code: e.target.value })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">الخط الفرعي (Sub-Brand)</span>
                    <select
                      value={editingProduct.subBrand || "MO / ESSENTIALS"}
                      onChange={(e) => {
                        const sb = e.target.value as SubBrand;
                        setEditingProduct({
                          ...editingProduct,
                          subBrand: sb,
                          ageGroup: sb === "MO / KIDS" ? "kids" : editingProduct.ageGroup,
                        });
                      }}
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    >
                      {SUB_BRANDS.map((sb) => (
                        <option key={sb} value={sb}>
                          {sb}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">الفئة العمرية</span>
                    <select
                      value={editingProduct.ageGroup || "unisex"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          ageGroup: e.target.value as AgeGroup,
                        })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                    >
                      <option value="kids">أطفال (Kids)</option>
                      <option value="youth">شبابي (Youth)</option>
                      <option value="adult">بالغين (Adult)</option>
                      <option value="unisex">يونيسكس (Unisex)</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                    <span className="font-semibold">اسم القطعة بالعربية *</span>
                    <input
                      type="text"
                      required
                      value={editingProduct.nameAr || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, nameAr: e.target.value })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">الاسم بالإنجليزية</span>
                    <input
                      type="text"
                      dir="ltr"
                      value={editingProduct.nameEn || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, nameEn: e.target.value })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">السعر (ج.م) *</span>
                    <input
                      type="number"
                      required
                      value={editingProduct.price ?? 0}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">السعر قبل الخصم (اختياري)</span>
                    <input
                      type="number"
                      value={editingProduct.oldPrice ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          oldPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">نوع القصّة (Fit)</span>
                    <select
                      value={editingProduct.fitType || "Oversized"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fitType: e.target.value as FitType,
                        })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    >
                      <option value="Oversized">Oversized</option>
                      <option value="Relaxed">Relaxed</option>
                      <option value="Regular">Regular</option>
                      <option value="Boxy">Boxy</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs sm:col-span-3">
                    <span className="font-semibold">مواصفات الخامة (Fabric Spec)</span>
                    <input
                      type="text"
                      dir="ltr"
                      value={editingProduct.fabricSpec || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, fabricSpec: e.target.value })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs sm:col-span-3">
                    <span className="font-semibold">الوصف التفصيلي بالعربية</span>
                    <textarea
                      rows={2}
                      value={editingProduct.descriptionAr || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })
                      }
                      className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2.5 text-xs"
                    />
                  </label>
                </div>

                {/* Primary Color & R2 Image Upload */}
                <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4">
                  <p className="text-xs font-bold">اللون الأساسي وصور القطعة (أمامي / خلفي)</p>
                  {(() => {
                    const colors: GarmentColor[] = editingProduct.colors?.length
                      ? editingProduct.colors
                      : [
                          {
                            id: "default",
                            nameAr: "أساسي",
                            nameEn: "Primary",
                            hex: "#0E1012",
                            frontImage: "/images/products/bone-tee-front.webp",
                          },
                        ];
                    const first = colors[0];
                    const updateFirst = (patch: Partial<GarmentColor>) => {
                      const next = [{ ...first, ...patch }, ...colors.slice(1)];
                      setEditingProduct({ ...editingProduct, colors: next });
                    };
                    return (
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <label className="flex flex-col gap-1 text-xs">
                          <span>اسم اللون</span>
                          <input
                            type="text"
                            value={first.nameAr}
                            onChange={(e) => updateFirst({ nameAr: e.target.value })}
                            className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs">
                          <span>درجة اللون (Hex)</span>
                          <input
                            type="text"
                            dir="ltr"
                            value={first.hex}
                            onChange={(e) => updateFirst({ hex: e.target.value })}
                            className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 font-en text-xs"
                          />
                        </label>
                        <div className="flex flex-col gap-1 text-xs">
                          <span>الصورة الأمامية</span>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              dir="ltr"
                              value={first.frontImage}
                              onChange={(e) => updateFirst({ frontImage: e.target.value })}
                              className="h-9 min-w-0 flex-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 font-en text-[11px]"
                            />
                            <label className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-[11px] font-semibold hover:border-[var(--brand-accent)]">
                              <Upload className="size-3.5" />
                              <span>{uploadingField === "front" ? "..." : "رفع"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  const url = await uploadFile(f, "front");
                                  if (url) updateFirst({ frontImage: url });
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <span>صورة الظهر (اختياري)</span>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              dir="ltr"
                              value={first.backImage || ""}
                              onChange={(e) => updateFirst({ backImage: e.target.value })}
                              className="h-9 min-w-0 flex-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 font-en text-[11px]"
                            />
                            <label className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-[11px] font-semibold hover:border-[var(--brand-accent)]">
                              <Upload className="size-3.5" />
                              <span>{uploadingField === "back" ? "..." : "رفع"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  const url = await uploadFile(f, "back");
                                  if (url) updateFirst({ backImage: url });
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Sizes Quick Preset */}
                <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold">المقاسات والمخزون</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            sizes: [
                              { id: "4-5y", label: "4-5Y", stock: 12 },
                              { id: "6-7y", label: "6-7Y", stock: 15 },
                              { id: "8-9y", label: "8-9Y", stock: 15 },
                              { id: "10-12y", label: "10-12Y", stock: 12 },
                            ],
                          })
                        }
                        className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px]"
                      >
                        قالب مقاسات أطفال (4-12Y)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            sizes: [
                              { id: "s", label: "S", stock: 12 },
                              { id: "m", label: "M", stock: 16 },
                              { id: "l", label: "L", stock: 16 },
                              { id: "xl", label: "XL", stock: 10 },
                            ],
                          })
                        }
                        className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px]"
                      >
                        قالب مقاسات شبابي (S–XL)
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(editingProduct.sizes || []).map((sz: GarmentSize, idx: number) => (
                      <div
                        key={sz.id || idx}
                        className="flex items-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-xs"
                      >
                        <span dir="ltr" className="w-14 font-en font-bold">
                          {sz.label}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={sz.stock}
                          onChange={(e) => {
                            const next = [...(editingProduct.sizes || [])];
                            next[idx] = { ...sz, stock: Number(e.target.value) };
                            setEditingProduct({ ...editingProduct, sizes: next });
                          }}
                          className="h-7 w-full rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 font-en text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-5 text-xs">
                  {[
                    { key: "isAvailable", label: "متاح للطلب" },
                    { key: "isFeatured", label: "ضمن مختارات الرئيسية" },
                    { key: "isNewDrop", label: "علامة NEW DROP" },
                    { key: "onHeroRail", label: "عرض على استاند الهيرو" },
                  ].map((flag) => (
                    <label key={flag.key} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct[flag.key as keyof Product])}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            [flag.key]: e.target.checked,
                          })
                        }
                      />
                      <span>{flag.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="rounded-[4px] border border-[var(--border-subtle)] px-4 py-2 text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-[4px] bg-[var(--brand-accent)] px-6 py-2 text-xs font-semibold text-[#F6F5F2]"
                  >
                    حفظ القطعة
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3"
                >
                  <img
                    src={p.colors[0]?.frontImage}
                    alt={p.nameAr}
                    className="aspect-[4/5] w-16 shrink-0 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p dir="ltr" className="text-right font-en text-[10px] font-bold text-[var(--brand-accent)]">
                      {p.subBrand} · {p.code}
                    </p>
                    <p className="truncate text-xs font-semibold">{p.nameAr}</p>
                    <p className="mt-0.5 text-xs font-bold">{formatPrice(p.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(structuredClone(p))}
                        className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 text-[11px] font-medium hover:border-[var(--brand-accent)]"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        aria-label="حذف"
                        className="inline-flex size-6 items-center justify-center rounded-[3px] text-[var(--text-muted)] hover:text-red-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DROPS */}
        {tab === "drops" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">إدارة الكبسولات والباكدجات المجمعة</h2>
              <button
                type="button"
                onClick={() =>
                  setEditingDrop({
                    code: "DROP-MW",
                    subBrand: "MO / KIDS",
                    titleAr: "",
                    titleEn: "SEASONAL CAPSULE",
                    descriptionAr: "",
                    image: "/images/products/kids-cargo-set-petrol.webp",
                    price: 1990,
                    badgeEn: "CAPSULE DROP",
                    isActive: true,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-4 py-2 text-xs font-semibold text-[#F6F5F2]"
              >
                <Plus className="size-4" />
                <span>إضافة باكدج جديدة</span>
              </button>
            </div>

            {editingDrop && (
              <form
                onSubmit={saveDrop}
                className="rounded-[4px] border border-[var(--brand-accent)] bg-[var(--bg-surface)] p-5 space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">كود الباكدج</span>
                    <input
                      type="text"
                      dir="ltr"
                      value={editingDrop.code || ""}
                      onChange={(e) => setEditingDrop({ ...editingDrop, code: e.target.value })}
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">الخط الفرعي</span>
                    <select
                      value={editingDrop.subBrand || "MO / KIDS"}
                      onChange={(e) =>
                        setEditingDrop({ ...editingDrop, subBrand: e.target.value as SubBrand })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    >
                      {SUB_BRANDS.map((sb) => (
                        <option key={sb} value={sb}>
                          {sb}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">سعر الباكدج (ج.م)</span>
                    <input
                      type="number"
                      required
                      value={editingDrop.price ?? 0}
                      onChange={(e) =>
                        setEditingDrop({ ...editingDrop, price: Number(e.target.value) })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                    <span className="font-semibold">عنوان الباكدج بالعربية *</span>
                    <input
                      type="text"
                      required
                      value={editingDrop.titleAr || ""}
                      onChange={(e) => setEditingDrop({ ...editingDrop, titleAr: e.target.value })}
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                    />
                  </label>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">صورة الباكدج</span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        dir="ltr"
                        value={editingDrop.image || ""}
                        onChange={(e) => setEditingDrop({ ...editingDrop, image: e.target.value })}
                        className="h-9 min-w-0 flex-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 font-en text-[11px]"
                      />
                      <label className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 text-[11px] font-semibold">
                        <Upload className="size-3.5" />
                        <span>رفع</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const url = await uploadFile(f, "drop");
                            if (url) setEditingDrop({ ...editingDrop, image: url });
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <label className="flex flex-col gap-1 text-xs sm:col-span-3">
                    <span className="font-semibold">الوصف</span>
                    <textarea
                      rows={2}
                      value={editingDrop.descriptionAr || ""}
                      onChange={(e) =>
                        setEditingDrop({ ...editingDrop, descriptionAr: e.target.value })
                      }
                      className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2.5 text-xs"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDrop(null)}
                    className="rounded-[4px] border border-[var(--border-subtle)] px-4 py-2 text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-[4px] bg-[var(--brand-accent)] px-6 py-2 text-xs font-semibold text-[#F6F5F2]"
                  >
                    حفظ الباكدج
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {drops.map((d) => (
                <div
                  key={d.id}
                  className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
                >
                  <p dir="ltr" className="text-right font-en text-[10px] font-bold text-[var(--brand-accent)]">
                    {d.subBrand} · {d.code}
                  </p>
                  <h3 className="mt-1 text-sm font-bold">{d.titleAr}</h3>
                  <p className="mt-1 text-xs font-semibold">{formatPrice(d.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDrop(structuredClone(d))}
                      className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1 text-xs"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDrop(d.id)}
                      className="text-xs text-[var(--text-muted)] hover:text-red-500"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ZONES */}
        {tab === "zones" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">مناطق وأسعار الشحن</h2>
              <button
                type="button"
                onClick={() =>
                  setEditingZone({
                    nameAr: "",
                    etaAr: "خلال ٢–٤ أيام عمل",
                    fee: 80,
                    isActive: true,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-4 py-2 text-xs font-semibold text-[#F6F5F2]"
              >
                <Plus className="size-4" />
                <span>إضافة منطقة</span>
              </button>
            </div>

            {editingZone && (
              <form
                onSubmit={saveZone}
                className="rounded-[4px] border border-[var(--brand-accent)] bg-[var(--bg-surface)] p-5 space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">اسم المنطقة / المحافظة *</span>
                    <input
                      type="text"
                      required
                      value={editingZone.nameAr || ""}
                      onChange={(e) =>
                        setEditingZone({ ...editingZone, nameAr: e.target.value })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">مدة التوصيل</span>
                    <input
                      type="text"
                      value={editingZone.etaAr || ""}
                      onChange={(e) =>
                        setEditingZone({ ...editingZone, etaAr: e.target.value })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold">رسوم الشحن (ج.م)</span>
                    <input
                      type="number"
                      value={editingZone.fee ?? 0}
                      onChange={(e) =>
                        setEditingZone({ ...editingZone, fee: Number(e.target.value) })
                      }
                      className="h-9 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingZone(null)}
                    className="rounded-[4px] border border-[var(--border-subtle)] px-4 py-2 text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-[4px] bg-[var(--brand-accent)] px-6 py-2 text-xs font-semibold text-[#F6F5F2]"
                  >
                    حفظ المنطقة
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-[var(--border-subtle)] rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              {zones.map((z) => (
                <div
                  key={z.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs"
                >
                  <div>
                    <p className="font-bold">{z.nameAr}</p>
                    <p className="text-[var(--text-muted)]">{z.etaAr}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--brand-accent)]">
                      {formatPrice(z.fee)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingZone(structuredClone(z))}
                      className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteZone(z.id)}
                      className="text-[var(--text-muted)] hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {tab === "settings" && (
          <form
            onSubmit={saveSettings}
            className="mt-6 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4"
          >
            <h2 className="border-b border-[var(--border-subtle)] pb-3 text-base font-bold">
              الإعدادات العامة للمتجر
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">رقم الهاتف المعروض</span>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">رقم واتساب الطلبات (بكود الدولة مثال 2010...)</span>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">حد الشحن المجاني (ج.م)</span>
                <input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeShippingThreshold: Number(e.target.value),
                    })
                  }
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">مواعيد العمل</span>
                <input
                  type="text"
                  value={settings.workingHoursAr}
                  onChange={(e) =>
                    setSettings({ ...settings, workingHoursAr: e.target.value })
                  }
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                <span className="font-semibold">عنوان صالة العرض</span>
                <input
                  type="text"
                  value={settings.showroomAddressAr}
                  onChange={(e) =>
                    setSettings({ ...settings, showroomAddressAr: e.target.value })
                  }
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                <span className="font-semibold">شريط الإعلان العلوي</span>
                <input
                  type="text"
                  value={settings.announcementAr}
                  onChange={(e) =>
                    setSettings({ ...settings, announcementAr: e.target.value })
                  }
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">اسم مستخدم الإدارة</span>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.adminUsername}
                  onChange={(e) =>
                    setSettings({ ...settings, adminUsername: e.target.value })
                  }
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">كلمة مرور جديدة (اتركها فارغة للإبقاء على الحالية)</span>
                <input
                  type="password"
                  dir="ltr"
                  value={settings.adminPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, adminPassword: e.target.value })
                  }
                  className="h-10 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 font-en text-xs"
                />
              </label>
            </div>

            <label className="inline-flex items-center gap-2 pt-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={settings.acceptingOrders}
                onChange={(e) =>
                  setSettings({ ...settings, acceptingOrders: e.target.checked })
                }
              />
              <span>استقبال الطلبات مفعل حالياً على الموقع</span>
            </label>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="rounded-[4px] bg-[var(--brand-accent)] px-6 py-2.5 text-xs font-semibold text-[#F6F5F2] hover:bg-[var(--brand-accent-hover)]"
              >
                حفظ الإعدادات
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
