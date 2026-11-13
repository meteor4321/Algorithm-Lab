import { lessonTrace, showItem } from './lesson-trace'
import type { Algorithm, Element, Step } from './types'

export const traceCountingSort: Algorithm = ({ items }) =>
{
  const { values, variables, metrics, record, sorted } = lessonTrace(items)
  Object.assign(variables, { low: null, value: null, index: null })
  const counts: number[] = []
  let output: (Element | null)[] | undefined
  let low = 0
  let countLabel = '出現次數'
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', countIndex?: number, source?: number, destination?: number)
  {
    const countRow = counts.map((count, index) => `${low + index} → ${count}`)
    record(line, message, kind, {
      focusIndex: source,
      transfer: line === 'place' && source !== undefined ? { from: 'array', to: 'output', ids: [values[source].id] } : undefined,
      annotation: destination !== undefined ? `原值 ${variables.value}：累計數先減 1 得到輸出索引 ${destination}，再把整個元素放入該格。` : '依原值計數，再累計小於或等於各值的元素數量。',
      rows: [
        { label: countLabel, values: countRow, active: countIndex, note: '上方是表索引；格內是原值 → 次數／累計值。原值減 low 才是表索引。',
          regions: countIndex === undefined ? [] : [{ from: countIndex, to: countIndex, tone: 'move', label: line === 'count' || line === 'prefix' || line === 'position' ? '剛更新' : '使用這格' }] },
        ...(output ? [{ id: 'output', label: '輸出陣列', items: output, values: output.map(item => item ? showItem(item) : '空格'), active: destination,
          regions: output.flatMap((item, index) => item ? [{ from: index, to: index, tone: 'settled' as const, label: '已放入' }] : []) }] : []),
      ],
    })
  }

  frame(null, '每個可能的整數值都有一個計數格。', 'initial')
  low = Math.min(...values.map(item => item.value))
  variables.low = low
  frame('low', `最小值是 ${low}，計數表從這個值開始。`)
  counts.push(...Array(Math.max(...values.map(item => item.value)) - low + 1).fill(0))
  frame('counts', `準備 ${counts.length} 個計數格，可橫向捲動查看完整表格。`)
  for (const [index, item] of values.entries())
  {
    variables.value = item.value
    const key = item.value - low
    frame('count-loop', `讀取 ${item.value}。`, 'update', key, index)
    counts[key]++
    frame('count', `${item.value} 的出現次數增加為 ${counts[key]}。`, 'update', key, index)
  }
  frame('count-loop', '每個輸入值都已計數。', 'check')
  countLabel = '累計表'
  for (let index = 1; index < counts.length; index++)
  {
    variables.index = index
    frame('prefix-loop', `查看值 ${low + index} 的累計格。`, 'update', index)
    counts[index] += counts[index - 1]
    frame('prefix', `接上前一格後，共有 ${counts[index]} 個值小於或等於 ${low + index}。`, 'update', index)
  }
  frame('prefix-loop', '累計表已完成。', 'check')
  output = Array(values.length).fill(null)
  frame('output', '準備空的輸出陣列。')
  countLabel = '可放置位置（遞減）'
  for (let index = values.length - 1; index >= 0; index--)
  {
    const item = values[index]
    const key = item.value - low
    variables.value = item.value
    frame('place-loop', `從右往左讀取 ${item.value}。`, 'update', key, index)
    const destination = --counts[key]
    frame('position', `累計值減一後得到輸出索引 ${destination}。`, 'update', key, index, destination)
    output[destination] = item
    metrics.moves++
    frame('place', `將 ${item.value} 放入輸出索引 ${destination}。`, 'move', key, index, destination)
  }
  frame('place-loop', '每個值都已寫入輸出。', 'check')
  values.splice(0, values.length, ...(output as Element[]))
  return sorted()
}
