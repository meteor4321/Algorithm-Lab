import { useLayoutEffect, useRef } from 'react'
import type { Step } from '../algorithms/types'
import type { Unit } from '../units/types'
import { Icon } from './Icon'

export function CodePanel({ unit, step, id }: { unit: Unit; step: Step; id: string })
{
  const scroll = useRef<HTMLDivElement>(null)
  const rows = useRef(new Map<string, HTMLLIElement>())
  const next = unit.code.findIndex(line => line.id === step.nextLineId)
  const executed = unit.code.findIndex(line => line.id === step.executedLineId)

  function locate(lineId: string | null, center = false)
  {
    const panel = scroll.current
    const row = lineId ? rows.current.get(lineId) : undefined
    if (!panel || !row) return
    const rowBox = row.getBoundingClientRect()
    const box = panel.getBoundingClientRect()
    const top = box.top + panel.clientTop
    const bottom = top + panel.clientHeight
    if (center) panel.scrollTop += rowBox.top - top - (panel.clientHeight - rowBox.height) / 2
    else if (rowBox.top < top) panel.scrollTop -= top - rowBox.top + 8
    else if (rowBox.bottom > bottom) panel.scrollTop += rowBox.bottom - bottom + 8
  }

  useLayoutEffect(() => locate(step.nextLineId ?? step.executedLineId), [step])

  return (
    <aside className="code-panel panel" id={id} aria-label="程式碼">
      <div className="panel-heading">
        <span className="panel-icon purple"><Icon name="code" /></span>
        <h3>程式碼</h3>
        <span className="language tag mono">Python</span>
      </div>
      <div className="code-status" aria-label="目前程式碼位置">
        <button className="line-chip next-line" type="button" onClick={() => locate(step.nextLineId, true)} disabled={next < 0}>
          <span>下一行</span> <code>{next < 0 ? '—' : next + 1}</code>
        </button>
        <button className="line-chip ran-line" type="button" onClick={() => locate(step.executedLineId, true)} disabled={executed < 0}>
          <span>剛執行</span> <code>{executed < 0 ? '—' : executed + 1}</code>
        </button>
      </div>
      <div className="code-scroll" ref={scroll} tabIndex={0} role="region" aria-label={`${unit.name} Python 核心函式`}>
        <ol className="code-lines">
          {unit.code.map((line, index) => (
            <li key={index} className={`code-line${index === next ? ' is-next' : ''}${index === executed ? ' is-ran' : ''}`}
              ref={node =>
              {
                if (line.id)
                {
                  if (node) rows.current.set(line.id, node)
                  else rows.current.delete(line.id)
                }
              }}>
              <span className="line-number mono">{index + 1}</span>
              <code>{line.text.split(/\b(def|if|else|while|not|break|return|True|False|None)\b/).map((part, position) =>
                position % 2 === 1 ? <span className="code-keyword" key={position}>{part}</span> : part)}</code>
              {index === next && <span className="code-marker next-line">下一行</span>}
              {index === executed && <span className="code-marker ran-line">剛執行</span>}
            </li>
          ))}
        </ol>
      </div>
      <div className="code-foot"><Icon name="info" width={15} height={15} /> 點上方行號可定位到該行。</div>
    </aside>
  )
}
