import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ItinSpot, ItinDay, PackingItem, TravelerInfo, ItineraryTheme } from "@/types/itinerary";

function uid() { return Math.random().toString(36).slice(2, 10); }

interface ItinState {
  title: string;
  subtitle: string;
  theme: ItineraryTheme;
  travelers: TravelerInfo;
  dateRange: { start: string; end: string } | null;
  prefectureIds: string[];
  days: ItinDay[];
  packingList: PackingItem[];

  setTitle: (t: string) => void;
  setSubtitle: (t: string) => void;
  setTheme: (t: ItineraryTheme) => void;
  setTravelers: (t: TravelerInfo) => void;
  setDateRange: (s: string, e: string) => void;
  addDay: () => void;
  removeDay: (di: number) => void;
  addSpot: (di: number, spot: Omit<ItinSpot, "id">) => void;
  removeSpot: (di: number, si: number) => void;
  moveSpot: (di: number, from: number, to: number) => void;
  updateSpot: (di: number, si: number, data: Partial<ItinSpot>) => void;
  setMemo: (di: number, memo: string) => void;
  addPackingItem: (name: string, category: PackingItem["category"]) => void;
  togglePackingItem: (id: string) => void;
  removePackingItem: (id: string) => void;
  initFrom: (title: string, spot: Omit<ItinSpot, "id">) => void;
  reset: () => void;
}

const INITIAL: Pick<ItinState, "title" | "subtitle" | "theme" | "travelers" | "dateRange" | "prefectureIds" | "days" | "packingList"> = {
  title: "新しい旅のしおり",
  subtitle: "",
  theme: "default",
  travelers: { type: "couple", count: 2 },
  dateRange: null,
  prefectureIds: [],
  days: [{ dayNumber: 1, spots: [], memo: "" }],
  packingList: [],
};

export const useItinerary = create<ItinState>()(
  persist(
    (set) => ({
      ...INITIAL,

      setTitle: (title) => set({ title }),
      setSubtitle: (subtitle) => set({ subtitle }),
      setTheme: (theme) => set({ theme }),
      setTravelers: (travelers) => set({ travelers }),
      setDateRange: (start, end) => set({ dateRange: { start, end } }),

      addDay: () => set((s) => ({ days: [...s.days, { dayNumber: s.days.length + 1, spots: [], memo: "" }] })),
      removeDay: (di) => set((s) => ({ days: s.days.filter((_, i) => i !== di).map((d, i) => ({ ...d, dayNumber: i + 1 })) })),

      addSpot: (di, spot) => set((s) => ({
        days: s.days.map((d, i) => i === di
          ? { ...d, spots: [...d.spots, { ...spot, id: uid() }].sort((a, b) => a.time.localeCompare(b.time)) }
          : d),
      })),
      removeSpot: (di, si) => set((s) => ({
        days: s.days.map((d, i) => i === di ? { ...d, spots: d.spots.filter((_, j) => j !== si) } : d),
      })),
      moveSpot: (di, from, to) => set((s) => ({
        days: s.days.map((d, i) => {
          if (i !== di) return d;
          const arr = [...d.spots];
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return { ...d, spots: arr };
        }),
      })),
      updateSpot: (di, si, data) => set((s) => ({
        days: s.days.map((d, i) => i === di
          ? { ...d, spots: d.spots.map((sp, j) => j === si ? { ...sp, ...data } : sp) }
          : d),
      })),
      setMemo: (di, memo) => set((s) => ({
        days: s.days.map((d, i) => i === di ? { ...d, memo } : d),
      })),

      addPackingItem: (name, category) => set((s) => ({
        packingList: [...s.packingList, { id: uid(), name, checked: false, category }],
      })),
      togglePackingItem: (id) => set((s) => ({
        packingList: s.packingList.map((p) => p.id === id ? { ...p, checked: !p.checked } : p),
      })),
      removePackingItem: (id) => set((s) => ({
        packingList: s.packingList.filter((p) => p.id !== id),
      })),

      initFrom: (title, spot) => set({
        ...INITIAL,
        title,
        days: [{ dayNumber: 1, spots: [{ ...spot, id: uid() }], memo: "" }],
      }),

      reset: () => set(INITIAL),
    }),
    { name: "itinerary-craft-store" }
  )
);
