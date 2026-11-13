import { lessonTrace, order, showItem } from './lesson-trace'
import type { Algorithm, Element, Step } from './types'

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
    record(line, message, kind, {
      rows: showing ? [
        { label: '左段副本', values: left.map(showItem), active: typeof variables.i === 'number' ? variables.i : undefined },
        { label: '右段副本', values: right.map(showItem), active: typeof variables.j === 'number' ? variables.j : undefined },
        { label: '合併暫存', values: merged.map(showItem) },
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
