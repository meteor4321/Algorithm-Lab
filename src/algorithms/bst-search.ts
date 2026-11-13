import { lessonTrace, order } from './lesson-trace'
import type { Algorithm, Element, Result, Step } from './types'

export function searchTree(items: readonly Element[])
{
  const tree: [number, number, number][] = []
  for (const { value } of items)
  {
    let node = 0
    while (node < tree.length)
    {
      if (value === tree[node][0]) break
      const side = value < tree[node][0] ? 1 : 2
      if (tree[node][side] < 0)
      {
        tree[node][side] = tree.length
        node = tree.length
      }
      else node = tree[node][side]
    }
    if (node === tree.length) tree.push([value, -1, -1])
  }
  return tree
}

export const traceBstSearch: Algorithm = ({ items, target }) =>
{
  if (target === undefined) throw new Error('需要搜尋目標。')
  const { variables, metrics, record, finish } = lessonTrace([])
  const tree = searchTree(items)
  const levels: number[][] = []
  const edges: [number, number][] = []
  function layout(node: number, depth: number)
  {
    const level = levels[depth] ??= []
    level.push(node)
    for (const child of tree[node].slice(1))
    {
      if (child < 0) continue
      edges.push([node, child])
      layout(child, depth + 1)
    }
  }
  layout(0, 0)
  const visited: number[] = []
  const labels = tree.map(([value]) => value)
  Object.assign(variables, { target, node: null, value: null, left: null, right: null })
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', result?: Result)
  {
    const node = variables.node as number | null
    record(line, message, kind, {
      diagram: { labels, levels, edges, visited, active: node !== null && node >= 0 ? node : undefined },
      rows: [{ label: '查找路徑', values: visited.map(id => labels[id]) }],
    }, result)
  }

  frame(null, '依輸入順序建好搜尋樹，左子樹的值較小，右子樹的值較大。', 'initial')
  let node = 0
  variables.node = node
  frame('root', '從根節點開始。')
  while (node !== -1)
  {
    frame('loop', '目前位置有節點，可以讀取它的值。', 'check')
    const [value, left, right] = tree[node]
    Object.assign(variables, { value, left, right })
    visited.push(node)
    frame('read', `讀取節點 ${node} 的值 ${value}。`)
    metrics.comparisons++
    frame('equal', `${target} ${target === value ? '=' : '≠'} ${value}，${target === value ? '找到目標。' : '接著決定走哪一側。'}`, 'compare')
    if (target === value)
    {
      frame('found', '回傳命中的節點編號。', 'return', { type: 'lesson', text: `節點 ${node} 的值為 ${value}` })
      return finish()
    }
    metrics.comparisons++
    const smaller = target < value
    frame('compare', `${target} ${order(target, value)} ${value}，接下來往${smaller ? '左' : '右'}。`, 'compare')
    node = smaller ? left : right
    variables.node = node
    frame(smaller ? 'left' : 'right', node < 0 ? '這一側沒有子節點。' : `移到節點 ${node}，其值為 ${labels[node]}。`)
  }
  frame('loop', '已走到空連結。', 'check')
  frame('miss', '查無結果，回傳 −1。', 'return', { type: 'lesson', text: `查無 ${target}` })
  return finish()
}
