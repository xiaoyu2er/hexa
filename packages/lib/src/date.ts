export function formatDate(date: Date | string | number) {
  const dateObj = new Date(date);

  // Get relative time for recent dates
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays < 1) {
    // For today, show relative time
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      0,
      'day'
    );
  }

  if (diffInDays < 30) {
    // For recent dates within a month, show "X days ago"
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      -diffInDays,
      'day'
    );
  }

  // For older dates, show formatted date
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}
