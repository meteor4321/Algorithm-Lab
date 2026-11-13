import { copyItems, createTrace } from './trace'
import type { ArrayView, Element, Result, Step } from './types'

type FrameView = Partial<Omit<ArrayView, 'type' | 'cells' | 'variables'>>

export function lessonTrace(items: readonly Element[])
{
  const trace = createTrace()
  const values = copyItems(items)
  const variables: Record<string, number | boolean | null> = {}

  function record(line: string | null, message: string, kind: Step['kind'] = 'update', view: FrameView = {}, result?: Result)
  {
    trace.add(kind, line, message, { cells: values, variables, pointers: [], regions: [], ...view }, result)
  }

  function swap(left: number, right: number)
  {
    const item = values[left]
    values[left] = values[right]
    values[right] = item
    if (left !== right) trace.metrics.swaps++
  }

  function sorted(line = 'result', view: FrameView = {})
  {
    record(line, '排序完成，回傳結果。', 'return', {
      ...view,
      regions: [{ from: 0, to: values.length - 1, label: '已排序', tone: 'settled' }],
    }, { type: 'sorted', items: Object.freeze([...values]) })
    return trace.finish()
  }

  return { ...trace, values, variables, record, swap, sorted }
}

export const showItem = (item: Element) => item.value
export const order = (a: number, b: number) => a < b ? '<' : a > b ? '>' : '='
