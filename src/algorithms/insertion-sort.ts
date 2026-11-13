import { copyItems, createTrace } from './trace'
import type { Algorithm, ArrayView, Element, Result, Step } from './types'

export const traceInsertionSort: Algorithm = ({ items }) =>
{
  const { add, finish, metrics } = createTrace()
  const values: (Element | null)[] = copyItems(items)
  let index: number | null = null
  let scan: number | null = null
  let held: Element | null = null
  let key: number | null = null

  function record(kind: Step['kind'], line: string | null, message: string, marked?: ArrayView['marked'], result?: Result)
  {
    const completed = line === 'result' || (line === 'outer' && kind === 'check')
    const activeIndex = completed ? null : index
    const pointers = []
    if (activeIndex !== null) pointers.push({ label: 'index', index: activeIndex })
    if (scan !== null && scan >= 0 && ((held && line !== 'hold') || line === 'insert')) pointers.push({ label: 'scan', index: scan })
    let prefix = completed ? values.length : index ?? 0
    if (held) prefix = values.indexOf(null)
    else if (line === 'insert') prefix++
    let focusIndex = activeIndex
    if (held && line !== 'hold')
    {
      focusIndex = scan === null || scan < 0 ? prefix : scan
    }
    add(kind, line, message, {
      cells: values,
      variables: { index, scan, key },
      held,
      pointers,
      regions: prefix > 0 ? [{ from: 0, to: prefix - 1, tone: 'settled', label: '已處理' }] : [],
      marked,
      focusIndex: focusIndex ?? undefined,
    }, result)
  }

  record('initial', null, '先觀察原始陣列。第一格可單獨視為排好的區段。')
  record('update', 'copy', '複製原始陣列，準備逐一插入元素。')
  for (let nextIndex = 1; nextIndex < values.length; nextIndex++)
  {
    index = nextIndex
    record('update', 'outer', `選取索引 ${index}，這一輪要把這格的值插進左側。`)
    held = values[index]!
    key = held.value
    values[index] = null
    metrics.moves++
    record('move', 'hold', `取出索引 ${index} 的值 ${key} 並暫存，原位留下空格。`, { indices: [index], tone: 'move', label: '取出' })
    scan = index - 1
    record('update', 'scan', `將 scan 放在索引 ${scan}，從空格左側開始找插入位置。`)
    while (true)
    {
      if (scan < 0)
      {
        record('check', 'inner', '左邊已沒有格子可比，下一步填入索引 0。')
        break
      }
      const value = values[scan]!.value
      const shouldShift = value > key
      metrics.comparisons++
      record('compare', 'inner', shouldShift
        ? `${value} > ${key}，下一步將左側元素右移。`
        : `${value} ≤ ${key}，下一步將暫存值放進空格。`,
      { indices: [scan], tone: 'compare', label: '與暫存值比較' })
      if (!shouldShift) break
      values[scan + 1] = values[scan]
      values[scan] = null
      metrics.moves++
      record('move', 'shift', `把 ${value} 往右移一格，空格來到索引 ${scan}。`, { indices: [scan + 1], tone: 'move', label: '右移' })
      scan--
      record('update', 'retreat', `將 scan 左移到 ${scan}，準備再次檢查迴圈條件。`)
    }
    values[scan + 1] = held
    held = null
    metrics.moves++
    record('move', 'insert', `將 ${key} 插回索引 ${scan + 1}，左側的區段又多排好一格。`, { indices: [scan + 1], tone: 'move', label: '插回' })
  }
  record('check', 'outer', '已經處理過每一格，可以回傳結果。')
  record('return', 'result', '回傳穩定升冪排列的陣列。', undefined, { type: 'sorted', items: Object.freeze(values as Element[]) })
  return finish()
}
