import { copyItems, createTrace } from './trace'
import type { Algorithm, ArrayView, Result, Step } from './types'

export const traceBubbleSort: Algorithm = ({ items }) =>
{
  const { add, finish, metrics } = createTrace()
  const values = copyItems(items)
  let end: number | null = null
  let index: number | null = null
  let sortedFrom = values.length

  function record(kind: Step['kind'], line: string | null, message: string, options:
  {
    pairIndex?: number
    focusIndex?: number
    marked?: ArrayView['marked']
    result?: Result
  } = {})
  {
    const { pairIndex, focusIndex, marked, result } = options
    const pointers = end !== null && sortedFrom > 0 ? [{ label: 'end', index: end }] : []
    if (pairIndex !== undefined)
    {
      pointers.push({ label: 'index', index: pairIndex }, { label: 'index+1', index: pairIndex + 1 })
    }
    add(kind, line, message,
    {
      cells: values,
      variables: { end, index },
      round: end === null ? undefined : values.length - end,
      pointers,
      regions: sortedFrom < values.length
        ? [{ from: sortedFrom, to: values.length - 1, tone: 'settled', label: '已排序' }]
        : [],
      marked,
      focusIndex: focusIndex ?? pairIndex,
    }, result)
  }

  record('initial', null, '先觀察原始陣列。接下來會從左到右比較相鄰的值。')
  record('update', 'copy', '複製原始陣列，接下來在副本上排序。')
  for (let rightEdge = values.length - 1; rightEdge > 0; rightEdge--)
  {
    end = rightEdge
    record('update', 'outer', `第 ${values.length - end} 輪的比較範圍是索引 0 到 ${end}。`, { focusIndex: end })
    for (let leftIndex = 0; leftIndex < end; leftIndex++)
    {
      index = leftIndex
      record('update', 'inner', `選取索引 ${index} 和 ${index + 1}，準備比較。`, { pairIndex: index })
      const left = values[index].value
      const right = values[index + 1].value
      const shouldSwap = left > right
      const indices = [index, index + 1]
      metrics.comparisons++
      record('compare', 'compare', shouldSwap
        ? `${left} > ${right}，下一步會交換這兩格。`
        : left === right ? `${left} = ${right}，維持原本的先後順序。` : `${left} < ${right}，維持目前的位置。`,
      { pairIndex: index, marked: { indices, tone: 'compare', label: '比較' } })
      if (shouldSwap)
      {
        ;[values[index], values[index + 1]] = [values[index + 1], values[index]]
        metrics.swaps++
        record('move', 'swap', `交換相鄰兩格，較大的 ${left} 往右移一格。`,
        {
          pairIndex: index,
          marked: { indices, tone: 'move', label: '交換' },
        })
      }
    }
    sortedFrom = end
    record('check', 'inner', `本輪最大值 ${values[end].value} 已就位，索引 ${end} 標為已排序。`, { focusIndex: end })
  }
  sortedFrom = 0
  record('check', 'outer', '待排序區少於兩格，結束外層迴圈。')
  record('return', 'result', '回傳穩定升冪排列的陣列。',
  {
    result: { type: 'sorted', items: Object.freeze([...values]) },
  })
  return finish()
}
