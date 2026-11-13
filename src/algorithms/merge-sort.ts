import { lessonTrace, order, showItem } from './lesson-trace'
import type { Algorithm, Element, Region, Step } from './types'

export const traceMergeSort: Algorithm = ({ items }) =>
{
  const { values, variables, metrics, record, sorted } = lessonTrace(items)
  Object.assign(variables, { width: null, start: null, i: null, j: null })
  let left: Element[] = []
  let right: Element[] = []
  let merged: Element[] = []
  let showing = false
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update')
  {
    const start = Number(variables.start)
    const regions: Region[] = showing ? [
      { from: start, to: start + left.length - 1, tone: 'prefix', label: '左段來源' },
      { from: start + left.length, to: start + left.length + right.length - 1, tone: 'suffix', label: '右段來源' },
    ].filter(region => region.from <= region.to) as Region[] : []
    record(line, message, kind, {
      regions,
      annotation: '左右副本各有自己的索引 i、j；已取用的值保留在副本中，以灰底標記。合併暫存完成後整段寫回。',
      rows: showing ? [
        { id: 'left', label: '左段副本', values: left.map(showItem), items: left, pointers: [{ label: 'i', index: Number(variables.i) }], regions: [{ from: 0, to: Number(variables.i) - 1, tone: 'excluded', label: '已取用' }, { from: Number(variables.i), to: Number(variables.i), tone: kind === 'move' ? 'move' : 'compare', label: 'i 指向' }] },
        { id: 'right', label: '右段副本', values: right.map(showItem), items: right, pointers: [{ label: 'j', index: Number(variables.j) }], regions: [{ from: 0, to: Number(variables.j) - 1, tone: 'excluded', label: '已取用' }, { from: Number(variables.j), to: Number(variables.j), tone: kind === 'move' ? 'move' : 'compare', label: 'j 指向' }] },
        { id: 'merged', label: '合併暫存', values: merged.map(showItem), items: merged, active: merged.length - 1 },
      ] : undefined,
      focusIndex: showing && typeof variables.start === 'number' ? variables.start : undefined,
    })
  }

  frame(null, '每一格先視為一段有序資料。', 'initial')
  frame('copy', '複製原始陣列。')
  let width = 1
  variables.width = width
  frame('width', '先合併相鄰的兩個單格。')
  while (width < values.length)
  {
    frame('pass', `這一輪每段最多有 ${width} 格。`, 'check')
    for (let start = 0; start < values.length; start += 2 * width)
    {
      showing = false
      variables.start = start
      frame('block', `從索引 ${start} 取出相鄰兩段。`)
      left = values.slice(start, start + width)
      showing = true
      right = []
      merged = []
      frame('left', '取出左段的副本。')
      right = values.slice(start + width, start + 2 * width)
      frame('right', '取出右段的副本。')
      frame('temp', '準備空的合併暫存區。')
      let i = 0
      let j = 0
      Object.assign(variables, { i, j })
      frame('cursors', '兩個指標都從各自區段的第一格開始。')
      while (i < left.length && j < right.length)
      {
        frame('merge', '兩段都還有待合併的值。', 'check')
        const a = left[i].value
        const b = right[j].value
        metrics.comparisons++
        frame('compare', `${a} ${order(a, b)} ${b}，先取${a <= b ? '左' : '右'}段。`, 'compare')
        if (a <= b)
        {
          merged.push(left[i])
          metrics.moves++
          frame('take-left', '把左段目前值放到暫存尾端。', 'move')
          variables.i = ++i
          frame('next-left', '左段指標前進一格。')
        }
        else
        {
          merged.push(right[j])
          metrics.moves++
          frame('take-right', '把右段目前值放到暫存尾端。', 'move')
          variables.j = ++j
          frame('next-right', '右段指標前進一格。')
        }
      }
      frame('merge', '至少一段已取完，剩餘值可以依序接上。', 'check')
      merged.push(...left.slice(i))
      metrics.moves += left.length - i
      frame('rest-left', `接上左段剩下的 ${left.length - i} 格。`)
      merged.push(...right.slice(j))
      metrics.moves += right.length - j
      frame('rest-right', `接上右段剩下的 ${right.length - j} 格。`)
      values.splice(start, merged.length, ...merged)
      metrics.moves += merged.length
      frame('write', '把合併好的這一段寫回陣列。', 'move')
    }
    showing = false
    frame('block', '本輪相鄰區段都已處理。', 'check')
    width *= 2
    variables.width = width
    frame('grow', `下一輪的區段寬度加倍為 ${width}。`)
  }
  frame('pass', '區段已涵蓋整列，完成合併。', 'check')
  return sorted()
}
