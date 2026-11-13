import type { ArrayView, Diagram, Step } from '../algorithms/types'
import { ArrayCanvas } from './ArrayCanvas'
import { MazeBoard } from './MazeBoard'
import { StepNote } from './StepNote'

export function GraphDiagram({ diagram }: { diagram: Diagram })
{
  const { labels, edges, levels, active, visited = [], path = [] } = diagram
  const height = levels ? Math.max(160, levels.length * 54) : 232
  const points = new Map<number, { x: number; y: number }>()
  if (levels)
  {
    levels.forEach((level, depth) =>
    {
      level.forEach((node, index) => points.set(node, { x: 320 * (index + 1) / (level.length + 1), y: 25 + depth * 54 }))
    })
  }
  else
  {
    labels.forEach((_, index) =>
    {
      const angle = index * 2 * Math.PI / labels.length - Math.PI / 2
      points.set(index, { x: 160 + Math.cos(angle) * 109, y: 116 + Math.sin(angle) * 85 })
    })
  }
  const selectedEdges = new Set(path.slice(1).map((node, index) => [path[index], node].sort((a, b) => a - b).join(':')))
  return (
    <svg className="lesson-diagram" viewBox={`0 0 320 ${height}`} role="img" aria-label="節點與連線">
      <desc>{edges.map(([a, b]) => `${labels[a]} 到 ${labels[b]}`).join('、')}</desc>
      {edges.map(([from, to]) =>
      {
        const a = points.get(from)!
        const b = points.get(to)!
        const selected = selectedEdges.has([from, to].sort((left, right) => left - right).join(':'))
        return <line key={`${from}:${to}`} className={selected ? 'path' : ''} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      })}
      {labels.map((label, node) =>
      {
        const { x, y } = points.get(node)!
        const state = active === node ? 'active' : path.includes(node) ? 'path' : visited.includes(node) ? 'visited' : ''
        return (
          <g className={state} key={node}>
            <title>{`節點 ${label}${active === node ? '，目前位置' : visited.includes(node) ? '，已走訪' : ''}`}</title>
            <circle cx={x} cy={y} r={17} />
            <text x={x} y={y} dy=".35em" textAnchor="middle">{label}</text>
          </g>
        )
      })}
    </svg>
  )
}

export function LessonCanvas({ view, labels, step, playing, animate, follow }: {
  view: ArrayView
  labels: Readonly<Record<string, string>>
  step?: Step
  playing?: boolean
  animate?: boolean
  follow?: boolean
})
{
  if (!view.rows && !view.diagram && !view.maze)
  {
    return <ArrayCanvas view={view} labels={labels} step={step} playing={playing} animate={animate} follow={follow} />
  }
  if (view.maze && !step)
  {
    const queue = view.rows?.[0]
    return (
      <div className="lesson-canvas">
        <MazeBoard view={view.maze} />
        {view.maze.pending?.length ? <p className="field-note">待查看清單：{queue?.values.join(' → ')}</p> : null}
      </div>
    )
  }
  return (
    <div className="lesson-canvas">
      {view.cells.length ? (
        <ArrayCanvas view={view} labels={labels} step={step} playing={playing} animate={animate} follow={follow} />
      ) : (
        <div className="array-canvas">
          {step && <div className="step-area" data-kind={step.kind}><StepNote step={step} playing={!!playing} /></div>}
          {view.diagram && <GraphDiagram diagram={view.diagram} />}
          {view.maze && <>
            <MazeBoard view={view.maze} />
            <p className="field-note">■ 牆　● 目前位置　？正在查看　待 待查看　✓ 已發現　◆ 路線　↶ 剛退回</p>
          </>}
          {view.diagram?.active !== undefined && <p className="field-note">目前節點 {view.diagram.labels[view.diagram.active]}</p>}
          {Object.keys(view.variables).length > 0 && <dl className="variables" aria-label="目前變數">
            {Object.entries(view.variables).map(([key, value]) => (
              <div className="variable" key={key}>
                <dt><code>{key}</code> <span>{labels[key]}</span></dt>
                <dd className="mono">{value === null ? '未設定' : typeof value === 'boolean' ? value ? '是' : '否' : value}</dd>
              </div>
            ))}
          </dl>}
        </div>
      )}
      {view.cells.length > 0 && view.diagram && <GraphDiagram diagram={view.diagram} />}
      {view.rows?.map(row => (
        <section className="lesson-row" key={row.label} aria-label={row.label}>
          <strong>{row.label}</strong>
          {row.values.length ? (
            <ol className="lesson-row-values mono" tabIndex={0}>
              {row.values.map((value, index) => <li key={index} data-active={index === row.active ? '' : undefined}>
                {index === row.active && <span className="sr-only">目前位置 </span>}{value === ' ' ? '␣' : value}
              </li>)}
            </ol>
          ) : <p className="muted">空</p>}
        </section>
      ))}
    </div>
  )
}
