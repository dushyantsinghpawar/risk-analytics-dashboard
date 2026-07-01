export function exportToCsv(data, filename = 'ratings-export.csv') {
  const headers = ['Company', 'Industry', 'Current Rating', 'Previous Rating', 'Status', 'Country', 'Analyst', 'Date', 'Market Cap Tier']
  const rows = data.map(row => [
    row.company,
    row.industry,
    row.currentRating,
    row.previousRating,
    row.status,
    row.country,
    row.analyst,
    row.date,
    row.marketCapTier,
  ].map(v => `"${v ?? ''}"`))

  const csv = [headers.map(h => `"${h}"`), ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
