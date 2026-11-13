import type { Diagram } from './types'

export function treeLayout(diagram: Diagram)
{
  const points = new Map<number, { x: number; y: number }>()
  const children = diagram.children
  let rank = 0
  let depthMax = 0
  if (children?.length)
  {
    function visit(node: number, depth: number)
    {
      if (node < 0) return
      const [left, right] = children![node]
      visit(left, depth + 1)
      points.set(node, { x: 40 + rank++ * 64, y: 35 + depth * 90 })
      depthMax = Math.max(depthMax, depth)
      visit(right, depth + 1)
    }
    visit(0, 0)
  }
  else
  {
    diagram.levels?.forEach((level, depth) => level.forEach((node, index) =>
    {
      points.set(node, { x: 420 * (index + 1) / (level.length + 1), y: 35 + depth * 90 })
      depthMax = Math.max(depthMax, depth)
    }))
  }
  return { points, width: Math.max(320, rank * 64 + 16), height: Math.max(180, (depthMax + 1) * 90 + 30) }
}
