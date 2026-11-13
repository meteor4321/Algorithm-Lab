import { useId, useMemo, useState } from 'react'
import type { Input } from '../algorithms/types'
import { usePlayer } from '../player/usePlayer'
import type { Unit } from '../units/types'
import { CodePanel } from './CodePanel'
import { Icon } from './Icon'
import { LessonCanvas } from './LessonCanvas'
import { MazeEditor } from './MazeEditor'
import { Playback } from './Playback'
import { PracticeEditor } from './PracticeEditor'
import { SplitPane } from './SplitPane'
import { StructuredEditor } from './StructuredEditor'

export function Experiment({ unit, initial, active, practice = false }: {
  unit: Unit
  initial: Input
  active: boolean
  practice?: boolean
})
{
  const [appliedInput, setAppliedInput] = useState<Input>()
  const [editing, setEditing] = useState(false)
  const id = useId()
  const input = appliedInput ?? initial
  const steps = useMemo(() => unit.run(input), [unit, input])
  const last = steps.length - 1
  const player = usePlayer(last, active && !editing)
  const step = steps[player.index]

  function apply(next: Input)
  {
    player.seek(0)
    setAppliedInput(next)
    setEditing(false)
  }

  return (
    <div hidden={!active}>
      <SplitPane leftId={`${id}-canvas`} rightId={`${id}-code`}
        left={<section id={`${id}-canvas`} className="experiment panel" aria-label="實驗畫布與播放控制">
          <div className="panel-heading">
            <span className={`panel-icon ${unit.category === 'sorting' ? 'mint' : 'purple'}`}><Icon name={unit.category === 'sorting' ? 'sort' : 'search'} /></span>
            <h3>{practice ? '自由練習實驗台' : '步驟觀察台'}</h3>
            {practice && !editing && <button className="button small edit-trigger" type="button" onClick={() =>
            {
              player.pause()
              setEditing(true)
            }}><Icon name="pencil" width={16} height={16} />編輯初始資料</button>}
          </div>
          {editing && (input.maze
            ? <MazeEditor maze={input.maze} onCancel={() => setEditing(false)} onApply={apply} />
            : input.text
              ? <StructuredEditor input={input} onCancel={() => setEditing(false)} onApply={apply} />
            : <PracticeEditor input={input} sorted={!!unit.sortedInput} rank={unit.rankInput}
                onCancel={() => setEditing(false)} onApply={apply} />)}
          <div className={`experiment-body${editing ? ' editing' : ''}`}>
            {editing && <p className="editing-note">上次套用的時間軸已暫停。</p>}
            <LessonCanvas view={step.view} labels={unit.variables} animate={active && !editing && player.animate}
              step={step} playing={player.playing} follow={active && !editing} />
            <Playback player={player} step={step} last={last} disabled={editing} />
          </div>
        </section>}
        right={<CodePanel unit={unit} step={step} id={`${id}-code`} />}
      />
    </div>
  )
}
