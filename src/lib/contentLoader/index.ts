import { destinations } from "@/content/destinations";
import { articles } from "@/content/articles";
import { Destination, Area, DestinationCategory, TravelTag } from "@/types/destination";
import { Article, ArticleCategory, ArticleTargetType } from "@/types/article";

// ── Destinations ──

export function getAllDestinations(): Destination[] {
  return destinations;
}

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function getDestinationsByArea(area: Area): Destination[] {
  return destinations.filter((d) => d.area === area);
}

export function getDestinationsByCategory(category: DestinationCategory): Destination[] {
  return destinations.filter((d) => d.category.includes(category));
}

export function getDestinationsByTag(tag: TravelTag): Destination[] {
  return destinations.filter((d) => d.tags.includes(tag));
}

export function searchDestinations(query: string): Destination[] {
  const q = query.toLowerCase();
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.prefecture.includes(q) ||
      d.area.includes(q) ||
      d.tags.some((t) => t.includes(q)) ||
      d.category.some((c) => c.includes(q))
  );
}

export function getFilteredDestinations(filters: {
  area?: Area;
  category?: DestinationCategory;
  tag?: TravelTag;
  query?: string;
}): Destination[] {
  let result = destinations;

  if (filters.area) {
    result = result.filter((d) => d.area === filters.area);
  }
  if (filters.category) {
    result = result.filter((d) => d.category.includes(filters.category!));
  }
  if (filters.tag) {
    result = result.filter((d) => d.tags.includes(filters.tag!));
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.prefecture.includes(q)
    );
  }

  return result;
}

// ── Articles ──

export function getAllArticles(): Article[] {
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getArticlesByTargetType(targetType: ArticleTargetType): Article[] {
  return articles.filter((a) => a.targetType === targetType);
}

export function getArticlesForDestination(destinationId: string): Article[] {
  return articles.filter((a) => a.relatedDestinations.includes(destinationId));
}

export function getRelatedArticles(articleId: string, limit = 3): Article[] {
  const article = getArticleById(articleId);
  if (!article) return [];

  return articles
    .filter((a) => a.id !== articleId)
    .map((a) => ({
      article: a,
      score:
        a.relatedDestinations.filter((d) => article.relatedDestinations.includes(d)).length * 3 +
        a.tags.filter((t) => article.tags.includes(t)).length * 2 +
        (a.targetType === article.targetType ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((a) => a.article);
}

// ── Cross-reference ──

export function getDestinationsForArticle(articleId: string): Destination[] {
  const article = getArticleById(articleId);
  if (!article) return [];
  return article.relatedDestinations
    .map((id) => getDestinationById(id))
    .filter((d): d is Destination => d !== undefined);
}
