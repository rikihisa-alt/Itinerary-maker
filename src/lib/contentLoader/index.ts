import { allSpots } from "@/content/spots";
import { allArticles } from "@/content/articles";
import { prefectures } from "@/content/prefectures";
import { Spot, SpotCategory } from "@/types/spot";
import { Article, ArticleCategory } from "@/types/article";
import { Prefecture } from "@/types/prefecture";

// ── Spots ──
export function getAllSpots(): Spot[] { return allSpots; }
export function getSpotById(id: string): Spot | undefined { return allSpots.find((s) => s.id === id); }
export function getSpotsByPrefecture(prefId: string): Spot[] { return allSpots.filter((s) => s.prefectureId === prefId); }
export function getSpotsByCategory(cat: SpotCategory): Spot[] { return allSpots.filter((s) => s.category === cat); }
export function getSpotsByArea(areaId: string): Spot[] { return allSpots.filter((s) => s.areaId === areaId); }
export function getSpotsByTag(tag: string): Spot[] { return allSpots.filter((s) => s.tags.includes(tag)); }
export function getNearbySpots(id: string): Spot[] {
  const s = getSpotById(id);
  return s ? s.nearby.map(getSpotById).filter((x): x is Spot => !!x) : [];
}
export function searchSpots(q: string): Spot[] {
  return allSpots.filter((s) =>
    s.title.includes(q) || s.description.includes(q) || s.location.includes(q) ||
    s.tags.some((t) => t.includes(q)) || s.area.includes(q) || s.prefecture.includes(q)
  );
}
export function getAreas(): string[] { return [...new Set(allSpots.map((s) => s.area))]; }
export function getAllTags(): string[] { return [...new Set(allSpots.flatMap((s) => s.tags))]; }
export function getAllCategories(): SpotCategory[] { return [...new Set(allSpots.map((s) => s.category))]; }

// ── Articles ──
export function getAllArticles(): Article[] { return allArticles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)); }
export function getArticleBySlug(slug: string): Article | undefined { return allArticles.find((a) => a.slug === slug); }
export function getArticlesByPrefecture(prefId: string): Article[] { return allArticles.filter((a) => a.prefectureId === prefId); }
export function getArticlesByCategory(cat: ArticleCategory): Article[] { return allArticles.filter((a) => a.category === cat); }
export function getArticlesForSpot(spotId: string): Article[] { return allArticles.filter((a) => a.spotIds.includes(spotId)); }

// ── Prefectures ──
export function getAllPrefectures(): Prefecture[] { return prefectures; }
export function getPrefectureById(id: string): Prefecture | undefined { return prefectures.find((p) => p.id === id); }
export function getPrefecturesByRegion(regionId: string): Prefecture[] { return prefectures.filter((p) => p.regionId === regionId); }
export function getKinkiPrefectures(): Prefecture[] { return getPrefecturesByRegion("kinki"); }
export function getPopulatedPrefectures(): Prefecture[] {
  return prefectures.filter((p) => allSpots.some((s) => s.prefectureId === p.id));
}

// ── Cross-reference ──
export function getSpotCountForPrefecture(prefId: string): number { return allSpots.filter((s) => s.prefectureId === prefId).length; }
export function getArticleCountForPrefecture(prefId: string): number { return allArticles.filter((a) => a.prefectureId === prefId).length; }
