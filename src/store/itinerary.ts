import { create } from "zustand";

export interface ItinSpot {
  spotId?: string;
  name: string;
  time: string;
  note?: string;
}

export interface ItinDay {
  dayNumber: number;
  spots: ItinSpot[];
  memo: string;
}

interface ItinState {
  title: string;
  days: ItinDay[];
  setTitle: (t: string) => void;
  addDay: () => void;
  removeDay: (di: number) => void;
  addSpot: (di: number, spot: ItinSpot) => void;
  removeSpot: (di: number, si: number) => void;
  moveSpot: (di: number, from: number, to: number) => void;
  setMemo: (di: number, memo: string) => void;
  initFrom: (title: string, spot: ItinSpot) => void;
}

export const useItinerary = create<ItinState>((set) => ({
  title: "新しい旅のしおり",
  days: [{ dayNumber: 1, spots: [], memo: "" }],

  setTitle: (title) => set({ title }),

  addDay: () =>
    set((s) => ({
      days: [...s.days, { dayNumber: s.days.length + 1, spots: [], memo: "" }],
    })),

  removeDay: (di) =>
    set((s) => ({
      days: s.days
        .filter((_, i) => i !== di)
        .map((d, i) => ({ ...d, dayNumber: i + 1 })),
    })),

  addSpot: (di, spot) =>
    set((s) => ({
      days: s.days.map((d, i) =>
        i === di
          ? { ...d, spots: [...d.spots, spot].sort((a, b) => a.time.localeCompare(b.time)) }
          : d
      ),
    })),

  removeSpot: (di, si) =>
    set((s) => ({
      days: s.days.map((d, i) =>
        i === di ? { ...d, spots: d.spots.filter((_, j) => j !== si) } : d
      ),
    })),

  moveSpot: (di, from, to) =>
    set((s) => ({
      days: s.days.map((d, i) => {
        if (i !== di) return d;
        const arr = [...d.spots];
        const [item] = arr.splice(from, 1);
        arr.splice(to, 0, item);
        return { ...d, spots: arr };
      }),
    })),

  setMemo: (di, memo) =>
    set((s) => ({
      days: s.days.map((d, i) => (i === di ? { ...d, memo } : d)),
    })),

  initFrom: (title, spot) =>
    set({
      title,
      days: [{ dayNumber: 1, spots: [spot], memo: "" }],
    }),
}));
