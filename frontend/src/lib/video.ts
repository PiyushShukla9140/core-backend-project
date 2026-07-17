/**
 * Converts views into YouTube-style format.
 * Example:
 * 1200 -> 1.2K
 * 1500000 -> 1.5M
 */
export const formatViews = (views: number): string => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(views);
};

/**
 * Converts duration (seconds) into HH:MM:SS or MM:SS
 * Example:
 * 65 -> 1:05
 * 3725 -> 1:02:05
 */
export const formatDuration = (
  duration: number
): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(
    (duration % 3600) / 60
  );
  const seconds = Math.floor(duration % 60);

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Converts createdAt into
 * "2 days ago", "3 months ago", etc.
 */
export const formatTimeAgo = (
  date: string
): string => {
  const now = new Date();
  const created = new Date(date);

  const seconds = Math.floor(
    (now.getTime() - created.getTime()) / 1000
  );

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(
      seconds / interval.seconds
    );

    if (count >= 1) {
      return `${count} ${interval.label}${
        count > 1 ? "s" : ""
      } ago`;
    }
  }

  return "Just now";
};