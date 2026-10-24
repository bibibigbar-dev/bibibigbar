export const EDITION_TIME_ZONE = "Asia/Seoul";
export const GATHER_HOUR = 5;
export const PUBLISH_HOURS = [6, 9, 12, 15, 18] as const;

export interface SeoulClock {
  dateKey: string;
  hour: number;
}

export interface EditionMark {
  dateKey: string;
  hour: number;
}

export function seoulClock(date = new Date()): SeoulClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EDITION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return {
    dateKey: `${read("year")}-${read("month")}-${read("day")}`,
    hour: Number(read("hour")),
  };
}

export function editionTag(dateKey: string, hour: number) {
  return `[edition ${dateKey} ${String(hour).padStart(2, "0")}]`;
}

export function readEdition(notes: string): EditionMark | null {
  const match = notes.match(/^\[edition (\d{4}-\d{2}-\d{2}) (\d{2})\]/);
  if (!match) return null;
  return { dateKey: match[1], hour: Number(match[2]) };
}

export function editionNotes(notes: string) {
  return notes.replace(/^\[edition \d{4}-\d{2}-\d{2} \d{2}\]\n?/, "").trim();
}

export function isPublishHour(hour: number) {
  return (PUBLISH_HOURS as readonly number[]).includes(hour);
}

export function seoulSlotIso(dateKey: string, hour: number) {
  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error("Invalid edition date.");
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), hour - 9, 0, 0)).toISOString();
}
