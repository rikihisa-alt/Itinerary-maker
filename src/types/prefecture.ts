export interface Area {
  id: string;
  name: string;
  prefectureId: string;
}

export interface Prefecture {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  regionId: string;
  description: string;
  coverImage: string;
  areas: Area[];
}

export const REGIONS = [
  { id: "hokkaido", name: "北海道" },
  { id: "tohoku", name: "東北" },
  { id: "kanto", name: "関東" },
  { id: "chubu", name: "中部" },
  { id: "kinki", name: "近畿" },
  { id: "chugoku", name: "中国" },
  { id: "shikoku", name: "四国" },
  { id: "kyushu", name: "九州・沖縄" },
] as const;
