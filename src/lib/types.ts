export type SubBrand =
  | "MO / KIDS"
  | "MO / ESSENTIALS"
  | "MO / STUDIO"
  | "MO / ARCHIVE";

export type AgeGroup = "kids" | "youth" | "adult" | "unisex";

export type FitType = "Oversized" | "Relaxed" | "Regular" | "Boxy";

export type RailKind = "tee" | "knit" | "hoodie" | "shirt" | "jacket" | "coat";

export interface GarmentColor {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  frontImage: string;
  backImage?: string;
  sideImage?: string;
}

export interface GarmentSize {
  id: string;
  label: string;
  stock: number;
  chestCm?: number;
  lengthCm?: number;
  ageHint?: string;
}

export interface Category {
  id: string;
  slug: string;
  subBrand: SubBrand;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  code: string;
  subBrand: SubBrand;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  fabricSpec: string;
  fitType: FitType;
  ageGroup: AgeGroup;
  price: number;
  oldPrice?: number;
  colors: GarmentColor[];
  sizes: GarmentSize[];
  careNotes: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  isNewDrop: boolean;
  onHeroRail: boolean;
  railKind?: RailKind;
  completeLookIds?: string[];
}

export interface ShippingZone {
  id: string;
  nameAr: string;
  etaAr: string;
  fee: number;
  isActive: boolean;
}

export interface DropBundle {
  id: string;
  code: string;
  subBrand: SubBrand;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  image: string;
  price: number;
  oldPrice?: number;
  badgeEn: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  includedProductIds?: string[];
}

export interface OrderItem {
  productId: string;
  code: string;
  nameAr: string;
  nameEn: string;
  colorId: string;
  colorNameAr: string;
  colorHex: string;
  sizeLabel: string;
  unitPrice: number;
  qty: number;
  image: string;
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "completed" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  governorateId: string;
  governorateName: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Settings {
  storeName: string;
  taglineEn: string;
  taglineAr: string;
  phone: string;
  whatsapp: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  whatsappGroupUrl?: string;
  telegramUrl?: string;
  showroomNameAr: string;
  showroomAddressAr: string;
  workingHoursAr: string;
  deliveryPromiseAr: string;
  exchangePolicyAr: string;
  careInstructionAr: string;
  freeShippingThreshold: number;
  announcementAr: string;
  acceptingOrders: boolean;
  adminUsername: string;
  adminPassword: string;
}

export interface DB {
  settings: Settings;
  categories: Category[];
  products: Product[];
  shippingZones: ShippingZone[];
  drops: DropBundle[];
  orders: Order[];
}
