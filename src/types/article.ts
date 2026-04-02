import { AffiliateLink } from "./spot";

export type ArticleCategory =
  | "model-course" | "seasonal" | "gourmet" | "onsen"
  | "family" | "couple" | "solo" | "budget" | "luxury" | "tips";

export const ARTICLE_CATEGORY_LABEL: Record<ArticleCategory, string> = {
  "model-course": "モデルコース", seasonal: "季節特集", gourmet: "グルメ",
  onsen: "温泉", family: "家族旅", couple: "カップル", solo: "一人旅",
  budget: "節約旅", luxury: "贅沢旅", tips: "旅のコツ",
};

export interface ArticleSection {
  type: "text" | "heading" | "image" | "spot-card" | "affiliate-box" | "callout";
  content: string;
  caption?: string;
  level?: number;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: ArticleCategory;
  prefectureId: string;
  tags: string[];
  spotIds: string[];
  sections: ArticleSection[];
  affiliateLinks?: AffiliateLink[];
  relatedArticleSlugs?: string[];
}
