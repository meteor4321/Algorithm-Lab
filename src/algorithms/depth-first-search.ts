import { lessonTrace } from './lesson-trace'
import { mazeLabel, prepareMaze } from './maze'
import type { Algorithm, Result, Step } from './types'

export const traceDepthFirstSearch: Algorithm = ({ maze }) =>
{
  const { map, graph, start, target } = prepareMaze(maze)
  const { variables, metrics, record, finish } = lessonTrace([])
  const label = (cell: number) => mazeLabel(map, cell)
  const seen = new Set<number>()
  const stack: number[] = []
  let path: number[] = []
  let candidate: number | undefined
  Object.assign(variables, { start, target, node: null, neighbor: null, found: null })
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', result?: Result, backtracked?: number)
  {
    record(line, message, kind, {
      maze: { map, active: stack.at(-1), candidate, visited: [...seen], path: path.length ? path : stack, backtracked },
      rows: [
        { label: '來時路線（遞迴堆疊）', values: stack.map(label), active: stack.length - 1 },
        { label: '已走過的格子', values: [...seen].map(label) },
      ],
    }, result)
  }

  function visit(node: number): boolean
  {
    stack.push(node)
    candidate = undefined
    Object.assign(variables, { node, neighbor: null })
    seen.add(node)
    frame('mark', `走到${label(node)}，記下這格已走過。`)
    metrics.comparisons++
    frame('compare', node === target ? '這格就是終點。' : '這格還沒到終點，可以試旁邊的路。', 'compare')
    if (node === target)
    {
      path = [...stack]
      frame('hit', '從這一層回傳找到。', 'check')
      stack.pop()
      return true
    }
    for (const neighbor of graph[node])
    {
      candidate = neighbor
      variables.neighbor = neighbor
      frame('neighbor', `看看相鄰的${label(neighbor)}。`)
      frame('unvisited', seen.has(neighbor) ? '這格已經走過，改試別格。' : '這格還沒走過。', 'check')
      if (!seen.has(neighbor))
      {
        frame('descend', `沿這條路往${label(neighbor)}走。`)
        const found = visit(neighbor)
        Object.assign(variables, { node, neighbor })
        if (found)
        {
          frame('propagate', '下一層已找到目標，把結果往上一層傳。', 'check')
          stack.pop()
          return true
        }
      }
    }
    candidate = undefined
    frame('neighbor', '這格旁邊已沒有新路可走。', 'check')
    stack.pop()
    const previous = stack.at(-1)
    frame('retreat', previous === undefined ? '起點能走的路都試過了。' : `退回${label(previous)}，再看看有沒有別條路。`, 'check', undefined, node)
    return false
  }

  frame(null, '從起點沿一條路走，試著找到終點。', 'initial')
  frame('seen', '準備記錄走過的格子，避免繞圈。')
  frame('start', '從起點踏出第一步前，先記下目前位置。')
  const found = visit(start)
  Object.assign(variables, { found, node: null, neighbor: null })
  frame('result', found ? '畫布標出這次找到的路線。' : '從起點能走的路都已試完。', 'return', {
    type: 'lesson', text: found ? `這條路線共 ${path.length - 1} 步` : '無法到達終點',
  })
  return finish()
}
