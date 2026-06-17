import {
  timeToMinutes,
  minutesToTime,
  generateAvailableSlots,
  filterSlotsByDurationAndBusy,
  SLOT_INTERVAL_MINUTES,
} from '../utils';
import type { ProviderAvailabilitySlot, ProviderBusySlot } from '@/modules/provider-profile/types/provider-profile.types';

function avail(startTime: string, endTime: string, dayOfWeek = 1): ProviderAvailabilitySlot {
  return { dayOfWeek, startTime, endTime };
}

function busy(localTime: string, estimatedHours: number, date = '2026-06-16'): ProviderBusySlot {
  // Build a local Date so getHours() returns the expected local hour
  const [h, m] = localTime.split(':').map(Number);
  const dt = new Date(date);
  dt.setHours(h, m, 0, 0);
  return { scheduledAt: dt.toISOString(), estimatedHours };
}

// ─── timeToMinutes ───────────────────────────────────────────────────────────

describe('timeToMinutes', () => {
  it('converts 00:00 to 0', () => expect(timeToMinutes('00:00')).toBe(0));
  it('converts 09:00 to 540', () => expect(timeToMinutes('09:00')).toBe(540));
  it('converts 18:30 to 1110', () => expect(timeToMinutes('18:30')).toBe(1110));
  it('converts 23:45 to 1425', () => expect(timeToMinutes('23:45')).toBe(1425));
  it('handles implicit 0 minutes (09:00)', () => expect(timeToMinutes('09:00')).toBe(9 * 60));
});

// ─── minutesToTime ────────────────────────────────────────────────────────────

describe('minutesToTime', () => {
  it('converts 0 to 00:00', () => expect(minutesToTime(0)).toBe('00:00'));
  it('converts 540 to 09:00', () => expect(minutesToTime(540)).toBe('09:00'));
  it('converts 555 to 09:15', () => expect(minutesToTime(555)).toBe('09:15'));
  it('converts 1425 to 23:45', () => expect(minutesToTime(1425)).toBe('23:45'));
});

// ─── generateAvailableSlots ───────────────────────────────────────────────────

describe('generateAvailableSlots', () => {
  it('returns empty array when availability exists but day has no slot', () => {
    expect(generateAvailableSlots(null, true)).toEqual([]);
  });

  it('returns all 96 slots (24h × 4) when no availability config exists', () => {
    const slots = generateAvailableSlots(null, false);
    expect(slots).toHaveLength((24 * 60) / SLOT_INTERVAL_MINUTES);
    expect(slots[0]).toBe('00:00');
    expect(slots[slots.length - 1]).toBe('23:45');
  });

  it('generates slots from 08:00 to 18:00 in 15-min steps', () => {
    const slots = generateAvailableSlots(avail('08:00', '18:00'), true);
    expect(slots[0]).toBe('08:00');
    expect(slots[slots.length - 1]).toBe('17:45');
    expect(slots).toHaveLength((10 * 60) / SLOT_INTERVAL_MINUTES); // 40 slots
  });

  it('excludes the end time itself (half-open interval)', () => {
    const slots = generateAvailableSlots(avail('09:00', '09:30'), true);
    expect(slots).toEqual(['09:00', '09:15']);
    expect(slots).not.toContain('09:30');
  });

  it('generates slots with non-zero start minutes', () => {
    const slots = generateAvailableSlots(avail('08:30', '09:00'), true);
    expect(slots).toEqual(['08:30', '08:45']);
  });
});

// ─── filterSlotsByDurationAndBusy ─────────────────────────────────────────────

