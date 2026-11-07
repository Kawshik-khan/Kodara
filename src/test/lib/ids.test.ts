import { describe, it, expect } from 'vitest';
import { isUuidV7, newEventIdentity, uuidv7, uuidv7TimestampMs } from '@/lib/ids';

describe('uuidv7', () => {
  it('produces RFC 9562 version 7, variant 10 ids', () => {
    for (let i = 0; i < 200; i++) {
      const id = uuidv7();
      expect(isUuidV7(id)).toBe(true);
      expect(id[14]).toBe('7');
      expect(['8', '9', 'a', 'b']).toContain(id[19]);
    }
  });

  it('embeds the given millisecond timestamp', () => {
    const ms = Date.UTC(2027, 0, 15, 8, 30, 12, 345);
    expect(uuidv7TimestampMs(uuidv7(ms + 60_000))).toBe(ms + 60_000);
  });

  it('is strictly increasing within one millisecond', () => {
    const ms = Date.UTC(2030, 5, 1);
    const ids = Array.from({ length: 5000 }, () => uuidv7(ms));
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('stays increasing when the clock steps backwards', () => {
    const ms = Date.UTC(2031, 0, 1);
    const a = uuidv7(ms);
    const b = uuidv7(ms - 5_000);
    expect(b > a).toBe(true);
  });

  it('rejects timestamps outside 48 bits', () => {
    expect(() => uuidv7(-1)).toThrow(RangeError);
    expect(() => uuidv7(2 ** 48)).toThrow(RangeError);
  });

  it('rejects non-v7 ids when reading the timestamp', () => {
    expect(isUuidV7('ev_123_concept_abc')).toBe(false);
    expect(isUuidV7('0b5f7a2e-1c3d-4e5f-8a9b-0c1d2e3f4a5b')).toBe(false); // v4
    expect(() => uuidv7TimestampMs('evt_123')).toThrow(TypeError);
  });
});

describe('newEventIdentity', () => {
  it('returns a timestamp equal to the time inside the id', () => {
    for (let i = 0; i < 50; i++) {
      const { id, timestamp } = newEventIdentity();
      expect(new Date(timestamp).getTime()).toBe(uuidv7TimestampMs(id));
    }
  });
});
