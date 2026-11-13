import { lessonTrace, showItem } from './lesson-trace'
import type { Algorithm, Element, Result, Step } from './types'

const slot = (value: number, size: number) => ((value % size) + size) % size

export function hashTable(items: readonly Element[])
{
  const table: [number, number][][] = [[], [], [], [], []]
  items.forEach((item, index) => table[slot(item.value, table.length)].push([index, item.value]))
  return table
}

export const traceHashSearch: Algorithm = ({ items, target }) =>
{
  if (target === undefined) throw new Error('需要搜尋目標。')
  const { values, variables, metrics, record, finish } = lessonTrace(items)
  const table = hashTable(values)
  Object.assign(variables, { target, bucket: null, index: null, value: null })
  const bucket = slot(target, table.length)
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', index?: number, result?: Result)
  {
    record(line, message, kind, {
      focusIndex: index,
      rows: table.map((chain, id) => ({
        label: `桶 ${id}${variables.bucket === id ? ' · 目前桶' : ''}`,
        values: chain.map(([position]) => showItem(values[position])),
        active: chain.findIndex(([position]) => position === index),
      })),
    }, result)
  }

  frame(null, '資料已按除以 5 的餘數分到各桶，碰撞的值放在同一桶。', 'initial')
  variables.bucket = bucket
  frame('bucket', `目標 ${target} 除以 5 的餘數是 ${bucket}，只需查這個桶。`)
  for (const [index, value] of table[bucket])
  {
    Object.assign(variables, { index, value })
    frame('scan', `查看桶內的 ${value}。`, 'update', index)
    metrics.comparisons++
    frame('compare', `${value} ${value === target ? '=' : '≠'} ${target}，${value === target ? '找到目標。' : '繼續檢查同桶的值。'}`, 'compare', index)
    if (value === target)
    {
      frame('found', `回傳原陣列中的索引 ${index}。`, 'return', index, { type: 'search', index, target })
      return finish()
    }
  }
  frame('scan', '目前桶已沒有待查的值。', 'check')
  frame('miss', '查無結果，回傳 −1。', 'return', undefined, { type: 'search', index: -1, target })
  return finish()
}
