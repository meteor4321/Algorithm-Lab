import { lessonTrace, showItem } from './lesson-trace'
import type { Algorithm, ArrayView, Element, Step } from './types'

export const traceRadixSort: Algorithm = ({ items }) =>
{
  const { values, variables, metrics, record, sorted } = lessonTrace(items)
  Object.assign(variables, { offset: null, maximum: null, place: null, value: null, digit: null })
  let buckets: Element[][] = []
  let output: Element[] | undefined
  let bucketPlace = 1
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', active?: number, source?: number)
  {
    const transfer: ArrayView['transfer'] = line === 'distribute' && source !== undefined ? { from: 'array', to: `bucket-${active}`, ids: [values[source].id] }
      : line === 'append' && active !== undefined ? { from: `bucket-${active}`, to: 'output', ids: buckets[active].map(item => item.id) }
      : line === 'collect' && kind === 'check' && output ? { from: 'output', to: 'array', ids: output.map(item => item.id) } : undefined
    record(line, message, kind, {
      transfer,
      digit: typeof variables.place === 'number' && variables.place <= Number(variables.maximum) ? { place: variables.place, offset: Number(variables.offset) } : undefined,
      annotation: line === 'advance' || (line === 'pass' && variables.place !== bucketPlace)
        ? `接下來檢查位值 ${variables.place} 是否需要處理；桶仍保留上一輪位值 ${bucketPlace} 的結果，建立新桶後才重新分發。`
        : typeof variables.place === 'number' ? `本輪看位值 ${variables.place}；黃底標出這一位，不足位數補 0，整張數字牌一起搬移。同桶依加入順序收回。` : '先看個位，再看十位；每輪都搬移完整數字。',
      focusIndex: source,
      rows: [
        ...buckets.map((bucket, index) => ({
          id: `bucket-${index}`, label: `桶 ${index}${active === index ? ' · 目前桶' : ''}`,
          values: bucket.map(showItem), items: bucket,
          digit: { place: bucketPlace, offset: Number(variables.offset) },
          active: line === 'distribute' && active === index ? bucket.length - 1 : undefined,
          note: `位值 ${bucketPlace} · 從左收回`,
        })),
        ...(output ? [{ id: 'output', label: `位值 ${bucketPlace} 的收集結果`, values: output.map(showItem), items: output, digit: { place: bucketPlace, offset: Number(variables.offset) } }] : []),
      ],
    })
  }
  frame(null, '先按個位數分組，再處理更高位數。', 'initial')
  const offset = Math.min(0, ...values.map(item => item.value))
  variables.offset = offset
  frame('offset', offset < 0 ? `位數使用「原值減去 ${offset}」，讓所有鍵都是非負數。` : '所有鍵都是非負數，偏移量設為 0。')
  const maximum = Math.max(1, Math.max(...values.map(item => item.value)) - offset)
  variables.maximum = maximum
  frame('maximum', `用最大鍵 ${maximum} 決定要處理到哪一位。`)
  let place = 1
  variables.place = place
  frame('place', '從個位開始。')
  while (place <= maximum)
  {
    frame('pass', `處理位值 ${place}。`, 'check')
    buckets = Array.from({ length: 10 }, () => [])
    bucketPlace = place
    output = undefined
    frame('buckets', '準備數字 0 到 9 的十個桶。')
    for (const [index, item] of values.entries())
    {
      variables.value = item.value
      frame('value', `讀取 ${item.value}。`, 'update', undefined, index)
      const digit = Math.floor((item.value - offset) / place) % 10
      variables.digit = digit
      frame('digit', `這一位的數字是 ${digit}。`, 'update', digit, index)
      buckets[digit].push(item)
      metrics.moves++
      frame('distribute', `放到桶 ${digit} 的尾端，保留同桶的先後順序。`, 'move', digit, index)
    }
    frame('value', '所有值都已分桶。', 'check')
    output = []
    frame('output', '準備從桶 0 到桶 9 依序收集。')
    for (const [index, bucket] of buckets.entries())
    {
      frame('collect', `查看桶 ${index}。`, 'update', index)
      output.push(...bucket)
      metrics.moves += bucket.length
      frame('append', `接上桶 ${index} 的 ${bucket.length} 個值。`, 'move', index)
    }
    values.splice(0, values.length, ...output)
    frame('collect', '本輪已按這一位排好。', 'check')
    place *= 10
    variables.place = place
    frame('advance', `移到位值 ${place}。`)
  }
  frame('pass', '所有需要的位數都已處理。', 'check')
  return sorted()
}
