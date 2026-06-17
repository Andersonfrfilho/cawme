import type { ProviderAvailabilitySlot, ProviderBusySlot } from '@/modules/provider-profile/types/provider-profile.types';

export const SLOT_INTERVAL_MINUTES = 15;

export function timeToMinutes(time: string): number {
  const [h, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateAvailableSlots(
  availability: ProviderAvailabilitySlot | null,
  hasAvailabilityConfig: boolean,
): string[] {
  if (!availability) {
    if (hasAvailabilityConfig) return [];
    const all: string[] = [];
    for (let m = 0; m < 24 * 60; m += SLOT_INTERVAL_MINUTES) {
      all.push(minutesToTime(m));
    }
    return all;
  }
  const start = timeToMinutes(availability.startTime);
  const end = timeToMinutes(availability.endTime);
  const slots: string[] = [];
  for (let m = start; m < end; m += SLOT_INTERVAL_MINUTES) {
    slots.push(minutesToTime(m));
  }
  return slots;
}

export function filterSlotsByDurationAndBusy(
  slots: string[],
  totalDurationMinutes: number,
  availabilityEndTime: string,
  busySlots: ProviderBusySlot[],
): string[] {
  const availEnd = timeToMinutes(availabilityEndTime);
  return slots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + totalDurationMinutes;
    if (slotEnd > availEnd) return false;
    return !busySlots.some((busy) => {
      const busyDate = new Date(busy.scheduledAt);
      const busyStart = busyDate.getHours() * 60 + busyDate.getMinutes();
      const busyEnd = busyStart + busy.estimatedHours * 60;
      return slotStart < busyEnd && slotEnd > busyStart;
    });
  });
}
