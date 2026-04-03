import { allArticles } from "../content/articles/index";
import { kinkiSpots } from "../content/spots/kinki";

const VALID_PREFECTURE_IDS = [
  "kyoto", "osaka", "nara", "hyogo", "wakayama", "shiga", "mie",
];

export function validateAllContent(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const spotIdSet = new Set(kinkiSpots.map((s) => s.id));
  const articleSlugSet = new Set(allArticles.map((a) => a.slug));

  // 8. No duplicate article slugs
  const seenSlugs = new Set<string>();
  for (const article of allArticles) {
    if (seenSlugs.has(article.slug)) {
      errors.push(`Duplicate article slug: "${article.slug}"`);
    }
    seenSlugs.add(article.slug);
  }

  // 9. No duplicate spot IDs
  const seenSpotIds = new Set<string>();
  for (const spot of kinkiSpots) {
    if (seenSpotIds.has(spot.id)) {
      errors.push(`Duplicate spot ID: "${spot.id}"`);
    }
    seenSpotIds.add(spot.id);
  }

  // Validate articles
  for (const article of allArticles) {
    // 1. All article.spotIds reference valid spot IDs
    for (const sid of article.spotIds) {
      if (!spotIdSet.has(sid)) {
        errors.push(
          `Article "${article.slug}": spotId "${sid}" does not exist in spots`
        );
      }
    }

    // 2. All article.coverImage URLs are non-empty and start with https://
    if (!article.coverImage || !article.coverImage.startsWith("https://")) {
      errors.push(
        `Article "${article.slug}": coverImage is empty or does not start with https://`
      );
    }

    // 3. All article.prefectureId match a valid prefecture ID
    if (!VALID_PREFECTURE_IDS.includes(article.prefectureId)) {
      errors.push(
        `Article "${article.slug}": prefectureId "${article.prefectureId}" is not valid`
      );
    }

    // 4. All article.relatedArticleSlugs reference existing article slugs
    if (article.relatedArticleSlugs) {
      for (const slug of article.relatedArticleSlugs) {
        if (!articleSlugSet.has(slug)) {
          errors.push(
            `Article "${article.slug}": relatedArticleSlug "${slug}" does not exist`
          );
        }
      }
    }

    // Validate spot-card sections reference valid spot IDs
    for (const section of article.sections) {
      if (section.type === "spot-card" && !spotIdSet.has(section.content)) {
        errors.push(
          `Article "${article.slug}": spot-card references invalid spotId "${section.content}"`
        );
      }
    }
  }

  // Validate spots
  for (const spot of kinkiSpots) {
    // 5. All spot.images URLs are non-empty and start with https://
    for (let i = 0; i < spot.images.length; i++) {
      const img = spot.images[i];
      if (!img || !img.startsWith("https://")) {
        errors.push(
          `Spot "${spot.id}": image[${i}] is empty or does not start with https://`
        );
      }
    }

    // 6. All spot.nearby reference valid spot IDs
    for (const nid of spot.nearby) {
      if (!spotIdSet.has(nid)) {
        errors.push(
          `Spot "${spot.id}": nearby spotId "${nid}" does not exist`
        );
      }
    }

    // 7. All spot.relatedArticles reference existing article slugs
    if (spot.relatedArticles) {
      for (const slug of spot.relatedArticles) {
        if (!articleSlugSet.has(slug)) {
          errors.push(
            `Spot "${spot.id}": relatedArticle "${slug}" does not exist`
          );
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
