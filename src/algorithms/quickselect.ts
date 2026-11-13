import { lessonTrace, order } from './lesson-trace'
import { partition, partitionView } from './partition'
import type { Algorithm } from './types'

export const traceQuickselect: Algorithm = ({ items, target }) =>
{
  if (!Number.isInteger(target) || target! < 1 || target! > items.length) throw new Error('排名須介於 1 與陣列長度之間。')
  const trace = lessonTrace(items)
  const { values, variables, record, finish } = trace
  Object.assign(variables, { k: target!, wanted: null, left: null, right: null, pivot: null, boundary: null, scan: null, pivot_index: null })
  record(null, `目標是第 ${target} 小的值。`, 'initial')
  record('copy', '複製原始陣列。')
  const wanted = target! - 1
  variables.wanted = wanted
  record('wanted', `排名從 1 起算，換成索引就是 ${wanted}。`)
  let left = 0
  let right = values.length - 1
  Object.assign(variables, { left, right })
  record('bounds', '候選範圍先包含整個陣列。', 'update', partitionView(left, right, [{ label: 'wanted', index: wanted }], values.length))
  while (left <= right)
  {
    const range = partitionView(left, right, [{ label: 'wanted', index: wanted }], values.length)
    record('loop', '範圍仍有候選值。', 'check', range)
    record('partition', '用分區確定一個值的最終索引。', 'update', range)
    const pivotIndex = partition(trace, left, right, () => ({ regions: partitionView(left, right, [], values.length).regions?.filter(region => region.tone === 'excluded') }))
    variables.pivot_index = pivotIndex
    const focus = partitionView(left, right, [{ label: 'pivot_index', index: pivotIndex }, { label: 'wanted', index: wanted }], values.length)
    record('hit', `${pivotIndex} ${order(pivotIndex, wanted)} ${wanted}，${pivotIndex === wanted ? '這就是指定的排名。' : '接著決定要查哪一側。'}`, 'check', focus)
    if (pivotIndex === wanted)
    {
      const value = values[pivotIndex].value
      record('result', `回傳第 ${target} 小的值。`, 'return', focus, { type: 'lesson', text: `第 ${target} 小的值是 ${value}` })
      return finish()
    }
    record('side', `${pivotIndex} ${order(pivotIndex, wanted)} ${wanted}，保留${pivotIndex < wanted ? '右' : '左'}側。`, 'check', focus)
    if (pivotIndex < wanted)
    {
      left = pivotIndex + 1
      variables.left = left
      record('right-half', `左界移到 ${left}。`, 'update', partitionView(left, right, [{ label: 'wanted', index: wanted }], values.length))
    }
    else
    {
      right = pivotIndex - 1
      variables.right = right
      record('left-half', `右界移到 ${right}。`, 'update', partitionView(left, right, [{ label: 'wanted', index: wanted }], values.length))
    }
  }
  throw new Error('有效的排名必定能找到。')
}
