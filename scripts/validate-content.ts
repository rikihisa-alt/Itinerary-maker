/**
 * コンテンツ整合性バリデーション
 *
 * 実行: npx tsx scripts/validate-content.ts
 *
 * 検証項目:
 * 1. 記事の spotIds が実在するスポットIDを参照しているか
 * 2. 記事の sections 内の spot-card が実在するスポットIDを参照しているか
 * 3. 記事の relatedArticleSlugs が実在する記事slugを参照しているか
 * 4. 記事の prefectureId が実在する都道府県IDを参照しているか
 * 5. 記事の coverImage が空でないか
 * 6. スポットの nearby が実在するスポットIDを参照しているか
 * 7. スポットの relatedArticles が実在する記事slugを参照しているか
 * 8. スポットの prefectureId が実在する都道府県IDを参照しているか
 * 9. スポットの images が空でないか
 * 10. slug/id の重複チェック
 * 11. 写真URLの有効性チェック（形式のみ）
 */

import { allSpots } from "../src/content/spots";
import { allArticles } from "../src/content/articles";
import { prefectures } from "../src/content/prefectures";

type Issue = { level: "ERROR" | "WARN"; source: string; message: string };
const issues: Issue[] = [];

function error(source: string, msg: string) { issues.push({ level: "ERROR", source, message: msg }); }
function warn(source: string, msg: string) { issues.push({ level: "WARN", source, message: msg }); }

const spotIds = new Set(allSpots.map((s) => s.id));
const articleSlugs = new Set(allArticles.map((a) => a.slug));
const prefIds = new Set(prefectures.map((p) => p.id));

// ── 重複チェック ──
const spotIdCount: Record<string, number> = {};
allSpots.forEach((s) => { spotIdCount[s.id] = (spotIdCount[s.id] || 0) + 1; });
Object.entries(spotIdCount).forEach(([id, count]) => {
  if (count > 1) error(`spot:${id}`, `スポットID「${id}」が${count}件重複`);
});

const slugCount: Record<string, number> = {};
allArticles.forEach((a) => { slugCount[a.slug] = (slugCount[a.slug] || 0) + 1; });
Object.entries(slugCount).forEach(([slug, count]) => {
  if (count > 1) error(`article:${slug}`, `記事slug「${slug}」が${count}件重複`);
});

// ── スポット検証 ──
allSpots.forEach((s) => {
  const src = `spot:${s.id}`;

  if (!prefIds.has(s.prefectureId)) {
    error(src, `prefectureId「${s.prefectureId}」は存在しない都道府県ID`);
  }

  if (s.images.length === 0) {
    error(src, "images が空。写真が1枚もない");
  }
  s.images.forEach((img, i) => {
    if (!img.startsWith("http")) {
      error(src, `images[${i}] がURLではない: "${img.slice(0, 50)}..."`);
    }
  });

  s.nearby.forEach((nid) => {
    if (!spotIds.has(nid)) {
      error(src, `nearby「${nid}」は存在しないスポットID`);
    }
  });

  (s.relatedArticles || []).forEach((slug) => {
    if (!articleSlugs.has(slug)) {
      warn(src, `relatedArticles「${slug}」は存在しない記事slug`);
    }
  });

  if (!s.description || s.description.length < 5) {
    warn(src, "description が短すぎる（5文字未満）");
  }
  if (!s.longDescription || s.longDescription.length < 20) {
    warn(src, "longDescription が短すぎる（20文字未満）");
  }
});

// ── 記事検証 ──
allArticles.forEach((a) => {
  const src = `article:${a.slug}`;

  if (!prefIds.has(a.prefectureId)) {
    error(src, `prefectureId「${a.prefectureId}」は存在しない都道府県ID`);
  }

  if (!a.coverImage || !a.coverImage.startsWith("http")) {
    error(src, `coverImage が空またはURLではない`);
  }

  a.spotIds.forEach((sid) => {
    if (!spotIds.has(sid)) {
      error(src, `spotIds「${sid}」は存在しないスポットID → 記事と写真の不整合の可能性`);
    }
  });

  a.sections.forEach((sec, i) => {
    if (sec.type === "spot-card" && !spotIds.has(sec.content)) {
      error(src, `sections[${i}] spot-card「${sec.content}」は存在しないスポットID → 記事内のスポットカードが壊れる`);
    }
    if (sec.type === "image" && sec.content && !sec.content.startsWith("http")) {
      warn(src, `sections[${i}] image がURLではない`);
    }
  });

  (a.relatedArticleSlugs || []).forEach((slug) => {
    if (!articleSlugs.has(slug)) {
      warn(src, `relatedArticleSlugs「${slug}」は存在しない記事slug`);
    }
  });

  if (!a.title || a.title.length < 3) {
    error(src, "title が短すぎる");
  }
  if (!a.description || a.description.length < 5) {
    warn(src, "description が短すぎる");
  }
  if (a.sections.length === 0) {
    error(src, "sections が空。記事本文がない");
  }
  if (a.tags.length === 0) {
    warn(src, "tags が空。検索で見つからない");
  }
});

// ── 都道府県 → スポット/記事の存在チェック ──
const populatedPrefs = new Set([
  ...allSpots.map((s) => s.prefectureId),
  ...allArticles.map((a) => a.prefectureId),
]);
prefectures.filter((p) => p.regionId === "kinki").forEach((p) => {
  if (!populatedPrefs.has(p.id)) {
    warn(`prefecture:${p.id}`, "近畿エリアだがスポットも記事もない");
  }
});

// ── 結果出力 ──
console.log("\n╔══════════════════════════════════════════╗");
console.log("║   コンテンツ整合性バリデーション結果      ║");
console.log("╚══════════════════════════════════════════╝\n");

console.log(`スポット: ${allSpots.length}件`);
console.log(`記事:     ${allArticles.length}件`);
console.log(`都道府県: ${prefectures.length}件\n`);

const errors = issues.filter((i) => i.level === "ERROR");
const warnings = issues.filter((i) => i.level === "WARN");

if (errors.length > 0) {
  console.log(`\x1b[31m■ ERROR: ${errors.length}件\x1b[0m`);
  errors.forEach((e) => console.log(`  \x1b[31m✗\x1b[0m [${e.source}] ${e.message}`));
  console.log();
}

if (warnings.length > 0) {
  console.log(`\x1b[33m■ WARN: ${warnings.length}件\x1b[0m`);
  warnings.forEach((w) => console.log(`  \x1b[33m!\x1b[0m [${w.source}] ${w.message}`));
  console.log();
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("\x1b[32m✓ 全てのコンテンツが整合しています\x1b[0m\n");
}

console.log(`合計: ERROR ${errors.length} / WARN ${warnings.length}`);

// エラーがあればexit code 1
if (errors.length > 0) {
  process.exit(1);
}
