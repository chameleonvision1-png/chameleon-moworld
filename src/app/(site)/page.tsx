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

      {/* 2. Sub-Brand Slash Architecture Grid */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
                SUB-BRAND ARCHITECTURE
              </p>
              <h2 className="mt-1.5 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                خطوط MO WORLD الأربعة
              </h2>
            </div>
            <p className="max-w-md text-xs text-[var(--text-muted)]">
              من الانطلاقة الأساسية في أزياء الأطفال العصرية إلى الخطوط الشبابية واليومية الموحدة تحت سقف واحد.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.categories.map((cat) => {
              const count = availableProducts.filter((p) => p.subBrand === cat.subBrand).length;
              return (
                <Link
                  key={cat.id}
                  href={`/shop?sub=${encodeURIComponent(cat.subBrand)}`}
                  className="group flex flex-col justify-between rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 transition-colors hover:border-[var(--brand-accent)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        dir="ltr"
                        className="font-en text-xs font-bold tracking-[0.2em] text-[var(--brand-accent)]"
                      >
                        {cat.subBrand}
                      </span>
                      <span className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-en text-[10px] font-semibold text-[var(--text-muted)]">
                        {count} PIECES
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">
                      {cat.nameAr}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                      {cat.descriptionAr}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-accent)]">
                    <span>استكشف القسم</span>
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Editorial Campaign Split Banner (08_MO_WORLD_Website_UI Inspired) */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-16 sm:py-20">
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

            <div className="flex flex-col justify-center lg:col-span-6">
              <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
                WINTER COLLECTION // FRONTIER FASHION HUB
              </p>
              <h2
                dir="ltr"
                className="font-editorial mt-3 text-right text-3xl font-medium text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
              >
                Curated Contemporary Streetwear &amp; Everyday Heavyweight Fits.
              </h2>
              <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                تطور طبيعي من عالم الأطفال إلى دار أزياء عصرية متكاملة
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                انطلقت رحلتنا من مجتمع متخصص في أزياء الأطفال العصرية (MO Children&apos;s World)، لتتوسع اليوم تحت هوية MO WORLD بهندسة بصرية سويسرية هادئة وخامات قطن مصري ثقيل ٤٠٠ جرام تجمع بين الراحة العملية للأطفال والقصّات المعمارية للشباب واليونيسكس.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[var(--border-subtle)] py-4">
                <div>
                  <p dir="ltr" className="text-right font-en text-base font-bold text-[var(--text-primary)]">
                    400 GSM
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">فليس قطن مصري ثقيل</p>
                </div>
                <div>
                  <p dir="ltr" className="text-right font-en text-base font-bold text-[var(--text-primary)]">
                    4 LINES
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">أطفال • أساسيات • استوديو</p>
                </div>
                <div>
                  <p dir="ltr" className="text-right font-en text-base font-bold text-[var(--text-primary)]">
                    14 DAYS
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">استبدال واسترجاع مرن</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-6 py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
                >
                  <span>تسوق إصدارات الشتاء</span>
                  <ArrowLeft className="size-4" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/size-guide"
                  className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
                >
                  <Ruler className="size-4 text-[var(--brand-accent)]" strokeWidth={1.5} />
                  <span>دليل وحاسبة المقاسات</span>
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
        <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
                  COORDINATED SETS &amp; CAPSULES
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  الكبسولات والأطقم المجمعة
                </h2>
                <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                  إطلالات كاملة منسقة مسبقاً للأطفال والشباب بسعر باكدج مخصص مع تغليف MO WORLD الرسمي.
                </p>
              </div>

              <Link
                href="/drops"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] sm:self-auto"
              >
                <span>جميع الباكدجات</span>
                <ArrowLeft className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {data.drops.slice(0, 3).map((drop) => (
                <DropCard key={drop.id} drop={drop} products={availableProducts} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Atelier Packaging, Garment Hardware & Customer Guarantees */}
      <section className="bg-[var(--bg-primary)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <p dir="ltr" className="micro-label text-right text-[var(--brand-accent)]">
                  ATELIER STANDARDS &amp; PACKAGING
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  تجربة استلام تليق بدار أزياء عالمية
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                  كل قطعة من MO WORLD تصل إليك بليبل رقبة منسوج عالي الكثافة، تيكت قطني ٧٠٠ جرام مختوم بشعار الدار، وأكياس شحن مقاومة للمياه تحفظ قوام القطعة حتى باب منزلك.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                    <Eye className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        معاينة الأوردر مع المندوب قبل الاستلام
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        حقك الكامل في فتح الشحنة والتأكد من الخامة والمقاس واللون مع المندوب قبل الدفع.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                    <RefreshCw className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        استبدال واسترجاع خلال ١٤ يوماً
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        تبديل سهل وسريع للمقاسات خلال ١٤ يوماً من تاريخ الاستلام بحالة القطعة الأصلية وبكامل التيكت.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                    <Truck className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        توصيل لجميع المحافظات خلال ٢–٤ أيام عمل
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        شحن مجاني تلقائي للطلبات فوق {data.settings.freeShippingThreshold.toLocaleString("en-US")} ج.م.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/brand"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-accent)] hover:underline"
                >
                  <span>استعرض تفاصيل التغليف والهوية البصرية الكاملة</span>
                  <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              <div className="overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <img
                  src="/images/brand/tags-labels-hardware.webp"
                  alt="تفاصيل الليبل المنسوج والتيكت القطني — MO WORLD"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="border-t border-[var(--border-subtle)] p-3.5">
                  <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.18em] text-[var(--brand-accent)]">
                    GARMENT HARDWARE
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--text-primary)]">
                    ليبل رقبة منسوج وتيكت قطني ٧٠٠ جرام بدبوس معدني مطفي
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
                <div className="border-t border-[var(--border-subtle)] p-3.5">
                  <p dir="ltr" className="text-right font-en text-[10px] font-semibold tracking-[0.18em] text-[var(--brand-accent)]">
                    UNBOXING &amp; ATELIER
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--text-primary)]">
                    تغليف ألاباستر مقوى وورق زبدة مختوم بشعار MO
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
