// Status colors: saturated for light, lighter variants for dark backgrounds
export const STATUS_COLORS = {
  light: { Upgrade: '#16A34A', Downgrade: '#DC2626', Stable: '#0052CC' },
  dark:  { Upgrade: '#4ADE80', Downgrade: '#F87171', Stable: '#60A5FA' },
}

// Rating tier colors
export const TIER_COLORS = {
  light: ['#16A34A', '#0052CC', '#D97706', '#DC2626', '#7C3AED'],
  dark:  ['#4ADE80', '#60A5FA', '#FCD34D', '#F87171', '#C084FC'],
}

export function statusColors(isDark) {
  return isDark ? STATUS_COLORS.dark : STATUS_COLORS.light
}

export function tierColors(isDark) {
  return isDark ? TIER_COLORS.dark : TIER_COLORS.light
}
