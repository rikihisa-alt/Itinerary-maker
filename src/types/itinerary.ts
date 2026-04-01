export interface ItinerarySpot {
  destinationId?: string;
  name: string;
  time: string;
  duration?: string;
  note?: string;
  category?: "観光" | "食事" | "移動" | "宿泊" | "休憩" | "その他";
}

export interface ItineraryDay {
  date?: string;
  dayNumber: number;
  spots: ItinerarySpot[];
  memo?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description?: string;
  days: ItineraryDay[];
  travelers?: number;
  createdAt: string;
  updatedAt?: string;
  area?: string;
  tags?: string[];
}

export interface TravelDiagnosis {
  dateRange: {
    start: string;
    end: string;
  };
  travelers: number;
  relationship: "カップル" | "友達" | "家族" | "一人" | "夫婦" | "同僚";
  interests: string[];
  experienceType: "のんびり" | "アクティブ" | "バランス" | "グルメ中心" | "観光中心";
  budget?: string;
  area?: string;
}

export interface TravelProposal {
  main: {
    destination: string;
    story: string;
    itinerary: ItineraryDay[];
    highlights: string[];
  };
  alternatives: {
    destination: string;
    story: string;
    reason: string;
  }[];
  comparison: {
    label: string;
    main: string;
    alt1: string;
    alt2: string;
  }[];
  relatedArticleIds: string[];
}
