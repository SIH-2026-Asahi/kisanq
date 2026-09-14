export type Lang = "en" | "hi" | "mr" | "ta" | "te" | "gu" | "pa";

export type TokenStatus = "scheduled" | "weighed" | "approved" | "paid";

export const STATUS_ORDER: TokenStatus[] = ["scheduled", "weighed", "approved", "paid"];

export type Capacity = "high" | "moderate" | "congested";

export interface Mandi {
  id: string;
  name: Record<Lang, string>;
  district: Record<Lang, string>;
  distanceKm: number;
  dailyCapacity: number;
  state: string;
  city: string;
}

export interface Slot {
  id: string;
  date: string; // ISO date
  time: string; // "09:00 - 10:00"
  booked: number;
  capacity: number;
}

export interface Token {
  id: string;
  code: string;
  farmerName: string;
  phone: string;
  mandiId: string;
  date: string;
  time: string;
  crop: string;
  quintals: number;
  status: TokenStatus;
  createdAt: number;
  checkedInAt?: number;
  channel: "app" | "whatsapp";
}

export function capacityOf(slot: Slot): Capacity {
  const ratio = slot.booked / slot.capacity;
  if (ratio < 0.5) return "high";
  if (ratio < 0.85) return "moderate";
  return "congested";
}

/** A logged QR scan event, visible to the Center Admin. */
export interface ScanRecord {
  id: string;
  tokenId: string;
  code: string;
  farmerName: string;
  mandiId: string;
  scannedAt: number;
  statusAfter: TokenStatus;
}

export interface PoolMember {
  name: string;
  phone: string;
  crop?: string;
  quintals?: number;
}

export interface Pool {
  id: string;
  mandiId: string;
  date: string;
  ownerName: string;
  pickupArea: string;
  pickupTime: string;
  seats: number;
  tripCost: number;
  members: PoolMember[];
}

export function shareOf(pool: Pool): number {
  return Math.round(pool.tripCost / Math.max(1, pool.members.length));
}
