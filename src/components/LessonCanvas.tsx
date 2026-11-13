import { treeLayout } from '../algorithms/tree-layout'
import type { ArrayView, Diagram, Step } from '../algorithms/types'
import { ArrayCanvas } from './ArrayCanvas'
import { MazeBoard } from './MazeBoard'
import { StepNote } from './StepNote'
import { DetailRows } from './DetailRows'
import { useElementMotion } from './useElementMotion'

export function GraphDiagram({ diagram }: { diagram: Diagram })
{
  const { labels, edges, active, visited = [], path = [] } = diagram
  const { points, width, height } = treeLayout(diagram)
  const empty = diagram.emptyLink
  const parent = empty && points.get(empty.parent)
  return <div className="tree-scroll" tabIndex={0} aria-label="樹的節點、編號與左右連結">
    <svg className="lesson-diagram" style={{ minWidth: width }} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="節點與左右連線">
      {edges.map(([from, to]) =>
      {
        const a = points.get(from)!
        const b = points.get(to)!
        const side = diagram.children?.[from][0] === to ? '左' : '右'
        return <g key={`${from}:${to}`}>
          <line className={visited.includes(from) && visited.includes(to) ? 'path' : ''} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          <text className="edge-label" x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 5}>{side}</text>
        </g>
      })}
      {labels.map((label, node) =>
      {
        const point = points.get(node)
        if (!point) return null
        const roles = diagram.roles?.filter(role => role.node === node) ?? []
        return <g className={active === node ? 'active' : path.includes(node) ? 'path' : visited.includes(node) ? 'visited' : ''} key={node}>
          <circle cx={point.x} cy={point.y} r={20} />
          <text x={point.x} y={point.y} dy=".35em" textAnchor="middle">{label}</text>
          <text className="node-id" x={point.x} y={point.y + 34} textAnchor="middle">索引 {node}{roles.length ? ` · ${roles.map(role => role.label).join(' / ')}` : ''}</text>
        </g>
      })}
      {empty && parent && <g className="empty-link">
        <line x1={parent.x} y1={parent.y} x2={parent.x + (empty.side === 'left' ? -24 : 24)} y2={parent.y + 48} />
        <text x={parent.x} y={parent.y + 67} textAnchor="middle">{empty.side === 'left' ? '左' : '右'} → 空（−1）</text>
      </g>}
    </svg>
    <p className="field-note">圓內是值，下方是索引。藍框是目前位置，綠色是已讀取的節點。</p>
  </div>
}

export function LessonCanvas({ view, labels, step, stepIndex, playing, animate, follow }: {
  view: ArrayView
  labels: Readonly<Record<string, string>>
  step?: Step
  stepIndex?: number
  playing?: boolean
  animate?: boolean
  follow?: boolean
})
{
  const container = useElementMotion(view, stepIndex, !!animate, !!playing)
  if (!view.rows && !view.diagram && !view.maze)
  {
    return <ArrayCanvas view={view} labels={labels} step={step} playing={playing} animate={animate} follow={follow} />
  }

  return (
    <div className="lesson-canvas" ref={container}>
      {view.annotation && <p className="canvas-annotation">{view.annotation}</p>}
      {view.cells.length ? (
        <ArrayCanvas view={view} labels={labels} step={step} playing={playing} animate={false} follow={follow} />
      ) : (
        <div className="array-canvas">
          {step && <div className="step-area" data-kind={step.kind}><StepNote step={step} playing={!!playing} /></div>}
          {view.diagram && <GraphDiagram diagram={view.diagram} />}
          {view.maze && <>
            <MazeBoard view={view.maze} />
            <p className="field-note">■ 牆　● 目前位置　？正在查看　待 待查看　✓ 已發現　◆ 路線　↶ 剛退回</p>
          </>}
          {view.diagram?.active !== undefined && <p className="field-note">目前節點索引 {view.diagram.active}，值 {view.diagram.labels[view.diagram.active]}</p>}
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
      <DetailRows view={view} follow={follow} />
    </div>
  )
}
