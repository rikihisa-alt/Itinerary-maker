import { create } from "zustand";
import { TravelerInfo } from "@/types/itinerary";

interface TripCreationState {
  step: number;
  travelers: TravelerInfo;
  prefectureIds: string[];
  days: number;
  interests: string[];
  budget: "budget" | "moderate" | "luxury";
  pace: "relaxed" | "moderate" | "packed";

  setStep: (n: number) => void;
  setTravelers: (t: TravelerInfo) => void;
  togglePrefecture: (id: string) => void;
  setDays: (n: number) => void;
  toggleInterest: (tag: string) => void;
  setBudget: (b: "budget" | "moderate" | "luxury") => void;
  setPace: (p: "relaxed" | "moderate" | "packed") => void;
  reset: () => void;
}

export const useTripCreation = create<TripCreationState>((set) => ({
  step: 0,
  travelers: { type: "couple", count: 2 },
  prefectureIds: [],
  days: 2,
  interests: [],
  budget: "moderate",
  pace: "moderate",

  setStep: (step) => set({ step }),
  setTravelers: (travelers) => set({ travelers }),
  togglePrefecture: (id) => set((s) => ({
    prefectureIds: s.prefectureIds.includes(id)
      ? s.prefectureIds.filter((p) => p !== id)
      : [...s.prefectureIds, id],
  })),
  setDays: (days) => set({ days }),
  toggleInterest: (tag) => set((s) => ({
    interests: s.interests.includes(tag)
      ? s.interests.filter((t) => t !== tag)
      : [...s.interests, tag],
  })),
  setBudget: (budget) => set({ budget }),
  setPace: (pace) => set({ pace }),
  reset: () => set({
    step: 0, travelers: { type: "couple", count: 2 },
    prefectureIds: [], days: 2, interests: [], budget: "moderate", pace: "moderate",
  }),
}));
