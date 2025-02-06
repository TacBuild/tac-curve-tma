export const truncate = (string = '', length = 6) => {
  return string.slice(0, length) + '...' + string.slice(string.length - 4, string.length)
}

export const formatNumber = (value: string | number = 0, maximumFractionDigits = 4) =>
  Number(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits })

export const compactNumber = (value: string | number = 0, maximumFractionDigits = 2) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits,
  }).format(Number(value))
}
