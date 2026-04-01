export type CrowdLevel = "low" | "medium" | "high";

export interface Spot {
  id: string;
  title: string;
  location: string;
  prefecture: string;
  area: string;
  images: string[];
  description: string;
  longDescription: string;
  tags: string[];
  stayDuration: number; // minutes
  bestTime: string;
  crowdLevel: CrowdLevel;
  budget: string;
  access: string;
  rainyDay: boolean;
  highlights: string[];
  features: { label: string; text: string }[];
  nearby: string[]; // other spot ids
}
