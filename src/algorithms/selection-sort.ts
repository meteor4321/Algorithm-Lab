import { lessonTrace, order } from './lesson-trace'
import type { Algorithm, Step } from './types'

export const traceSelectionSort: Algorithm = ({ items }) =>
{
  const { values, variables, metrics, record, swap, sorted } = lessonTrace(items)
  Object.assign(variables, { index: null, smallest: null, scan: null })
  let settled = 0
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', active: string[] = [])
  {
    const pointers = active.map(label => ({ label, index: variables[label] as number }))
    record(line, message, kind, {
      pointers,
      focusIndex: pointers.at(-1)?.index,
      regions: settled ? [{ from: 0, to: settled - 1, tone: 'settled', label: '已排序' }] : [],
    })
  }

  frame(null, '從未排序區挑出最小值，放到這一輪的起點。', 'initial')
  frame('copy', '先複製陣列，接著在副本上排序。')
  for (let index = 0; index < values.length - 1; index++)
  {
    variables.index = index
    frame('outer', `這一輪要把最小值放到索引 ${index}。`, 'update', ['index'])
    let smallest = index
    variables.smallest = smallest
    frame('smallest', `先把 ${values[smallest].value} 當成目前最小值。`, 'update', ['index', 'smallest'])
    for (let scan = index + 1; scan < values.length; scan++)
    {
      variables.scan = scan
      frame('scan', `查看索引 ${scan} 的值。`, 'update', ['smallest', 'scan'])
      const value = values[scan].value
      const best = values[smallest].value
      metrics.comparisons++
      frame('compare', `${value} ${order(value, best)} ${best}，${value < best ? '下一步更新最小值。' : '保留目前最小值。'}`, 'compare', ['smallest', 'scan'])
      if (value < best)
      {
        smallest = scan
        variables.smallest = smallest
        frame('update', `最小值的位置更新為 ${smallest}。`, 'update', ['index', 'smallest'])
      }
    }
    frame('scan', '未排序區已全部比過。', 'check', ['index', 'smallest'])
    frame('needs-swap', smallest === index ? '最小值已在正確位置。' : '最小值在後面，下一步將它換到前端。', 'check', ['index', 'smallest'])
    if (smallest !== index)
    {
      swap(index, smallest)
      settled = index + 1
      frame('swap', `交換後，索引 ${index} 已就位。`, 'move', ['index', 'smallest'])
    }
    settled = index + 1
  }
  frame('outer', '剩下的元素已就位。', 'check')
  return sorted()
}
