import { lessonTrace } from './lesson-trace'
import { partition, partitionView } from './partition'
import type { Algorithm } from './types'

export const traceQuickSort: Algorithm = ({ items }) =>
{
  const trace = lessonTrace(items)
  const { variables, record, sorted } = trace
  Object.assign(variables, { left: null, right: null, pivot: null, boundary: null, scan: null, pivot_index: null })

  function sortRange(left: number, right: number)
  {
    Object.assign(variables, { left, right, pivot: null, boundary: null, scan: null, pivot_index: null })
    const range = partitionView(left, right)
    const small = left >= right
    record('base', small ? '這段至多一格，已經有序。' : '這段至少有兩格，可以分區。', 'check', range)
    if (small)
    {
      record('stop', '回到上一層。', 'check', range)
      return
    }
    record('partition', '進入分區步驟。', 'update', range)
    const pivotIndex = partition(trace, left, right)
    variables.pivot_index = pivotIndex
    record('recurse-left', '繼續處理基準值左側。', 'update', range)
    sortRange(left, pivotIndex - 1)
    Object.assign(variables, { left, right, pivot: null, boundary: null, scan: null, pivot_index: pivotIndex })
    record('recurse-right', '左段已處理，接著處理右段。', 'update', range)
    sortRange(pivotIndex + 1, right)
  }

  record(null, '以基準值將範圍分成兩段，再分別處理。', 'initial')
  record('copy', '複製原始陣列。')
  record('start', '從整列開始。')
  sortRange(0, items.length - 1)
  for (const key of Object.keys(variables)) variables[key] = null
  return sorted()
}
