import type { Input, MazeInput } from '../algorithms/types'

const board = [
  '##.##',
  '##.#.',
  '.....',
  '.##.#',
  '.#...',
  'S..#G',
]
const cells = [...board.join('')]
const maze: MazeInput = {
  width: board[0].length,
  height: board.length,
  walls: cells.flatMap((cell, index) => cell === '#' ? [index] : []),
  start: cells.indexOf('S'),
  target: cells.indexOf('G'),
}

export const openMaze: Input = { items: [], maze }
export const blockedMaze: Input = { items: [], maze: { ...maze, walls: [...maze.walls, maze.target - maze.width] } }
