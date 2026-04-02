import { notFound } from "next/navigation";
import { getAllSpots, getSpotById, getNearbySpots } from "@/lib/contentLoader";
import { DetailClient } from "./client";

export function generateStaticParams() {
  return getAllSpots().map((s) => ({ id: s.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSpotById(id);
  if (!s) notFound();
  const nearby = getNearbySpots(id);
  return <DetailClient spot={s} nearby={nearby} />;
}
