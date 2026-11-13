import { lessonTrace } from './lesson-trace'
import { mazeLabel, prepareMaze } from './maze'
import type { Algorithm, Result, Step } from './types'

export const traceBreadthFirstSearch: Algorithm = ({ maze }) =>
{
  const { map, graph, start, target } = prepareMaze(maze)
  const { variables, metrics, record, finish } = lessonTrace([])
  const label = (cell: number) => mazeLabel(map, cell)
  const queue: number[] = []
  const seen = new Set<number>()
  const parent: number[] = []
  let path: number[] = []
  let candidate: number | undefined
  Object.assign(variables, { start, target, node: null, neighbor: null })
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', result?: Result)
  {
    const node = variables.node
    record(line, message, kind, {
      maze: { map, active: typeof node === 'number' ? node : undefined, candidate, visited: [...seen], pending: queue, path },
      rows: [
        { label: '待查看清單（佇列）', values: queue.map(label), active: queue.length ? 0 : undefined },
        { label: '各格是從哪裡來的', values: parent.flatMap((from, node) => from < 0 ? [] : [`${label(node)} ← ${label(from)}`]) },
        ...(path.length ? [{ label: '路線', values: path.map(label) }] : []),
      ],
    }, result)
  }

  frame(null, '從起點出發，找出通往終點的最短路線。', 'initial')
  queue.push(start)
  frame('queue', '將起點放入先進先出的佇列。')
  seen.add(start)
  frame('seen', '記下起點已排入清單，避免它被重複加入。')
  parent.push(...Array(graph.length).fill(-1))
  frame('parent', '先留空每格的來路紀錄，找到新格子時再填寫。')
  while (queue.length)
  {
    frame('loop', '清單上還有格子待查看。', 'check')
    const node = queue.shift()!
    variables.node = node
    frame('pop', `先查看清單最左邊的${label(node)}。`)
    metrics.comparisons++
    frame('compare', node === target ? '這格就是終點，接著沿來路找回起點。' : '這格還沒到終點，接著檢查旁邊能走的格子。', 'compare')
    if (node === target)
    {
      path.push(node)
      frame('path', '先從終點開始往回找。')
      while (parent[path.at(-1)!] !== -1)
      {
        frame('backtrack', '這格有來路紀錄，還能再往回走一步。', 'check')
        path.push(parent[path.at(-1)!])
        frame('prepend', `沿紀錄往回找到${label(path.at(-1)!)}。`)
      }
      frame('backtrack', '已回到起點。', 'check')
      path = [...path].reverse()
      frame('found', '把往回找到的路線反過來，就是從起點出發的最短路線。', 'return', {
        type: 'lesson', text: `最少 ${path.length - 1} 步到達終點`,
      })
      return finish()
    }
    for (const neighbor of graph[node])
    {
      candidate = neighbor
      variables.neighbor = neighbor
      frame('neighbor', `看看相鄰的${label(neighbor)}。`)
      frame('unvisited', seen.has(neighbor) ? '這格已加入過清單。' : '這格還沒加入過清單。', 'check')
      if (!seen.has(neighbor))
      {
        seen.add(neighbor)
        frame('discover', `記下${label(neighbor)}已發現。`)
        parent[neighbor] = node
        frame('link', `記下${label(neighbor)}是從${label(node)}走過來的。`)
        queue.push(neighbor)
        candidate = undefined
        frame('push', `把${label(neighbor)}加到待查看清單最後面。`)
      }
    }
    candidate = undefined
    frame('neighbor', '這格旁邊能走的位置都已檢查。', 'check')
  }
  frame('loop', '清單已空，從起點能到的格子都查完了。', 'check')
  frame('miss', '沒有找到通往終點的路。', 'return', { type: 'lesson', text: '無法到達終點' })
  return finish()
}
