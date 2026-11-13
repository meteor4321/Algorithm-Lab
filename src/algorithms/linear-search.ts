import { copyItems, createTrace } from './trace'
import type { Algorithm, ArrayView, Result, Step } from './types'

export const traceLinearSearch: Algorithm = ({ items, target }) =>
{
  if (target === undefined) throw new Error('線性搜尋需要目標值。')
  const { add, finish, metrics } = createTrace()
  const values = copyItems(items)
  let index: number | null = null
  let value: number | null = null
  let checked = 0

  function record(kind: Step['kind'], line: string | null, message: string, marked?: ArrayView['marked'], result?: Result)
  {
    const activeIndex = checked < values.length ? index : null
    add(kind, line, message, {
      cells: values,
      variables: { index, value, target: target! },
      pointers: activeIndex !== null ? [{ index: activeIndex, label: 'index' }] : [],
      regions: checked > 0 ? [{ from: 0, to: checked - 1, tone: 'excluded', label: '已排除' }] : [],
      marked,
      focusIndex: activeIndex ?? undefined,
    }, result)
  }

  record('initial', null, `搜尋目標是 ${target}。從左側開始逐格比對。`)
  for (const [nextIndex, item] of values.entries())
  {
    index = nextIndex
    value = item.value
    record('update', 'loop', `取得索引 ${index} 和這格的值 ${value}，準備和目標比對。`)
    const matches = value === target
    metrics.comparisons++
    const marked = { indices: [index], tone: matches ? 'found' : 'compare', label: matches ? '✓ 命中' : '比較' } as const
    record('compare', 'compare', matches
      ? `${value} = ${target}，下一步會回傳第一個命中的索引。`
      : `${value} ≠ ${target}，回到迴圈查看是否還有下一格。`, marked)
    if (matches)
    {
      record('return', 'found', `回傳第一個命中的索引 ${index}。`, marked, { type: 'search', index, target })
      return finish()
    }
    checked = index + 1
  }
  record('check', 'loop', '已檢查完整個陣列，沒有更多格子。')
  record('return', 'miss', '查無結果，回傳 −1。', undefined, { type: 'search', index: -1, target })
  return finish()
}