describe('filterSlotsByDurationAndBusy', () => {
  const slots = ['08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00'];
  const endTime = '18:00';

  describe('duration fitting', () => {
    it('removes slots where start + duration exceeds availability end', () => {
      const result = filterSlotsByDurationAndBusy(
        ['17:45', '18:00'],
        60,
        '18:00',
        [],
      );
      expect(result).toEqual([]);
    });

    it('keeps slot exactly when start + duration equals availability end', () => {
      // 17:00 + 60 min = 18:00 — fits exactly
      const result = filterSlotsByDurationAndBusy(['17:00', '17:15'], 60, '18:00', []);
      expect(result).toEqual(['17:00']);
    });

    it('keeps all slots when duration is very short (15 min)', () => {
      const result = filterSlotsByDurationAndBusy(slots, 15, endTime, []);
      expect(result).toEqual(slots);
    });

    it('filters later slots when duration is 90 min and end is 10:00', () => {
      // 09:00 + 90 = 10:30 > 10:00 → 09:00 out; 08:30 + 90 = 10:00 → in
      const result = filterSlotsByDurationAndBusy(
        ['08:00', '08:15', '08:30', '08:45', '09:00'],
        90,
        '10:00',
        [],
      );
      expect(result).toEqual(['08:00', '08:15', '08:30']);
    });
  });

  describe('busy slot conflict', () => {
    it('removes slot that starts exactly at busy slot start', () => {
      const result = filterSlotsByDurationAndBusy(
        ['09:00', '09:15', '09:30'],
        60,
        endTime,
        [busy('09:00', 1)],
      );
      // 09:00–10:00 busy; 09:00 conflicts, 09:15 conflicts (09:15+60=10:15 overlaps 09:00-10:00), 09:30 conflicts
      expect(result).toEqual([]);
    });

    it('keeps slot that ends exactly when busy slot begins', () => {
      // slot 08:00 + 60 min ends at 09:00; busy starts at 09:00 → no overlap
      const result = filterSlotsByDurationAndBusy(
        ['08:00', '08:15'],
        60,
        endTime,
        [busy('09:00', 1)],
      );
      expect(result).toEqual(['08:00']);
    });

    it('keeps slot that starts exactly when busy slot ends', () => {
      // busy 09:00–10:00; slot 10:00 starts exactly at busy end → no overlap
      const result = filterSlotsByDurationAndBusy(
        ['09:45', '10:00', '10:15'],
        60,
        endTime,
        [busy('09:00', 1)],
      );
      expect(result).toEqual(['10:00', '10:15']);
    });

    it('removes slots overlapping a busy slot in the middle of the window', () => {
      // busy 10:00–11:00 (1h); slots that overlap: 09:15+60=10:15 overlaps, 10:00+60=11:00 exact end
      const result = filterSlotsByDurationAndBusy(
        ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '11:00'],
        60,
        endTime,
        [busy('10:00', 1)],
      );
      // 09:00+60=10:00 → ends exactly at busy start → ok
      // 09:15+60=10:15 → overlaps 10:00–11:00 → out
      // 09:30+60=10:30 → overlaps → out
      // 09:45+60=10:45 → overlaps → out
      // 10:00+60=11:00 → starts inside busy 10:00–11:00 → out
      // 10:15+60=11:15 → starts inside busy → out
      // 11:00+60=12:00 → starts at busy end → ok
      expect(result).toEqual(['09:00', '11:00']);
    });

    it('handles multiple busy slots', () => {
      const result = filterSlotsByDurationAndBusy(
        ['08:00', '09:00', '10:00', '11:00', '12:00'],
        60,
        endTime,
        [busy('09:00', 1), busy('11:00', 1)],
      );
      // 08:00+60=09:00 → ok (ends exactly at first busy start)
      // 09:00 → inside first busy → out
      // 10:00+60=11:00 → ok (ends at second busy start)
      // 11:00 → inside second busy → out
      // 12:00+60=13:00 → ok
      expect(result).toEqual(['08:00', '10:00', '12:00']);
    });

    it('handles busy slot with fractional hours', () => {
      // busy 09:00 + 1.5h = 10:30
      const result = filterSlotsByDurationAndBusy(
        ['08:45', '09:00', '09:15', '10:00', '10:30', '10:45'],
        60,
        endTime,
        [busy('09:00', 1.5)],
      );
      // 08:45+60=09:45 → overlaps 09:00–10:30 → out
      // 09:00 → inside busy → out
      // 09:15 → inside busy → out
      // 10:00+60=11:00 → starts inside 09:00–10:30 → out
      // 10:30+60=11:30 → starts exactly at busy end → ok
      // 10:45 → ok
      expect(result).toEqual(['10:30', '10:45']);
    });

    it('returns empty when no slots fit due to combined duration + busy constraint', () => {
      const result = filterSlotsByDurationAndBusy(
        ['08:00', '08:15'],
        120,
        '09:00',
        [busy('08:30', 1)],
      );
      // 08:00+120=10:00 > 09:00 → all out due to duration
      expect(result).toEqual([]);
    });
  });

  describe('no available slots edge cases', () => {
    it('returns empty for empty slot list', () => {
      expect(filterSlotsByDurationAndBusy([], 60, endTime, [])).toEqual([]);
    });

    it('returns all when no busy slots and all fit duration', () => {
      const result = filterSlotsByDurationAndBusy(['09:00', '09:15'], 15, '10:00', []);
      expect(result).toEqual(['09:00', '09:15']);
    });
  });
});
