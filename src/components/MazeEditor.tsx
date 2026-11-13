import { useState } from 'react'
import type { Input, MazeInput } from '../algorithms/types'
import { MazeBoard } from './MazeBoard'

const tools = [
  { id: 'wall', label: '放置／移除牆' },
  { id: 'start', label: '移動起點' },
  { id: 'target', label: '移動終點' },
] as const

export function MazeEditor({ maze, onApply, onCancel }: {
  maze: MazeInput
  onApply: (input: Input) => void
  onCancel: () => void
})
{
  const [draft, setDraft] = useState(maze)
  const [tool, setTool] = useState<typeof tools[number]['id']>('wall')

  function select(cell: number)
  {
    if (tool === 'wall')
    {
      const walls = draft.walls.includes(cell) ? draft.walls.filter(wall => wall !== cell) : [...draft.walls, cell]
      setDraft({ ...draft, walls })
    }
    else
    {
      setDraft({ ...draft, [tool]: cell, walls: draft.walls.filter(wall => wall !== cell) })
    }
  }

  function isDisabled(cell: number)
  {
    if (tool === 'wall') return cell === draft.start || cell === draft.target
    return cell === draft[tool === 'start' ? 'target' : 'start']
  }

  return (
    <div className="editor">
      <div className="canvas-heading"><strong>迷宮草稿</strong><span className="tag">{draft.height} × {draft.width} 格</span></div>
      <div className="maze-tools" role="group" aria-label="編輯工具">
        {tools.map(item => <button type="button" key={item.id} className="button small"
          aria-pressed={tool === item.id} onClick={() => setTool(item.id)}>{item.label}</button>)}
      </div>
      <p className="field-note">{tool === 'wall' ? '點格子放牆，再點一次移除。' : '點一下新位置。選到牆時，會先移除那面牆。'}</p>
      <MazeBoard view={{ map: draft }} onSelect={select} isDisabled={isDisabled} />
      <div className="editor-footer">
        <button type="button" className="button primary" onClick={() => onApply({ items: [], maze: draft })}>套用並重跑</button>
        <button type="button" className="button" onClick={onCancel}>取消</button>
      </div>
    </div>
  )
}
