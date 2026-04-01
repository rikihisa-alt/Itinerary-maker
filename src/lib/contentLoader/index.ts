import { spots } from "@/content/destinations";
import { Spot } from "@/types/destination";

export function getAllSpots(): Spot[] {
  return spots;
}

export function getSpotById(id: string): Spot | undefined {
  return spots.find((s) => s.id === id);
}

export function getSpotsByArea(area: string): Spot[] {
  return spots.filter((s) => s.area === area);
}

export function searchSpots(q: string): Spot[] {
  const lower = q.toLowerCase();
  return spots.filter(
    (s) =>
      s.title.includes(q) ||
      s.description.includes(q) ||
      s.location.includes(q) ||
      s.tags.some((t) => t.includes(lower)) ||
      s.area.includes(q)
  );
}

export function getNearbySpots(id: string): Spot[] {
  const spot = getSpotById(id);
  if (!spot) return [];
  return spot.nearby
    .map((nid) => getSpotById(nid))
    .filter((s): s is Spot => s !== undefined);
}

export function getAreas(): string[] {
  return [...new Set(spots.map((s) => s.area))];
}
