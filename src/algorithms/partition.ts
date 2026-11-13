import { order, type lessonTrace } from './lesson-trace'
import type { ArrayView, Step } from './types'

export function partitionView(left: number, right: number, pointers: ArrayView['pointers'] = []): Partial<ArrayView>
{
  return {
    pointers,
    focusIndex: pointers.at(-1)?.index,
    regions: left <= right ? [{ from: left, to: right, tone: 'candidate', label: '目前範圍' }] : [],
  }
}

export function partition(trace: ReturnType<typeof lessonTrace>, left: number, right: number)
{
  const { values, variables, metrics, swap, record } = trace
  const pivot = values[right].value
  let boundary = left
  Object.assign(variables, { left, right, pivot, boundary: null, scan: null })
  function frame(line: string, message: string, kind: Step['kind'] = 'update', scan?: number, placed = false)
  {
    const pointers = [{ label: 'pivot', index: placed ? boundary : right }]
    if (variables.boundary !== null) pointers.push({ label: 'boundary', index: boundary })
    if (scan !== undefined) pointers.push({ label: 'scan', index: scan })
    record(line, message, kind, partitionView(left, right, pointers))
  }

  frame('pivot', `取右端的 ${pivot} 為基準值。`)
  variables.boundary = boundary
  frame('boundary', '用 boundary 記下較小區段的下一個位置。')
  for (let scan = left; scan < right; scan++)
  {
    variables.scan = scan
    frame('scan', `掃描索引 ${scan}。`, 'update', scan)
    const value = values[scan].value
    metrics.comparisons++
    frame('compare', `${value} ${order(value, pivot)} ${pivot}，${value < pivot ? '歸入較小的一側。' : '留在目前的位置。'}`, 'compare', scan)
    if (value < pivot)
    {
      swap(boundary, scan)
      frame('move-small', `把 ${value} 放在較小區段的尾端。`, 'move', scan)
      variables.boundary = ++boundary
      frame('advance', '較小區段多了一格，分界向右移。', 'update', scan)
    }
  }
  frame('scan', '基準值左側的元素都已檢查。', 'check')
  swap(boundary, right)
  frame('place', `把基準值放到索引 ${boundary}，兩側分區完成。`, 'move', undefined, true)
  frame('partition-result', `回傳基準值就位的索引 ${boundary}。`, 'check', undefined, true)
  return boundary
}
