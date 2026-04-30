/**
 * Icon Mapping Utility
 * Maps backend keys to UI icons (emojis or SVGs).
 * This ensures the UI is not dependent on hardcoded strings in the database.
 */

export const SCHEDULE_ICONS: Record<string, string> = {
  SCHOOL: '🏫',
  BREAKFAST: '🥞',
  CIRCLE: '🧸',
  STORY: '📘',
  LUNCH: '🍕',
  SNACK: '🍎',
  PLAY: '🎨',
  PICKUP: '👋',
  DEFAULT: '📅',
};

export const LOG_ICONS: Record<string, string> = {
  ACTIVITY: '🎨',
  MEALS: '🍴',
  ATTENDANCE: '✓',
  DEFAULT: '📝',
};

/**
 * Get icon for schedule item
 */
export const getScheduleIcon = (key: string): string => {
  return SCHEDULE_ICONS[key.toUpperCase()] || SCHEDULE_ICONS.DEFAULT;
};

/**
 * Get icon for activity log
 */
export const getLogIcon = (tag: string): string => {
  return LOG_ICONS[tag.toUpperCase()] || LOG_ICONS.DEFAULT;
};
