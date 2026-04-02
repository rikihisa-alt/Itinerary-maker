export type SpotType = "sightseeing" | "meal" | "transport" | "hotel" | "rest" | "shopping" | "other";
export type ItineraryTheme = "default" | "vintage" | "modern" | "natural" | "cute";

export interface ItinSpot {
  id: string;
  spotId?: string;
  name: string;
  time: string;
  endTime?: string;
  note?: string;
  type: SpotType;
}

export interface ItinDay {
  dayNumber: number;
  date?: string;
  spots: ItinSpot[];
  memo: string;
}

export interface PackingItem {
  id: string;
  name: string;
  checked: boolean;
  category: "clothing" | "electronics" | "toiletries" | "documents" | "other";
}

export interface TravelerInfo {
  type: "solo" | "couple" | "family" | "friends" | "group";
  count: number;
}

export interface ItineraryData {
  title: string;
  subtitle: string;
  theme: ItineraryTheme;
  travelers: TravelerInfo;
  dateRange?: { start: string; end: string };
  prefectureIds: string[];
  days: ItinDay[];
  packingList: PackingItem[];
}

export const SPOT_TYPE_LABEL: Record<SpotType, string> = {
  sightseeing: "観光", meal: "食事", transport: "移動", hotel: "宿泊", rest: "休憩", shopping: "買い物", other: "その他",
};

export const SPOT_TYPE_COLOR: Record<SpotType, string> = {
  sightseeing: "bg-accent", meal: "bg-gold", transport: "bg-g3", hotel: "bg-[#7b6b8a]", rest: "bg-[#6b8a6b]", shopping: "bg-[#8a6b6b]", other: "bg-g4",
};
