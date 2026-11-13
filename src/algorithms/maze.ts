import type { MazeInput } from './types'

export function prepareMaze(input: MazeInput | undefined)
{
  if (!input) throw new Error('需要迷宮、起點和終點。')
  const { width, height, walls, start, target } = input
  if (![width, height].every(value => Number.isInteger(value) && value > 0 && value <= 8))
  {
    throw new Error('迷宮的寬和高須介於 1 到 8 格。')
  }
  const size = width * height
  if (![start, target, ...walls].every(cell => Number.isInteger(cell) && cell >= 0 && cell < size)
    || start === target || walls.includes(start) || walls.includes(target))
  {
    throw new Error('起點和終點須為不同的可走格子。')
  }
  const map = Object.freeze({ ...input, walls: Object.freeze([...walls]) })
  const blocked = new Set(walls)
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  const graph = Array.from({ length: size }, (_, index) =>
  {
    if (blocked.has(index)) return []
    const row = Math.floor(index / width)
    const column = index % width
    return directions.flatMap(([dy, dx]) =>
    {
      const y = row + dy
      const x = column + dx
      const next = y * width + x
      return y >= 0 && y < height && x >= 0 && x < width && !blocked.has(next) ? [next] : []
    })
  })
  return { map, graph, start, target }
}

export function mazeLabel(map: MazeInput, cell: number)
{
  if (cell === map.start) return '起點'
  if (cell === map.target) return '終點'
  return `格 ${cell}`
}
