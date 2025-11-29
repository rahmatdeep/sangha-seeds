/**
 * Converts user-friendly date strings (YYYY-MM-DD) to ISO datetime strings
 * accounting for local timezone (IST).
 *
 * When user selects "2024-11-29", they mean:
 * - createdFrom: Start of Nov 29 in IST → converted to UTC
 * - createdTo: End of Nov 29 in IST → converted to UTC
 */
export function toISODateRange(from?: string, to?: string) {
  let createdFrom: string | undefined;
  let createdTo: string | undefined;

  if (from) {
    // Create date in local timezone (IST), then convert to UTC ISO string
    const localDate = new Date(from + "T00:00:00");
    createdFrom = localDate.toISOString();
  }

  if (to) {
    // Create date in local timezone (IST) at end of day, then convert to UTC
    const localDate = new Date(to + "T23:59:59.999");
    createdTo = localDate.toISOString();
  }

  return { createdFrom, createdTo };
}

/**
 * Formats ISO date string to display format
 * @param isoDate - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export function formatDisplayDate(isoDate: string | Date): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Converts date to YYYY-MM-DD format for Calendar component
 * @param date - Date object or ISO string
 * @returns Date string in YYYY-MM-DD format
 */
export function toDateInputFormat(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets start of today in ISO format
 */
export function getTodayStart(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

/**
 * Gets current time in ISO format
 */
export function getNow(): string {
  return new Date().toISOString();
}
