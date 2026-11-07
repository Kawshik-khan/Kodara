/**
 * Kodara - Time-ordered ids (UUIDv7, RFC 9562)
 *
 * Every learning fact (assessment event, attempt, review item) gets a UUIDv7
 * created on the device at the moment of the action. The 48-bit millisecond
 * timestamp inside the id is the event time, so the future server can dedupe
 * retries and offline replays by id alone (DATABASE-DESIGN §2.3).
 *
 * Ids from one tab are strictly increasing, even within the same millisecond
 * (RFC 9562 §6.2 method 1: a 12-bit counter in rand_a).
 */

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const MAX_TIMESTAMP_MS = 2 ** 48 - 1;

let lastMs = -1;
let sequence = 0;

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

/** Creates a UUIDv7. `nowMs` is injectable for tests; ids stay monotonic if the clock steps back. */
export function uuidv7(nowMs: number = Date.now()): string {
  let ms = Math.floor(nowMs);
  if (ms < 0 || ms > MAX_TIMESTAMP_MS) {
    throw new RangeError(`uuidv7: timestamp out of range: ${nowMs}`);
  }

  if (ms > lastMs) {
    lastMs = ms;
    // Start low in the 12-bit space so many ids fit in one millisecond.
    sequence = randomBytes(1)[0] & 0x3ff;
  } else {
    // Same millisecond, or the clock moved back: keep ordering.
    ms = lastMs;
    sequence++;
    if (sequence > 0xfff) {
      lastMs = ++ms;
      sequence = 0;
    }
  }

  const rand = randomBytes(8);
  const hex = (value: number, digits: number) => value.toString(16).padStart(digits, '0');

  const timeHex = hex(ms, 12);
  const randA = hex(0x7000 | sequence, 4);                              // version 7 + counter
  const randB = hex(0x8000 | ((rand[0] << 8) | rand[1]) & 0x3fff, 4);   // variant 10xx
  const tail = Array.from(rand.slice(2), (b) => hex(b, 2)).join('');

  return `${timeHex.slice(0, 8)}-${timeHex.slice(8)}-${randA}-${randB}-${tail}`;
}

export function isUuidV7(id: string): boolean {
  return UUID_V7_PATTERN.test(id);
}

/** Milliseconds since epoch embedded in a UUIDv7. */
export function uuidv7TimestampMs(id: string): number {
  if (!isUuidV7(id)) {
    throw new TypeError(`Not a UUIDv7: ${id}`);
  }
  return parseInt(id.slice(0, 8) + id.slice(9, 13), 16);
}

/**
 * Id and ISO timestamp for a new learning fact, taken from one clock reading
 * so `timestamp` always equals the time inside `id`.
 */
export function newEventIdentity(nowMs: number = Date.now()): { id: string; timestamp: string } {
  const id = uuidv7(nowMs);
  return { id, timestamp: new Date(uuidv7TimestampMs(id)).toISOString() };
}
