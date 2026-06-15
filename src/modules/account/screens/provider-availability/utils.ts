import type { ProviderAvailabilityDto } from '@/modules/auth/services/types';

export type SlotGroup = {
  ids: string[];
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  additionalPercentage: number;
  isActive: boolean;
};

export function mergeAdjacentSlots(slots: ProviderAvailabilityDto[]): SlotGroup[] {
  const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const result: SlotGroup[] = [];

  for (const slot of sorted) {
    const last = result.at(-1);
    if (
      last?.endTime === slot.startTime &&
      last?.additionalPercentage === slot.additionalPercentage
    ) {
      last.endTime = slot.endTime;
      last.ids.push(slot.id);
    } else {
      result.push({
        ids: [slot.id],
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        additionalPercentage: slot.additionalPercentage,
        isActive: slot.isActive,
      });
    }
  }

  return result;
}

export const MIN_SLOT_MINUTES = 15;
export const MAX_END_MINUTES = 24 * 60 - MIN_SLOT_MINUTES; // 23:45 = 1425

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

export function toHHmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function dayHasRoom(daySlots: ProviderAvailabilityDto[]): boolean {
  if (daySlots.length === 0) return true;
  const ranges = daySlots
    .map((slot) => ({ start: toMinutes(slot.startTime), end: toMinutes(slot.endTime) }))
    .sort((a, b) => a.start - b.start);
  let covered = 0;
  for (const range of ranges) {
    if (range.start >= covered + MIN_SLOT_MINUTES) return true;
    covered = Math.max(covered, range.end);
  }
  // Room exists only if a new slot (start + 15 min) fits within the max end time 23:45
  return covered + MIN_SLOT_MINUTES <= MAX_END_MINUTES;
}

export function nextAvailableStart(daySlots: ProviderAvailabilityDto[]): string {
  if (daySlots.length === 0) return '09:00';

  const ranges = daySlots
    .map((slot) => ({ start: toMinutes(slot.startTime), end: toMinutes(slot.endTime) }))
    .sort((a, b) => a.start - b.start);

  // Prefer the gap immediately after the last slot
  const lastEnd = ranges.at(-1)?.end ?? 0;
  const afterLast = Math.ceil(lastEnd / MIN_SLOT_MINUTES) * MIN_SLOT_MINUTES;
  if (afterLast + MIN_SLOT_MINUTES <= MAX_END_MINUTES) {
    return toHHmm(afterLast);
  }

  // Day end reached — fall back to first usable gap before existing slots
  let cursor = 0;
  for (const range of ranges) {
    const gapStart = Math.ceil(cursor / MIN_SLOT_MINUTES) * MIN_SLOT_MINUTES;
    if (gapStart + MIN_SLOT_MINUTES <= range.start) {
      return toHHmm(gapStart);
    }
    cursor = Math.max(cursor, range.end);
  }

  return '09:00';
}

export function nextAvailableEnd(
  daySlots: ProviderAvailabilityDto[],
  startTime: string,
): string {
  const startMin = toMinutes(startTime);
  const defaultEnd = startMin + 60;

  const ranges = daySlots
    .map((slot) => ({ start: toMinutes(slot.startTime), end: toMinutes(slot.endTime) }))
    .sort((a, b) => a.start - b.start);

  const nextSlotStart = ranges.find((r) => r.start > startMin)?.start;

  const gapEnd = nextSlotStart === undefined ? MAX_END_MINUTES : nextSlotStart - MIN_SLOT_MINUTES;
  const endMin = Math.min(defaultEnd, gapEnd);
  const snapped = Math.floor(endMin / MIN_SLOT_MINUTES) * MIN_SLOT_MINUTES;

  return toHHmm(Math.max(startMin + MIN_SLOT_MINUTES, snapped));
}
