export type Area =
  | "北海道"
  | "東北"
  | "関東"
  | "北陸"
  | "中部"
  | "関西"
  | "中国"
  | "四国"
  | "九州"
  | "沖縄";

export type Prefecture =
  | "北海道"
  | "青森県"
  | "岩手県"
  | "宮城県"
  | "秋田県"
  | "山形県"
  | "福島県"
  | "茨城県"
  | "栃木県"
  | "群馬県"
  | "埼玉県"
  | "千葉県"
  | "東京都"
  | "神奈川県"
  | "新潟県"
  | "富山県"
  | "石川県"
  | "福井県"
  | "山梨県"
  | "長野県"
  | "岐阜県"
  | "静岡県"
  | "愛知県"
  | "三重県"
  | "滋賀県"
  | "京都府"
  | "大阪府"
  | "兵庫県"
  | "奈良県"
  | "和歌山県"
  | "鳥取県"
  | "島根県"
  | "岡山県"
  | "広島県"
  | "山口県"
  | "徳島県"
  | "香川県"
  | "愛媛県"
  | "高知県"
  | "福岡県"
  | "佐賀県"
  | "長崎県"
  | "熊本県"
  | "大分県"
  | "宮崎県"
  | "鹿児島県"
  | "沖縄県";

export type DestinationCategory =
  | "温泉"
  | "自然"
  | "歴史・文化"
  | "グルメ"
  | "アクティビティ"
  | "街歩き"
  | "リゾート"
  | "絶景"
  | "神社仏閣"
  | "アート";

export type TravelTag =
  | "カップル"
  | "一人旅"
  | "家族"
  | "友達"
  | "女子旅"
  | "男旅"
  | "シニア"
  | "子連れ"
  | "ペット可"
  | "インスタ映え"
  | "穴場"
  | "定番"
  | "のんびり"
  | "アクティブ"
  | "癒し"
  | "冒険"
  | "食べ歩き"
  | "ドライブ"
  | "電車旅";

export type Season = "春" | "夏" | "秋" | "冬" | "通年";

export type BudgetRange = "〜1万円" | "1〜3万円" | "3〜5万円" | "5〜10万円" | "10万円〜";

export type StayDuration = "日帰り" | "1泊2日" | "2泊3日" | "3泊以上";

export interface DestinationFeature {
  label: string;
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  area: Area;
  prefecture: Prefecture;
  category: DestinationCategory[];
  tags: TravelTag[];
  description: string;
  longDescription: string;
  features: DestinationFeature[];
  bestSeason: Season[];
  budgetRange: BudgetRange;
  stayDuration: StayDuration[];
  image: string;
  images?: string[];
  rating?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  access?: string;
  highlights?: string[];
}
