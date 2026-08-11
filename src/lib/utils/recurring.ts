const DAY_NAMES: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Get the next occurrence of a recurring weekday from today.
 * If the series start date is in the future, returns that date instead.
 */
export function getNextOccurrence(
  recurringDay: string,
  referenceDate: string
): Date {
  const targetDay = DAY_NAMES[recurringDay.toLowerCase()];
  if (targetDay === undefined) {
    return new Date(referenceDate + 'T00:00:00');
  }

  const refDate = new Date(referenceDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If series hasn't started yet, return the reference date
  if (refDate > today) {
    return refDate;
  }

  // Find next occurrence of the target day from today
  const currentDay = today.getDay();
  let daysUntil = targetDay - currentDay;
  if (daysUntil < 0) daysUntil += 7;
  // If today is the recurring day, daysUntil = 0 (show today)

  const next = new Date(today);
  next.setDate(next.getDate() + daysUntil);
  return next;
}

/**
 * Format "sunday" → "Every Sunday"
 */
export function formatRecurringDay(day: string): string {
  const capitalized = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  return `Every ${capitalized}`;
}
