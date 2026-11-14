import "server-only";
import fs from "node:fs";
import path from "node:path";
import { buildSeed } from "./seed";
import type { DB } from "./types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "moworld-data")
  : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const STORE_ROW_ID = "moworld";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

let queue: Promise<unknown> = Promise.resolve();
let memoryCache: { db: DB; ts: number } | null = null;
const CACHE_TTL_MS = 1500;

function ensureLocal() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(buildSeed(), null, 2), "utf8");
  }
}

function readLocalDB(): DB {
  ensureLocal();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8")) as DB;
}

function writeLocalDB(db: DB) {
  ensureLocal();
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_FILE);
}

async function readSupabaseDB(): Promise<DB | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/alban_store?id=eq.${STORE_ROW_ID}&select=data`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { data?: DB }[];
    if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data) {
      return rows[0].data;
    }
    const seed = readLocalDB();
    await writeSupabaseDB(seed);
    return seed;
  } catch {
    return null;
  }
}

async function writeSupabaseDB(db: DB): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/alban_store?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([
        {
          id: STORE_ROW_ID,
          data: db,
          updated_at: new Date().toISOString(),
        },
      ]),
      cache: "no-store",
    });
  } catch {
    // Fallback silently so local writes still succeed
  }
}

const LEGACY_CATEGORY_TITLES: Record<string, { nameAr: string; descriptionAr: string }> = {
  "ملابس الأطفال والأطقم": {
    nameAr: "أزياء الأطفال",
    descriptionAr: "أطقم فليس ثقيلة ٤٠٠ جرام وقصّات كارجو عملية للأطفال.",
  },
  "الأساسيات اليومية الثقيلة": {
    nameAr: "الأساسيات الثقيلة",
    descriptionAr: "قطع يومية أحادية اللون من القطن المصري فائق الكثافة.",
  },
  "إصدارات الاستوديو والجاكيتات": {
    nameAr: "إصدارات الاستوديو",
    descriptionAr: "كبسولات موسمية تشمل الجاكيتات المعمارية والمعاطف.",
  },
  "إصدارات الأرشيف المحدودة": {
    nameAr: "إصدارات الأرشيف",
    descriptionAr: "قطع تجريبية محدودة الإصدار بطبعات الدار المنحوتة.",
  },
};

function sanitizeLegacySeed(db: DB): { db: DB; migrated: boolean } {
  let migrated = false;
  const s = db.settings;
  if (s.phone === "01024885590") s.phone = "";
  if (s.whatsapp === "201024885590") s.whatsapp = "";
  if (s.instagramUrl === "https://instagram.com") s.instagramUrl = "";
  if (s.facebookUrl === "https://facebook.com") s.facebookUrl = "";
  if (s.tiktokUrl === "https://tiktok.com") s.tiktokUrl = "";
  if (s.showroomAddressAr === "القاهرة الجديدة — التجمع الخامس، شارع التسعين الشمالي") {
    s.showroomAddressAr = "";
  }
  if (s.showroomNameAr === "MO WORLD — صالة العرض الرئيسية") {
    s.showroomNameAr = "المتجر الإلكتروني الرسمي";
  }
  if (s.workingHoursAr === "يومياً من ١٢ ظهراً حتى ١١ مساءً") {
    s.workingHoursAr = "الطلب أونلاين متاح ٢٤ ساعة — توصيل لجميع المحافظات";
  }
  if (
    s.announcementAr?.startsWith("WINTER DROP // MO WORLD") ||
    s.announcementAr === "شحن مجاني للطلبات فوق ٢٬٥٠٠ ج.م • معاينة عند الاستلام"
  ) {
    s.announcementAr = "تشكيلة MO / KIDS الشتوية متاحة الآن • شحن مجاني فوق ٢٬٥٠٠ ج.م";
  }

  for (const cat of db.categories) {
    const mapped = LEGACY_CATEGORY_TITLES[cat.nameAr];
    if (mapped) {
      cat.nameAr = mapped.nameAr;
      cat.descriptionAr = mapped.descriptionAr;
    }
  }

  if ((db.catalogVersion ?? 0) < 2) {
    const seed = buildSeed();
    // Preserve any merchant-created custom items (uid("p_") / uid("drop_"))
    const customProducts = (db.products || []).filter((p) => p.id.startsWith("p_") || p.id.startsWith("prd_"));
    const customDrops = (db.drops || []).filter((d) => d.id.startsWith("drop_") || d.id.startsWith("drp_"));
    db.categories = seed.categories;
    db.products = [...seed.products, ...customProducts];
    db.drops = [...seed.drops, ...customDrops];
    db.settings.taglineAr = seed.settings.taglineAr;
    db.catalogVersion = 2;
    migrated = true;
  }

  return { db, migrated };
}

export async function readDB(forceFresh = false): Promise<DB> {
  if (!forceFresh && memoryCache && Date.now() - memoryCache.ts < CACHE_TTL_MS) {
    return structuredClone(memoryCache.db);
  }
  const remote = await readSupabaseDB();
  if (remote) {
    const { migrated } = sanitizeLegacySeed(remote);
    if (migrated) {
      await writeSupabaseDB(remote);
    }
    memoryCache = { db: remote, ts: Date.now() };
    return structuredClone(remote);
  }
  const rawLocal = readLocalDB();
  const { db: local, migrated } = sanitizeLegacySeed(rawLocal);
  if (migrated) {
    try {
      writeLocalDB(local);
    } catch {
      // Ignore read-only FS errors
    }
  }
  memoryCache = { db: local, ts: Date.now() };
  return structuredClone(local);
}

export function updateDB<T>(fn: (db: DB) => T): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDB(true);
    const result = fn(db);
    memoryCache = { db: structuredClone(db), ts: Date.now() };
    try {
      writeLocalDB(db);
    } catch {
      // Ignore local write errors on read-only FS
    }
    await writeSupabaseDB(db);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

export function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export async function publicDB() {
  const db = await readDB();
  const { adminPassword: _pw, adminUsername: _u, ...settings } = db.settings;
  void _pw;
  void _u;
  const now = Date.now();
  return {
    settings,
    categories: [...db.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    products: db.products,
    shippingZones: db.shippingZones.filter((z) => z.isActive),
    drops: db.drops.filter(
      (d) =>
        d.isActive &&
        new Date(d.startsAt).getTime() <= now &&
        new Date(d.endsAt).getTime() >= now,
    ),
  };
}

export type PublicData = Awaited<ReturnType<typeof publicDB>>;
