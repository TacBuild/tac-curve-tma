export const truncate = (string = '', length = 6) => {
  return string.slice(0, length) + '...' + string.slice(string.length - 4, string.length)
}

export const formatNumber = (value: string | number = 0, maximumFractionDigits = 4, maximumSignificantDigits = undefined) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits, maximumSignificantDigits })

export const formatUsd = (value: string | number = 0, maximumFractionDigits = 2, notation: 'standard' | 'scientific' | 'engineering' | 'compact' | undefined = 'standard') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    notation,
    currency: 'USD', maximumFractionDigits,
  }).format(+value)

export const formatPercent = (value: string | number = 0, maximumFractionDigits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits,
  }).format(+value)

export const compactNumber = (value: string | number = 0, maximumFractionDigits = 2) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits,
  }).format(Number(value))
}
