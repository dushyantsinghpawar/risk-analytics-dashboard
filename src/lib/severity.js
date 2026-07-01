import { RATING_SCORE } from '../data/mockData'

export function getSeverity(prev, curr) {
  const drop = (RATING_SCORE[prev] ?? 10) - (RATING_SCORE[curr] ?? 10)
  if (drop >= 3) return 'High'
  if (drop >= 2) return 'Medium'
  return 'Low'
}
