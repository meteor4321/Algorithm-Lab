import { lessonTrace, showItem } from './lesson-trace'
import type { Algorithm, ArrayView, Element, Step } from './types'

export const traceBucketSort: Algorithm = ({ items }) =>
{
  const { values, variables, metrics, record, sorted } = lessonTrace(items)
  Object.assign(variables, { low: null, width: null, value: null, index: null })
  let buckets: Element[][] = []
  let output: Element[] | undefined
  let low = 0
  let width = 0
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', active?: number, source?: number)
  {
    const transfer: ArrayView['transfer'] = line === 'distribute' && source !== undefined ? { from: 'array', to: `bucket-${active}`, ids: [values[source].id] }
      : line === 'append' && active !== undefined ? { from: `bucket-${active}`, to: 'output', ids: buckets[active].map(item => item.id) } : undefined
    record(line, message, kind, {
      transfer,
      annotation: '先按區間分桶，再排桶內。桶內排序使用 Python 的穩定排序；可先練習插入排序理解桶內的整理。',
      focusIndex: source,
      rows: [
        ...buckets.map((bucket, index) => ({
          id: `bucket-${index}`, items: bucket,
          active: line === 'distribute' && active === index ? bucket.length - 1 : undefined,
          label: `桶 ${index}（${low + width * index} 到 ${low + width * (index + 1) - 1}）${active === index ? ' · 目前桶' : ''}`,
          values: bucket.map(showItem),
        })),
        ...(output ? [{ id: 'output', label: '輸出陣列', values: output.map(showItem), items: output }] : []),
      ],
    })
  }
  frame(null, '先按數值所在區間分桶，再把各桶接起來。', 'initial')
  low = Math.min(...values.map(item => item.value))
  variables.low = low
  frame('low', `桶 0 從最小值 ${low} 開始。`)
  width = Math.floor((Math.max(...values.map(item => item.value)) - low) / 4) + 1
  variables.width = width
  frame('width', `把範圍分成四個區間，每桶涵蓋 ${width} 個整數值。`)
  buckets = [[], [], [], []]
  frame('buckets', '建立四個空桶。')
  for (const [source, item] of values.entries())
  {
    variables.value = item.value
    frame('value', `讀取 ${item.value}。`, 'update', undefined, source)
    const index = Math.floor((item.value - low) / width)
    variables.index = index
    frame('index', `${item.value} 落在桶 ${index} 的區間。`, 'update', index, source)
    buckets[index].push(item)
    metrics.moves++
    frame('distribute', `將元素放到桶 ${index} 的尾端。`, 'move', index, source)
  }
  frame('value', '分桶完成，同一桶裡的值還要排序。', 'check')
  output = []
  frame('output', '準備空的輸出陣列。')
  for (const [index, bucket] of buckets.entries())
  {
    frame('collect', `從桶 ${index} 繼續。`, 'update', index)
    bucket.sort((a, b) => a.value - b.value)
    frame('sort-bucket', `桶 ${index} 內已穩定排序。`, 'move', index)
    output.push(...bucket)
    metrics.moves += bucket.length
    frame('append', `把桶 ${index} 的 ${bucket.length} 個值依序接到輸出。`, 'move', index)
  }
  frame('collect', '所有桶都已收集。', 'check')
  values.splice(0, values.length, ...output)
  return sorted('result', {
    transfer: { from: 'output', to: 'array', ids: values.map(item => item.id) },
    rows: [{ id: 'output', label: '輸出陣列', values: values.map(showItem), items: values }],
    annotation: '依區間順序接回後，整列已排序；輸出保留一份結果供對照。',
  })
}
