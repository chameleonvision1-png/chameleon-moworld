/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowLeft, Eye, RefreshCw, Ruler, Truck } from "lucide-react";
import { publicDB } from "@/lib/db";
import { HeroRailSection } from "@/components/HeroRailSection";
import { HomeFeaturedGallery } from "@/components/HomeClientSections";
import { DropCard } from "@/components/DropCard";

export default async function HomePage() {
  const data = await publicDB();
  const availableProducts = data.products.filter((p) => p.isAvailable);

  return (
    <div>
      {/* 1. Interactive 3D Clothing Rail Hero */}
      <div className="border-b border-[var(--border-subtle)]">
        <HeroRailSection products={availableProducts} />
      </div>

      {/* 2. Sub-Brand Slash Architecture Grid (Symmetric 2x2 on Mobile, 4-Col on Desktop) */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
              COLLECTIONS
            </p>
            <h2 className="mt-1.5 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
              أقسام الدار الأربعة
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              أربعة خطوط متكاملة للأطفال والشباب تحت سقف واحد.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {data.categories.map((cat) => {
              const count = availableProducts.filter((p) => p.subBrand === cat.subBrand).length;
              const shortBadge = cat.subBrand.replace("MO / ", "");
              return (
                <Link
                  key={cat.id}
                  href={`/shop?sub=${encodeURIComponent(cat.subBrand)}`}
                  className="group flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5 transition-colors hover:border-[var(--brand-accent)] sm:p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        dir="ltr"
                        className="font-en text-[10px] font-bold tracking-[0.16em] text-[var(--brand-accent)] sm:text-xs"
                      >
                        <span className="sm:hidden">{shortBadge}</span>
                        <span className="hidden sm:inline">{cat.subBrand}</span>
                      </span>
                      <span
                        dir="ltr"
                        className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-en text-[10px] font-semibold text-[var(--text-muted)]"
                      >
                        {count}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-sm font-bold text-[var(--text-primary)] sm:text-base">
                      {cat.nameAr}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--text-muted)] sm:text-xs">
                      {cat.descriptionAr}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5 text-[11px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-accent)] sm:text-xs">
                    <span>تصفح القسم</span>
                    <ArrowLeft className="size-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Editorial Campaign Split Banner */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <img
                  src="/images/brand/editorial-winter-campaign.webp"
                  alt="MO WORLD Winter Campaign — Kids & Youth Streetwear"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center text-center lg:col-span-6 lg:text-right">
              <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
                OUR EVOLUTION
              </p>
              <p
                dir="ltr"
                className="font-editorial mt-2 text-2xl font-medium text-[var(--text-muted)] sm:text-3xl"
              >
                Built for Every Generation.
              </p>
              <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)] sm:text-3xl">
                من أزياء الأطفال إلى دار أزياء عصرية
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm lg:mx-0">
                بدأت رحلتنا من مجتمع متخصص في أزياء الأطفال المريحة، لتتوسع اليوم تحت مظلة دار متكاملة تجمع بين خامات القطن المصري الثقيل ٤٠٠ جرام والقصّات المعمارية الهادئة للأطفال والشباب.
              </p>

              {/* Symmetric 3-Column Stats Bar */}
              <div className="mt-6 grid grid-cols-3 border-y border-[var(--border-subtle)] py-4 text-center">
                <div className="px-1">
                  <p dir="ltr" className="font-en text-sm font-bold text-[var(--text-primary)] sm:text-base">
                    400 GSM
                  </p>
                  <p className="mt-0.5 text-[11px] whitespace-nowrap text-[var(--text-muted)]">
                    قطن مصري ثقيل
                  </p>
                </div>
                <div className="border-x border-[var(--border-subtle)] px-1">
                  <p dir="ltr" className="font-en text-sm font-bold text-[var(--text-primary)] sm:text-base">
                    4 LINES
                  </p>
                  <p className="mt-0.5 text-[11px] whitespace-nowrap text-[var(--text-muted)]">
                    شامل كل الأعمار
                  </p>
                </div>
                <div className="px-1">
                  <p dir="ltr" className="font-en text-sm font-bold text-[var(--text-primary)] sm:text-base">
                    14 DAYS
                  </p>
                  <p className="mt-0.5 text-[11px] whitespace-nowrap text-[var(--text-muted)]">
                    استبدال مرن
                  </p>
                </div>
              </div>

              {/* Side-by-Side Equal Action Buttons */}
              <div className="mx-auto mt-6 grid w-full max-w-[320px] grid-cols-2 gap-2.5 sm:max-w-sm lg:mx-0">
                <Link
                  href="/shop"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] whitespace-nowrap transition-colors hover:bg-[var(--brand-accent-hover)]"
                >
                  <span>تسوق التشكيلة</span>
                  <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/size-guide"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap transition-colors hover:border-[var(--text-primary)]"
                >
                  <Ruler className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                  <span>حاسبة المقاس</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated 4:5 Product Gallery */}
      <HomeFeaturedGallery products={availableProducts} />

      {/* 5. Capsule Drops & Coordinated Bundles */}
      {data.drops.length > 0 && (
        <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
                CAPSULE SETS
              </p>
              <h2 className="mt-1.5 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                الكبسولات والأطقم المجمعة
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                إطلالات كاملة منسقة مسبقاً للأطفال والشباب بسعر باكدج مخصص.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {data.drops.slice(0, 3).map((drop) => (
                <DropCard key={drop.id} drop={drop} products={availableProducts} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/drops"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
              >
                <span>جميع الباكدجات المجمعة</span>
                <ArrowLeft className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. Atelier Packaging, Garment Hardware & Customer Guarantees */}
      <section className="bg-[var(--bg-primary)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="flex flex-col justify-between text-center lg:col-span-5 lg:text-right">
              <div>
                <p dir="ltr" className="micro-label text-[var(--brand-accent)]">
                  ATELIER STANDARDS
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  تفاصيل تليق بدار أزياء عالمية
                </h2>
                <p className="mx-auto mt-2.5 max-w-md text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm lg:mx-0">
                  كل قطعة تصل إليك بليبل رقبة منسوج عالي الكثافة، تيكت قطني ٧٠٠ جرام، وتغليف يحفظ قوام القطعة حتى باب منزلك.
                </p>

                <div className="mt-6 space-y-2.5 text-right">
                  <div className="flex items-start gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
                    <Eye className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        معاينة الأوردر قبل الاستلام
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                        حقك الكامل في فتح الشحنة والتأكد من الخامة والمقاس مع المندوب قبل الدفع.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
                    <RefreshCw className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        استبدال واسترجاع خلال ١٤ يوماً
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                        تبديل سهل وسريع للمقاسات خلال ١٤ يوماً بحالة القطعة الأصلية وبكامل التيكت.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
                    <Truck className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        توصيل لجميع المحافظات خلال ٢–٤ أيام
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                        شحن مجاني تلقائي للطلبات فوق {data.settings.freeShippingThreshold.toLocaleString("en-US")} ج.م.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-center lg:justify-start">
                <Link
                  href="/brand"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-accent)] hover:underline"
                >
                  <span>تفاصيل الهوية البصرية والتغليف</span>
                  <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Symmetric 2-Column Hardware & Unboxing Cards (Side-by-side on Mobile & Desktop) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
              <div className="overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <img
                  src="/images/brand/tags-labels-hardware.webp"
                  alt="تفاصيل الليبل المنسوج والتيكت القطني — MO WORLD"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="border-t border-[var(--border-subtle)] p-3 text-center sm:p-3.5 sm:text-right">
                  <p dir="ltr" className="font-en text-[9px] font-semibold tracking-[0.16em] text-[var(--brand-accent)] sm:text-[10px]">
                    HARDWARE
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                    ليبل منسوج وتيكت ٧٠٠ جرام
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <img
                  src="/images/brand/unboxing-showroom.webp"
                  alt="صندوق الهدايا المغناطيسي وتجربة الاستلام — MO WORLD"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="border-t border-[var(--border-subtle)] p-3 text-center sm:p-3.5 sm:text-right">
                  <p dir="ltr" className="font-en text-[9px] font-semibold tracking-[0.16em] text-[var(--brand-accent)] sm:text-[10px]">
                    UNBOXING
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                    تغليف ألاباستر وورق مختوم
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
