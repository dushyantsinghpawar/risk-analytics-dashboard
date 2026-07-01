import { describe, it, expect } from 'vitest'
import { getSeverity } from './severity'

describe('getSeverity', () => {
  it('returns High for a drop of 3 or more notches', () => {
    expect(getSeverity('A+', 'BBB')).toBe('High')   // 18 -> 14, drop 4
    expect(getSeverity('BBB', 'BB')).toBe('High')   // 14 -> 11, drop 3
  })

  it('returns Medium for a drop of exactly 2 notches', () => {
    expect(getSeverity('A', 'BBB+')).toBe('Medium') // 17 -> 15, drop 2
    expect(getSeverity('AA', 'A+')).toBe('Medium')  // 20 -> 18, drop 2
  })

  it('returns Low for a single-notch drop', () => {
    expect(getSeverity('A', 'A-')).toBe('Low')      // 17 -> 16, drop 1
  })

  it('returns Low when the rating stays the same or improves', () => {
    expect(getSeverity('A', 'A')).toBe('Low')
    expect(getSeverity('BBB', 'A')).toBe('Low')
  })

  it('falls back to a neutral score for unrecognized ratings', () => {
    expect(getSeverity('NR', 'NR')).toBe('Low')
  })
})
