import { order, type lessonTrace } from './lesson-trace'
import type { ArrayView, Region, Step } from './types'

export function partitionView(left: number, right: number, pointers: ArrayView['pointers'] = [], length?: number): Partial<ArrayView>
{
  return {
    pointers,
    focusIndex: pointers.at(-1)?.index,
    regions: [
      ...(left <= right ? [{ from: left, to: right, tone: 'candidate' as const, label: '目前範圍' }] : []),
      ...(length !== undefined && left > 0 ? [{ from: 0, to: left - 1, tone: 'excluded' as const, label: '不再搜尋' }] : []),
      ...(length !== undefined && right < length - 1 ? [{ from: right + 1, to: length - 1, tone: 'excluded' as const, label: '不再搜尋' }] : []),
    ],
  }
}

export function partition(trace: ReturnType<typeof lessonTrace>, left: number, right: number, context: () => Partial<ArrayView> = () => ({}))
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
    const extra = context()
    const smallEnd = boundary - (line === 'move-small' ? 0 : 1)
    const scannedEnd = scan === undefined ? (kind === 'check' ? right - 1 : left - 1) : scan - (line === 'scan' ? 1 : 0)
    const regions: Region[] = placed ? [
      { from: left, to: boundary - 1, tone: 'prefix', label: '< pivot' },
      { from: boundary, to: boundary, tone: 'settled', label: '基準已就位' },
      { from: boundary + 1, to: right, tone: 'suffix', label: '≥ pivot' },
    ] : [
      { from: left, to: smallEnd, tone: 'prefix', label: '< pivot' },
      { from: smallEnd + 1, to: scannedEnd, tone: 'suffix', label: '已掃描' },
      { from: Math.max(smallEnd, scannedEnd) + 1, to: right - 1, tone: 'candidate', label: '待掃描' },
      { from: right, to: right, tone: 'compare', label: '基準值' },
    ]
    record(line, message, kind, {
      ...extra,
      ...partitionView(left, right, pointers),
      regions: [...regions.filter(region => region.from <= region.to), ...(extra.regions ?? [])],
      annotation: 'boundary 左側都小於 pivot；scan 逐格掃描。遇到小值時與 boundary 交換，再把 boundary 往右移。',
    })
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
