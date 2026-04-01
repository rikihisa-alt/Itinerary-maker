import { getAllDestinations, getArticlesForDestination } from "@/lib/contentLoader";
import { Destination } from "@/types/destination";
import { TravelDiagnosis, TravelProposal, ItineraryDay } from "@/types/itinerary";

function scoreDest(dest: Destination, diagnosis: TravelDiagnosis): number {
  let score = 0;

  // 関係性 → タグマッチ
  const relationMap: Record<string, string[]> = {
    カップル: ["カップル", "癒し", "のんびり", "インスタ映え"],
    友達: ["友達", "アクティブ", "食べ歩き", "冒険"],
    家族: ["家族", "子連れ", "定番", "のんびり"],
    一人: ["一人旅", "穴場", "のんびり", "電車旅"],
    夫婦: ["カップル", "のんびり", "癒し", "定番"],
    同僚: ["友達", "食べ歩き", "アクティブ", "定番"],
  };
  const relTags = relationMap[diagnosis.relationship] || [];
  for (const tag of relTags) {
    if (dest.tags.includes(tag as typeof dest.tags[number])) score += 3;
  }

  // 体験タイプ → カテゴリ/タグマッチ
  const expMap: Record<string, string[]> = {
    のんびり: ["温泉", "癒し", "のんびり", "リゾート"],
    アクティブ: ["アクティビティ", "アクティブ", "冒険", "自然"],
    バランス: ["街歩き", "歴史・文化", "定番"],
    グルメ中心: ["グルメ", "食べ歩き"],
    観光中心: ["歴史・文化", "神社仏閣", "絶景", "定番"],
  };
  const expTags = expMap[diagnosis.experienceType] || [];
  for (const tag of expTags) {
    if (dest.category.includes(tag as typeof dest.category[number])) score += 2;
    if (dest.tags.includes(tag as typeof dest.tags[number])) score += 2;
  }

  // 趣味嗜好マッチ
  for (const interest of diagnosis.interests) {
    if (dest.category.some((c) => c.includes(interest))) score += 3;
    if (dest.tags.some((t) => t.includes(interest))) score += 2;
    if (dest.description.includes(interest)) score += 1;
  }

  // エリア指定
  if (diagnosis.area && dest.area === diagnosis.area) score += 5;

  // 予算マッチ（簡易）
  if (diagnosis.budget) {
    if (dest.budgetRange === diagnosis.budget) score += 3;
  }

  return score;
}

function generateStory(dest: Destination, diagnosis: TravelDiagnosis): string {
  const relDesc: Record<string, string> = {
    カップル: "二人の距離が自然と縮まる",
    友達: "笑いが止まらない",
    家族: "みんなの笑顔が見える",
    一人: "自分だけの時間に浸れる",
    夫婦: "日常を離れてゆっくりできる",
    同僚: "気兼ねなく楽しめる",
  };

  const relText = relDesc[diagnosis.relationship] || "特別な時間を過ごせる";

  return `${dest.name}は${relText}場所。${dest.features[0]?.description || ""}${
    dest.features.length > 1
      ? `さらに${dest.features[1].label}も外せない。`
      : ""
  }${dest.longDescription.slice(0, 100)}...`;
}

function generateItinerary(dest: Destination, diagnosis: TravelDiagnosis): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const feats = dest.features;

  // Day 1
  const day1: ItineraryDay = {
    dayNumber: 1,
    spots: [
      { name: `${dest.prefecture}に到着`, time: "10:00", category: "移動" },
      { name: feats[0]?.label || `${dest.name}散策`, time: "11:00", duration: "2時間", category: "観光" },
      { name: "地元の食事処でランチ", time: "13:00", duration: "1時間", category: "食事" },
      { name: feats[1]?.label || `${dest.name}周辺散策`, time: "14:30", duration: "2時間", category: "観光" },
      { name: "宿にチェックイン", time: "17:00", category: "宿泊" },
      { name: "夕食", time: "18:30", duration: "1.5時間", category: "食事" },
    ],
  };
  days.push(day1);

  // Day 2（1泊以上）
  if (diagnosis.travelers > 0) {
    const day2: ItineraryDay = {
      dayNumber: 2,
      spots: [
        { name: "朝食", time: "08:00", category: "食事" },
        { name: feats[2]?.label || "周辺スポット", time: "09:30", duration: "2時間", category: "観光" },
        { name: feats[3]?.label || "お土産探し", time: "12:00", duration: "1時間", category: "その他" },
        { name: "ランチ", time: "13:00", duration: "1時間", category: "食事" },
        { name: "帰路", time: "15:00", category: "移動" },
      ],
    };
    days.push(day2);
  }

  return days;
}

export function generateProposal(diagnosis: TravelDiagnosis): TravelProposal {
  const allDests = getAllDestinations();
  const scored = allDests
    .map((d) => ({ dest: d, score: scoreDest(d, diagnosis) }))
    .sort((a, b) => b.score - a.score);

  const main = scored[0].dest;
  const alt1 = scored[1]?.dest;
  const alt2 = scored[2]?.dest;

  const mainArticles = getArticlesForDestination(main.id);
  const altArticles1 = alt1 ? getArticlesForDestination(alt1.id) : [];
  const altArticles2 = alt2 ? getArticlesForDestination(alt2.id) : [];
  const relatedArticleIds = [
    ...mainArticles.map((a) => a.id),
    ...altArticles1.map((a) => a.id),
    ...altArticles2.map((a) => a.id),
  ].filter((id, i, arr) => arr.indexOf(id) === i).slice(0, 4);

  return {
    main: {
      destination: main.id,
      story: generateStory(main, diagnosis),
      itinerary: generateItinerary(main, diagnosis),
      highlights: main.highlights || main.features.map((f) => f.label),
    },
    alternatives: [
      ...(alt1
        ? [
            {
              destination: alt1.id,
              story: generateStory(alt1, diagnosis),
              reason: `${main.name}とは違うアプローチで${diagnosis.experienceType}を楽しめる。`,
            },
          ]
        : []),
      ...(alt2
        ? [
            {
              destination: alt2.id,
              story: generateStory(alt2, diagnosis),
              reason: `意外な選択肢だけど、${diagnosis.relationship}の旅にはハマる可能性がある。`,
            },
          ]
        : []),
    ],
    comparison: [
      {
        label: "雰囲気",
        main: main.category[0],
        alt1: alt1?.category[0] || "—",
        alt2: alt2?.category[0] || "—",
      },
      {
        label: "予算",
        main: main.budgetRange,
        alt1: alt1?.budgetRange || "—",
        alt2: alt2?.budgetRange || "—",
      },
      {
        label: "滞在",
        main: main.stayDuration[0],
        alt1: alt1?.stayDuration[0] || "—",
        alt2: alt2?.stayDuration[0] || "—",
      },
      {
        label: "ベストシーズン",
        main: main.bestSeason[0],
        alt1: alt1?.bestSeason[0] || "—",
        alt2: alt2?.bestSeason[0] || "—",
      },
      {
        label: "こんな人向け",
        main: main.tags[0],
        alt1: alt1?.tags[0] || "—",
        alt2: alt2?.tags[0] || "—",
      },
    ],
    relatedArticleIds,
  };
}
