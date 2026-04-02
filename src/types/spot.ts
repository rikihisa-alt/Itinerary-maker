export type SpotCategory =
  | "shrine" | "temple" | "castle" | "museum" | "park" | "garden"
  | "onsen" | "beach" | "mountain" | "viewpoint" | "street"
  | "restaurant" | "cafe" | "bar" | "market" | "shop"
  | "experience" | "festival" | "other";

export type CrowdLevel = "low" | "medium" | "high";

export interface AffiliateLink {
  provider: string;
  label: string;
  url: string;
}

export interface Spot {
  id: string;
  title: string;
  titleEn?: string;
  location: string;
  prefecture: string;
  prefectureId: string;
  area: string;
  areaId: string;
  category: SpotCategory;
  images: string[];
  description: string;
  longDescription: string;
  tags: string[];
  stayDuration: number;
  bestTime: string;
  crowdLevel: CrowdLevel;
  budget: string;
  access: string;
  rainyDay: boolean;
  highlights: string[];
  features: { label: string; text: string }[];
  nearby: string[];
  mapUrl?: string;
  officialUrl?: string;
  affiliateLinks?: AffiliateLink[];
  seasonality?: string[];
  openHours?: string;
  closedDays?: string;
  relatedArticles?: string[];
}

export const SPOT_CATEGORY_LABEL: Record<SpotCategory, string> = {
  shrine: "神社", temple: "寺院", castle: "城", museum: "美術館・博物館",
  park: "公園", garden: "庭園", onsen: "温泉", beach: "ビーチ",
  mountain: "山", viewpoint: "展望", street: "街歩き",
  restaurant: "レストラン", cafe: "カフェ", bar: "バー",
  market: "市場", shop: "ショップ", experience: "体験", festival: "祭り", other: "その他",
};
