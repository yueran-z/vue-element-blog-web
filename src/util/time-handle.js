/**
 * 过滤时间（时间处理）
 * @param {*} date
 */
export function typeDateTime(date) {
  const nDate = new Date(date)
  const y = nDate.getFullYear()
  const m = `${nDate.getMonth() + 1}`.padStart(2, '0')
  const d = `${nDate.getDate()}`.padStart(2, '0')
  const hh = `${nDate.getHours()}`.padStart(2, '0')
  const mm = `${nDate.getMinutes()}`.padStart(2, '0')
  const ss = `${nDate.getSeconds()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

export function typeDate(date) {
  const nDate = new Date(date)
  const y = nDate.getFullYear()
  const m = `${nDate.getMonth() + 1}`.padStart(2, '0')
  const d = `${nDate.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}
