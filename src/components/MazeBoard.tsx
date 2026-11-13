import type { MazeView } from '../algorithms/types'

export function MazeBoard({ view, onSelect, isDisabled }: {
  view: MazeView
  onSelect?: (cell: number) => void
  isDisabled?: (cell: number) => boolean
})
{
  const { map, active, candidate, visited = [], pending = [], path = [], backtracked } = view
  const cells = Array.from({ length: map.width * map.height }, (_, cell) =>
  {
    const wall = map.walls.includes(cell)
    const endpoint = cell === map.start ? '起點' : cell === map.target ? '終點' : undefined
    const state = cell === active ? '目前位置'
      : cell === backtracked ? '剛退回'
      : cell === candidate ? '查看中的鄰格'
      : path.includes(cell) ? '路線'
      : pending.includes(cell) ? '待查看'
      : visited.includes(cell) ? '已發現' : undefined
    const glyph = endpoint?.[0] ?? (state ? { 目前位置: '●', 剛退回: '↶', 查看中的鄰格: '？', 路線: '◆', 待查看: '待', 已發現: '✓' }[state] : '')
    const position = `第 ${Math.floor(cell / map.width) + 1} 列第 ${cell % map.width + 1} 欄`
    const label = [position, `格 ${cell}`, endpoint, state, wall ? '牆' : '可走'].filter(Boolean).join('，')
    const content = wall ? '■' : <><span className="maze-id">{cell}</span><span className="maze-symbol">{glyph}</span></>
    return onSelect
      ? <button type="button" key={cell} className="maze-cell" data-wall={wall} data-endpoint={endpoint} data-state={state}
          disabled={isDisabled?.(cell)} aria-label={label} onClick={() => onSelect(cell)}>{content}</button>
      : <div key={cell} className="maze-cell" data-wall={wall} data-endpoint={endpoint} data-state={state}
          role="img" aria-label={label}>{content}</div>
  })
  return (
    <div className="maze-board" role="group" aria-label="迷宮地圖" style={{ gridTemplateColumns: `repeat(${map.width}, minmax(0, 1fr))` }}>
      {cells}
    </div>
  )
}
