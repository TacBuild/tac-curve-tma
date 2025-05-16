export const truncate = (string = '', length = 6) => {
  return string.slice(0, length) + '...' + string.slice(string.length - 4, string.length)
}

export const formatNumber = (value: string | number = 0, maximumFractionDigits = 4, maximumSignificantDigits = undefined) =>
  Number(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits, maximumSignificantDigits })
