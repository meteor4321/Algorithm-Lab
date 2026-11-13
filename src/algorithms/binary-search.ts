import { firstInversion } from './input'
import { copyItems, createTrace } from './trace'
import type { Algorithm, ArrayView, Pointer, Region, Result, Step } from './types'

export const traceBinarySearch: Algorithm = ({ items, target }) =>
{
  if (target === undefined) throw new Error('二分搜尋需要目標值。')
  if (firstInversion(items) !== -1) throw new Error('二分搜尋需要非遞減陣列。')
  const { add, finish, metrics } = createTrace()
  const sortedValues = copyItems(items)
  const last = sortedValues.length - 1
  let left: number | null = null
  let right: number | null = null
  let mid: number | null = null

  function record(kind: Step['kind'], line: string | null, message: string, marked?: ArrayView['marked'], result?: Result)
  {
    const pointers: Pointer[] = []
    for (const [label, index] of [['left', left], ['mid', mid], ['right', right]] as const)
    {
      if (index !== null && index >= 0 && index <= last) pointers.push({ label, index })
    }
    const from = left ?? 0
    const to = right ?? last
    const regions: Region[] = []
    if (from > 0) regions.push({ from: 0, to: from - 1, tone: 'excluded', label: '已排除' })
    if (from <= to) regions.push({ from, to, tone: 'candidate', label: '候選區' })
    if (to < last) regions.push({ from: to + 1, to: last, tone: 'excluded', label: '已排除' })
    let focusIndex: number | undefined
    if (line === 'middle') focusIndex = mid ?? undefined
    if (line === 'right-half') focusIndex = from <= to ? from : mid ?? undefined
    if (line === 'left-half') focusIndex = from <= to ? to : mid ?? undefined
    add(kind, line, message, {
      cells: sortedValues,
      variables: { left, mid, right, target: target! },
      pointers,
      regions,
      marked,
      focusIndex,
    }, result)
  }

  record('initial', null, `搜尋目標是 ${target}。整個升冪陣列都是候選區。`)
  left = 0
  right = last
  record('update', 'bounds', `初始化左右界，候選區包含索引 ${left} 到 ${right}。`)
  while (true)
  {
    record('check', 'loop', left <= right ? `候選區為索引 ${left} 到 ${right}，可以計算中點。` : `左界 ${left} > 右界 ${right}，候選區為空。`)
    if (left > right) break
    mid = Math.floor((left + right) / 2)
    const value = sortedValues[mid].value
    record('update', 'middle', `計算中點索引 ${mid}，該格的值是 ${value}。`)
    const matches = value === target
    const marked = { indices: [mid], tone: matches ? 'found' : 'compare', label: matches ? '✓ 命中' : '比較' } as const
    metrics.comparisons++
    record('compare', 'equal', matches
      ? `${value} = ${target}，找到目標。`
      : `${value} ≠ ${target}，接著判斷要往哪邊找。`, marked)
    if (matches)
    {
      record('return', 'found', `回傳本次命中的索引 ${mid}。`, marked, { type: 'search', index: mid, target })
      return finish()
    }
    metrics.comparisons++
    record('compare', 'compare', value < target
      ? `${value} < ${target}，下一步排除中點及其左側。`
      : `${value} > ${target}，下一步排除中點及其右側。`, marked)
    if (value < target)
    {
      left = mid + 1
      record('update', 'right-half', left <= right
        ? `左界移到索引 ${left}，接下來只看右側剩下的格子。`
        : `左界移到 ${left}，已越過右界 ${right}。`)
    }
    else
    {
      right = mid - 1
      record('update', 'left-half', left <= right
        ? `右界移到索引 ${right}，接下來只看左側剩下的格子。`
        : `右界移到 ${right}，已低於左界 ${left}。`)
    }
  }
  record('return', 'miss', '查無結果，回傳 −1。', undefined, { type: 'search', index: -1, target })
  return finish()
}
