const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const format = (formatter, isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? "—" : formatter.format(date);
};

/** "2026-11-18T10:00:00.000Z" → "18 Nov 2026" */
export const formatDate = (isoString) => format(dateFormatter, isoString);

/** "2026-11-18T10:00:00.000Z" → "18 Nov 2026, 3:30 pm" */
export const formatDateTime = (isoString) => format(dateTimeFormatter, isoString);