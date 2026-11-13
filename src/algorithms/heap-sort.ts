import { lessonTrace, order } from './lesson-trace'
import type { Algorithm, Step } from './types'

export const traceHeapSort: Algorithm = ({ items }) =>
{
  const { values, variables, metrics, record, swap, finish } = lessonTrace(items)
  Object.assign(variables, { start: null, end: null, root: null, child: null, size: null })
  let size = values.length
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', root?: number, child?: number)
  {
    const levels: number[][] = []
    const edges: [number, number][] = []
    for (let index = 0; index < size; index++)
    {
      const depth = Math.floor(Math.log2(index + 1))
      ;(levels[depth] ??= []).push(index)
      if (index > 0) edges.push([Math.floor((index - 1) / 2), index])
    }
    const pointers = []
    if (root !== undefined) pointers.push({ label: 'root', index: root })
    if (child !== undefined) pointers.push({ label: 'child', index: child })
    record(line, message, kind, {
      diagram: { labels: values.slice(0, size).map(item => item.value), edges, levels, active: child ?? root },
      pointers,
      focusIndex: child ?? root,
      regions: size < values.length ? [{ from: size, to: values.length - 1, tone: 'settled', label: '已排序' }] : [],
    }, line === 'result' ? { type: 'sorted', items: Object.freeze([...values]) } : undefined)
  }

  function siftDown(root: number)
  {
    Object.assign(variables, { root, child: null, size })
    while (2 * root + 1 < size)
    {
      frame('children', '目前節點有子節點。', 'check', root)
      let child = 2 * root + 1
      variables.child = child
      frame('left-child', '先看左子節點。', 'update', root, child)
      const hasRight = child + 1 < size
      const leftValue = values[child].value
      const rightValue = values[child + 1]?.value
      if (hasRight) metrics.comparisons++
      frame('compare-children', hasRight
        ? `${leftValue} ${order(leftValue, rightValue)} ${rightValue}，選較大的子節點。`
        : '只有左子節點。', hasRight ? 'compare' : 'check', root, child)
      if (hasRight && leftValue < rightValue)
      {
        variables.child = ++child
        frame('right-child', '右子節點較大，改用右側。', 'update', root, child)
      }
      const parent = values[root].value
      const next = values[child].value
      metrics.comparisons++
      frame('compare-root', `${parent} ${order(parent, next)} ${next}，${parent >= next ? '符合最大堆順序。' : '接著交換父子。'}`, 'compare', root, child)
      if (parent >= next)
      {
        frame('settled', '這個節點已符合最大堆順序，結束下沉。', 'check', root, child)
        return
      }
      swap(root, child)
      frame('sink', '交換父子，較小的值下沉一層。', 'move', root, child)
      root = child
      variables.root = root
      frame('descend', '沿剛才下沉的位置繼續檢查。', 'update', root)
    }
    frame('children', '目前位置沒有子節點，結束下沉。', 'check', root)
  }

  frame(null, '樹形畫布呈現陣列索引的父子關係。', 'initial')
  frame('copy', '複製原始陣列。')
  for (let start = Math.floor(size / 2) - 1; start >= 0; start--)
  {
    variables.start = start
    frame('build', `從節點索引 ${start} 開始建堆。`, 'update', start)
    frame('repair', '檢查這棵子樹的父子順序。', 'update', start)
    siftDown(start)
  }
  frame('build', '最大堆已建好，根是目前最大值。', 'check', 0)
  for (let end = values.length - 1; end > 0; end--)
  {
    variables.end = end
    frame('extract', `這一輪要把最大值放到索引 ${end}。`, 'update', 0, end)
    swap(0, end)
    size = end
    frame('place-max', '最大值已就位，堆少了一格。', 'move', 0)
    frame('restore', '從根重新恢復最大堆順序。', 'update', 0)
    siftDown(0)
  }
  size = 0
  frame('extract', '每個值都已就位。', 'check')
  frame('result', '回傳升冪排列的陣列。', 'return')
  return finish()
}
