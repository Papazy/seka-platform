/**
 * Converts a date to a relative time string in Indonesian language.
 * Returns a human-readable string representing how long ago the date was.
 *
 * @param date - The date to convert, either as a Date object or a string that can be parsed into a Date
 * @returns A string representing the relative time in Indonesian:
 * - "Baru saja" if less than 30 seconds ago
 * - "[n] detik yang lalu" if less than 60 seconds ago
 * - "[n] menit yang lalu" if less than 60 minutes ago
 * - "[n] jam yang lalu" if less than 24 hours ago
 * - "[n] hari yang lalu" if less than 7 days ago
 * - Formatted date string (e.g., "15 Jan 2024, 10:30") if 7 days or more
 *
 * @example
 * ```typescript
 * getRelativeTime(new Date(Date.now() - 5000)); // "5 detik yang lalu"
 * getRelativeTime(new Date(Date.now() - 3600000)); // "1 jam yang lalu"
 * getRelativeTime("2024-01-01"); // "15 Jan 2024, 00:00"
 * ```
 */
export const getRelativeTime = (date: Date | string) => {
  const now = new Date();
  const submitDate = new Date(date);

  const diffMs = now.getTime() - submitDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 30) return "Baru saja";
  if (diffSeconds < 60) return `${diffSeconds} detik yang lalu`;
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  // Jika lebih dari 7 hari, tampilkan tanggal
  return submitDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRelativeDeadline = (date: Date | string) => {
  const now = new Date();
  const deadlineDate = new Date(date);

  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMs < 0) return "Deadline telah lewat";
  if (diffSeconds < 60) return `${diffSeconds} detik lagi`;
  if (diffMinutes < 60) return `${diffMinutes} menit lagi`;
  if (diffHours < 24) return `${diffHours} jam lagi`;
  if (diffDays < 14) return `${diffDays} hari lagi`;

  // Jika lebih dari 7 hari, tampilkan tanggal
  return deadlineDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default getRelativeDeadline;
