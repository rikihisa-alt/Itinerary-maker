import { Area } from "@/types/destination";

export const AREA_LIST: Area[] = [
  "北海道",
  "東北",
  "関東",
  "北陸",
  "中部",
  "関西",
  "中国",
  "四国",
  "九州",
  "沖縄",
];

export const CATEGORY_LIST = [
  "温泉",
  "自然",
  "歴史・文化",
  "グルメ",
  "アクティビティ",
  "街歩き",
  "リゾート",
  "絶景",
  "神社仏閣",
  "アート",
] as const;

export const TAG_LIST = [
  "カップル",
  "一人旅",
  "家族",
  "友達",
  "女子旅",
  "のんびり",
  "アクティブ",
  "食べ歩き",
  "穴場",
  "定番",
  "ドライブ",
  "電車旅",
  "インスタ映え",
  "癒し",
] as const;

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
