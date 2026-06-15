import {
  dayHasRoom,
  nextAvailableEnd,
  nextAvailableStart,
  toHHmm,
  toMinutes,
} from './utils';
import type { ProviderAvailabilityDto } from '@/modules/auth/services/types';

function slot(start: string, end: string): ProviderAvailabilityDto {
  return { id: start, dayOfWeek: 1, startTime: start, endTime: end, isActive: true };
}

describe('toMinutes', () => {
  it('converts 00:00 to 0', () => expect(toMinutes('00:00')).toBe(0));
  it('converts 01:15 to 75', () => expect(toMinutes('01:15')).toBe(75));
  it('converts 23:45 to 1425', () => expect(toMinutes('23:45')).toBe(1425));
});

describe('toHHmm', () => {
  it('converts 0 to 00:00', () => expect(toHHmm(0)).toBe('00:00'));
  it('converts 75 to 01:15', () => expect(toHHmm(75)).toBe('01:15'));
  it('converts 1425 to 23:45', () => expect(toHHmm(1425)).toBe('23:45'));
});

describe('dayHasRoom', () => {
  it('returns true for empty day', () => {
    expect(dayHasRoom([])).toBe(true);
  });

  it('returns false when single slot covers full day (00:00–23:45)', () => {
    expect(dayHasRoom([slot('00:00', '23:45')])).toBe(false);
  });

  it('returns false when combined contiguous slots cover full day', () => {
    expect(dayHasRoom([slot('00:00', '12:00'), slot('12:00', '23:45')])).toBe(false);
  });

  it('returns true when there is a gap of exactly 15 min between slots', () => {
    // gap: 09:00–09:15 = 15 min — minimum for a slot
    expect(dayHasRoom([slot('00:00', '09:00'), slot('09:15', '23:45')])).toBe(true);
  });

  it('returns false when slots share boundary (zero gap)', () => {
    expect(dayHasRoom([slot('00:00', '09:00'), slot('09:00', '23:45')])).toBe(false);
  });

  it('returns true for a single partial slot with space before and after', () => {
    expect(dayHasRoom([slot('09:00', '17:00')])).toBe(true);
  });

  it('returns true when coverage ends at 23:30 (exactly one slot of 15 min fits)', () => {
    // 23:30 + 15 = 23:45 (valid end) → still has room
    expect(dayHasRoom([slot('00:00', '23:30')])).toBe(true);
  });

  it('returns false when coverage ends at 23:45 leaving no room for another slot', () => {
    // 23:45 + 15 = 24:00 — beyond picker range → no room
    expect(dayHasRoom([slot('00:00', '23:45')])).toBe(false);
  });

  it('handles unsorted slots correctly when no gap exists', () => {
    // Slots share boundary at 12:00 — no gap, even though unsorted
    expect(dayHasRoom([slot('12:00', '23:45'), slot('00:00', '12:00')])).toBe(false);
  });
});

describe('nextAvailableStart', () => {
  it('returns 09:00 for empty day', () => {
    expect(nextAvailableStart([])).toBe('09:00');
  });

  it('returns time immediately after the last slot', () => {
    expect(nextAvailableStart([slot('09:00', '12:00')])).toBe('12:00');
  });

  it('prefers gap after last slot even when a gap exists earlier in the day', () => {
    // Slot at 12:00–18:00: gap 00:00–12:00 exists, but after-last (18:00) is preferred
    expect(nextAvailableStart([slot('12:00', '18:00')])).toBe('18:00');
  });

  it('returns next 15-min boundary immediately after last slot', () => {
    expect(nextAvailableStart([slot('09:00', '09:30')])).toBe('09:30');
  });

  it('falls back to gap before end when last slot ends at day limit', () => {
    // Last slot ends at 23:45, no room after → first usable gap starts at 09:00 (between slots)
    expect(nextAvailableStart([slot('00:00', '09:00'), slot('10:00', '23:45')])).toBe('09:00');
  });

  it('finds gap after last slot even with multiple existing slots', () => {
    expect(nextAvailableStart([slot('00:00', '09:00'), slot('09:15', '11:00')])).toBe('11:00');
  });

  it('returns 09:00 fallback when all gaps are exhausted (only 15 min gap exists at end)', () => {
    // After-last: 23:45 has no room; first usable gap: 09:00 (before slot 2)
    expect(nextAvailableStart([slot('00:00', '09:00'), slot('09:15', '23:45')])).toBe('09:00');
  });
});

describe('nextAvailableEnd', () => {
  it('returns start + 60 min (1h default) when no other slots', () => {
    expect(nextAvailableEnd([], '09:00')).toBe('10:00');
  });

  it('respects 1h default when next slot is far away', () => {
    expect(nextAvailableEnd([slot('12:00', '18:00')], '09:00')).toBe('10:00');
  });

  it('clamps end before next slot when next slot is within 1h window', () => {
    // start 09:00, next slot at 09:45 → max end = 09:45 - 15 = 09:30
    expect(nextAvailableEnd([slot('09:45', '12:00')], '09:00')).toBe('09:30');
  });

  it('returns start + 15 min minimum when next slot is very close', () => {
    // start 09:00, next slot at 09:30 → max end = 09:30 - 15 = 09:15
    expect(nextAvailableEnd([slot('09:30', '12:00')], '09:00')).toBe('09:15');
  });

  it('caps end at 23:45 when default would exceed picker range', () => {
    expect(nextAvailableEnd([], '23:30')).toBe('23:45');
  });

  it('caps end at 23:45 even if start + 1h would exceed it', () => {
    expect(nextAvailableEnd([], '23:00')).toBe('23:45');
  });
});
