export type ArticleTargetType =
  | "カップル"
  | "一人旅"
  | "家族"
  | "友達"
  | "女子旅"
  | "全般";

export type ArticleCategory =
  | "モデルコース"
  | "エリアガイド"
  | "季節特集"
  | "テーマ旅"
  | "グルメ旅"
  | "温泉旅"
  | "絶景旅";

export interface ArticleSection {
  heading: string;
  body: string;
  image?: string;
  destinationId?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  content: ArticleSection[];
  relatedDestinations: string[];
  tags: string[];
  targetType: ArticleTargetType;
  category: ArticleCategory;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
  featured?: boolean;
}
