export const RATING_SCORE = {
  'AAA': 22, 'AA+': 21, 'AA': 20, 'AA-': 19,
  'A+': 18,  'A':   17, 'A-':  16,
  'BBB+': 15,'BBB': 14, 'BBB-': 13,
  'BB+': 12, 'BB':  11, 'BB-': 10,
  'B+':   9, 'B':    8, 'B-':   7,
  'CCC':  6, 'CC':   5, 'C':    4,
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

function makeHistory(prev, curr) {
  const p = RATING_SCORE[prev] ?? 10
  const c = RATING_SCORE[curr] ?? 10
  return MONTHS.map((month, i) => ({
    month,
    score: +(p + (c - p) * (i / (MONTHS.length - 1))).toFixed(1),
  }))
}

const ANALYST_NOTE = {
  Upgrade:   'Improved free cash flow and reduced leverage have strengthened the credit profile. Management guidance is constructive going into the next fiscal year.',
  Downgrade: 'Rising debt burden and margin compression have weakened credit fundamentals. Continued monitoring is warranted given near-term refinancing risk.',
  Stable:    'Operating performance remains consistent with stable debt servicing capacity. Balance sheet resilience supports the current rating level.',
}

const OUTLOOK_MAP = { Upgrade: 'Positive', Downgrade: 'Negative', Stable: 'Stable' }

const BASE_RATINGS = [
  { id:  1, company: 'Tesla',            industry: 'Automotive',    currentRating: 'A',    previousRating: 'A-',  status: 'Upgrade',   country: 'USA',         analyst: 'Sarah Kim',    date: '2025-06-01', marketCapTier: 'Large' },
  { id:  2, company: 'Meta',             industry: 'Technology',    currentRating: 'AA',   previousRating: 'AA',  status: 'Stable',    country: 'USA',         analyst: 'James Okafor', date: '2025-06-01', marketCapTier: 'Large' },
  { id:  3, company: 'Ford',             industry: 'Automotive',    currentRating: 'BBB',  previousRating: 'A',   status: 'Downgrade', country: 'USA',         analyst: 'Liu Wei',      date: '2025-05-30', marketCapTier: 'Large' },
  { id:  4, company: 'Apple',            industry: 'Technology',    currentRating: 'AAA',  previousRating: 'AAA', status: 'Stable',    country: 'USA',         analyst: 'Sarah Kim',    date: '2025-05-28', marketCapTier: 'Large' },
  { id:  5, company: 'Chevron',          industry: 'Energy',        currentRating: 'AA',   previousRating: 'A+',  status: 'Upgrade',   country: 'USA',         analyst: 'Marcus Bell',  date: '2025-05-28', marketCapTier: 'Large' },
  { id:  6, company: 'Boeing',           industry: 'Aerospace',     currentRating: 'BB',   previousRating: 'BBB', status: 'Downgrade', country: 'USA',         analyst: 'Liu Wei',      date: '2025-05-27', marketCapTier: 'Large' },
  { id:  7, company: 'JPMorgan',         industry: 'Finance',       currentRating: 'AA+',  previousRating: 'AA+', status: 'Stable',    country: 'USA',         analyst: 'James Okafor', date: '2025-05-27', marketCapTier: 'Large' },
  { id:  8, company: 'Netflix',          industry: 'Technology',    currentRating: 'B+',   previousRating: 'B',   status: 'Upgrade',   country: 'USA',         analyst: 'Sarah Kim',    date: '2025-05-26', marketCapTier: 'Mid'   },
  { id:  9, company: 'Volkswagen',       industry: 'Automotive',    currentRating: 'A-',   previousRating: 'A',   status: 'Downgrade', country: 'Germany',     analyst: 'Elena Rossi',  date: '2025-05-25', marketCapTier: 'Large' },
  { id: 10, company: 'Shell',            industry: 'Energy',        currentRating: 'AA-',  previousRating: 'AA-', status: 'Stable',    country: 'UK',          analyst: 'Marcus Bell',  date: '2025-05-25', marketCapTier: 'Large' },
  { id: 11, company: 'Airbus',           industry: 'Aerospace',     currentRating: 'A+',   previousRating: 'A',   status: 'Upgrade',   country: 'France',      analyst: 'Elena Rossi',  date: '2025-05-24', marketCapTier: 'Large' },
  { id: 12, company: 'HSBC',             industry: 'Finance',       currentRating: 'AA-',  previousRating: 'A+',  status: 'Upgrade',   country: 'UK',          analyst: 'James Okafor', date: '2025-05-24', marketCapTier: 'Large' },
  { id: 13, company: 'Samsung',          industry: 'Technology',    currentRating: 'AA',   previousRating: 'AA',  status: 'Stable',    country: 'South Korea', analyst: 'Liu Wei',      date: '2025-05-23', marketCapTier: 'Large' },
  { id: 14, company: 'General Electric', industry: 'Industrials',   currentRating: 'BBB+', previousRating: 'BBB', status: 'Upgrade',   country: 'USA',         analyst: 'Marcus Bell',  date: '2025-05-23', marketCapTier: 'Large' },
  { id: 15, company: 'Siemens',          industry: 'Industrials',   currentRating: 'A+',   previousRating: 'A+',  status: 'Stable',    country: 'Germany',     analyst: 'Elena Rossi',  date: '2025-05-22', marketCapTier: 'Large' },
  { id: 16, company: 'Pfizer',           industry: 'Healthcare',    currentRating: 'A',    previousRating: 'A+',  status: 'Downgrade', country: 'USA',         analyst: 'Sarah Kim',    date: '2025-05-22', marketCapTier: 'Large' },
  { id: 17, company: 'Roche',            industry: 'Healthcare',    currentRating: 'AA',   previousRating: 'AA',  status: 'Stable',    country: 'Switzerland', analyst: 'Elena Rossi',  date: '2025-05-21', marketCapTier: 'Large' },
  { id: 18, company: 'Amazon',           industry: 'Technology',    currentRating: 'AA',   previousRating: 'AA-', status: 'Upgrade',   country: 'USA',         analyst: 'James Okafor', date: '2025-05-21', marketCapTier: 'Large' },
  { id: 19, company: 'BHP Group',        industry: 'Mining',        currentRating: 'A-',   previousRating: 'A-',  status: 'Stable',    country: 'Australia',   analyst: 'Liu Wei',      date: '2025-05-20', marketCapTier: 'Large' },
  { id: 20, company: 'Rio Tinto',        industry: 'Mining',        currentRating: 'A',    previousRating: 'BBB+',status: 'Upgrade',   country: 'Australia',   analyst: 'Liu Wei',      date: '2025-05-20', marketCapTier: 'Large' },
  { id: 21, company: 'Deutsche Bank',    industry: 'Finance',       currentRating: 'BBB',  previousRating: 'BBB+',status: 'Downgrade', country: 'Germany',     analyst: 'Elena Rossi',  date: '2025-05-19', marketCapTier: 'Large' },
  { id: 22, company: 'Sony',             industry: 'Technology',    currentRating: 'A-',   previousRating: 'A-',  status: 'Stable',    country: 'Japan',       analyst: 'Liu Wei',      date: '2025-05-19', marketCapTier: 'Large' },
  { id: 23, company: 'Nestle',           industry: 'Consumer Goods',currentRating: 'AA',   previousRating: 'AA',  status: 'Stable',    country: 'Switzerland', analyst: 'Elena Rossi',  date: '2025-05-18', marketCapTier: 'Large' },
  { id: 24, company: 'Unilever',         industry: 'Consumer Goods',currentRating: 'A+',   previousRating: 'A',   status: 'Upgrade',   country: 'UK',          analyst: 'Marcus Bell',  date: '2025-05-18', marketCapTier: 'Large' },
  { id: 25, company: 'ExxonMobil',       industry: 'Energy',        currentRating: 'AA+',  previousRating: 'AA+', status: 'Stable',    country: 'USA',         analyst: 'Marcus Bell',  date: '2025-05-17', marketCapTier: 'Large' },
  { id: 26, company: 'Berkshire',        industry: 'Finance',       currentRating: 'AAA',  previousRating: 'AAA', status: 'Stable',    country: 'USA',         analyst: 'James Okafor', date: '2025-05-17', marketCapTier: 'Large' },
  { id: 27, company: 'Lockheed Martin',  industry: 'Aerospace',     currentRating: 'A',    previousRating: 'A',   status: 'Stable',    country: 'USA',         analyst: 'Marcus Bell',  date: '2025-05-16', marketCapTier: 'Large' },
  { id: 28, company: 'Moderna',          industry: 'Healthcare',    currentRating: 'BB+',  previousRating: 'BBB', status: 'Downgrade', country: 'USA',         analyst: 'Sarah Kim',    date: '2025-05-16', marketCapTier: 'Mid'   },
  { id: 29, company: 'Spotify',          industry: 'Technology',    currentRating: 'B+',   previousRating: 'B+',  status: 'Stable',    country: 'Sweden',      analyst: 'Elena Rossi',  date: '2025-05-15', marketCapTier: 'Mid'   },
  { id: 30, company: 'Rivian',           industry: 'Automotive',    currentRating: 'B',    previousRating: 'B-',  status: 'Upgrade',   country: 'USA',         analyst: 'Sarah Kim',    date: '2025-05-15', marketCapTier: 'Mid'   },
  { id: 31, company: 'BP',               industry: 'Energy',        currentRating: 'A-',   previousRating: 'A',   status: 'Downgrade', country: 'UK',          analyst: 'Marcus Bell',  date: '2025-05-14', marketCapTier: 'Large' },
  { id: 32, company: 'Goldman Sachs',    industry: 'Finance',       currentRating: 'A+',   previousRating: 'A+',  status: 'Stable',    country: 'USA',         analyst: 'James Okafor', date: '2025-05-14', marketCapTier: 'Large' },
  { id: 33, company: 'Toyota',           industry: 'Automotive',    currentRating: 'AA-',  previousRating: 'AA-', status: 'Stable',    country: 'Japan',       analyst: 'Liu Wei',      date: '2025-05-13', marketCapTier: 'Large' },
  { id: 34, company: 'LVMH',             industry: 'Consumer Goods',currentRating: 'A+',   previousRating: 'A',   status: 'Upgrade',   country: 'France',      analyst: 'Elena Rossi',  date: '2025-05-13', marketCapTier: 'Large' },
  { id: 35, company: 'Caterpillar',      industry: 'Industrials',   currentRating: 'A',    previousRating: 'A',   status: 'Stable',    country: 'USA',         analyst: 'Marcus Bell',  date: '2025-05-12', marketCapTier: 'Large' },
  { id: 36, company: 'Alibaba',          industry: 'Technology',    currentRating: 'A-',   previousRating: 'A',   status: 'Downgrade', country: 'China',       analyst: 'Liu Wei',      date: '2025-05-12', marketCapTier: 'Large' },
  { id: 37, company: 'ASML',             industry: 'Technology',    currentRating: 'AA-',  previousRating: 'A+',  status: 'Upgrade',   country: 'Netherlands', analyst: 'Elena Rossi',  date: '2025-05-11', marketCapTier: 'Large' },
  { id: 38, company: 'Johnson Controls', industry: 'Industrials',   currentRating: 'BBB+', previousRating: 'BBB+',status: 'Stable',    country: 'USA',         analyst: 'Marcus Bell',  date: '2025-05-11', marketCapTier: 'Mid'   },
  { id: 39, company: 'AstraZeneca',      industry: 'Healthcare',    currentRating: 'A+',   previousRating: 'A',   status: 'Upgrade',   country: 'UK',          analyst: 'Sarah Kim',    date: '2025-05-10', marketCapTier: 'Large' },
  { id: 40, company: 'Thales',           industry: 'Aerospace',     currentRating: 'BBB+', previousRating: 'A-',  status: 'Downgrade', country: 'France',      analyst: 'Elena Rossi',  date: '2025-05-10', marketCapTier: 'Mid'   },
]

export const ratingsData = BASE_RATINGS.map(c => ({
  ...c,
  history:      makeHistory(c.previousRating, c.currentRating),
  analystNote:  ANALYST_NOTE[c.status],
  outlook:      OUTLOOK_MAP[c.status],
}))

export const kpiData = [
  { id: 1, title: 'Portfolio Risk Score', value: '72',                                                          trend: '+3', trendDirection: 'up'   },
  { id: 2, title: 'Companies Monitored',  value: String(BASE_RATINGS.length),                                   trend: '+5', trendDirection: 'up'   },
  { id: 3, title: 'Rating Changes',       value: String(BASE_RATINGS.filter(r => r.status !== 'Stable').length), trend: '-2', trendDirection: 'down' },
  { id: 4, title: 'Active Alerts',        value: '4',                                                           trend: '+1', trendDirection: 'up'   },
]

export const industries = [
  'All', 'Automotive', 'Technology', 'Energy', 'Aerospace',
  'Finance', 'Healthcare', 'Industrials', 'Mining', 'Consumer Goods',
]

export const ratingsList = [
  'All', 'AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-',
  'BBB+', 'BBB', 'BB+', 'BB', 'B+', 'B', 'B-',
]

export const statusList = ['All', 'Upgrade', 'Downgrade', 'Stable']

export const monthlyRatingsData = {
  Jan: { Upgrade: [1, 5],        Downgrade: [3],       Stable: [2, 4, 7]    },
  Feb: { Upgrade: [8],           Downgrade: [3, 6],    Stable: [2, 4, 7]    },
  Mar: { Upgrade: [1, 5, 8],     Downgrade: [3, 6],    Stable: [4, 7]       },
  Apr: { Upgrade: [5],           Downgrade: [3],       Stable: [2, 4, 7, 10] },
  May: { Upgrade: [1, 5, 8, 11], Downgrade: [3, 6],    Stable: [2, 4]       },
  Jun: { Upgrade: [1, 5],        Downgrade: [3, 6, 9], Stable: [2, 4, 7]    },
}

export const ratingTrendsData = Object.entries(monthlyRatingsData).map(([month, statuses]) => ({
  month,
  upgrades:   statuses.Upgrade.length,
  downgrades: statuses.Downgrade.length,
  stable:     statuses.Stable.length,
}))
