import { useLayoutEffect, useRef } from 'react'
import type { ArrayView, Step } from '../algorithms/types'
import { StepNote } from './StepNote'
import { ElementValue } from './ElementValue'

interface Props
{
  view: ArrayView
  labels?: Readonly<Record<string, string>>
  animate?: boolean
  preview?: boolean
  step?: Step
  playing?: boolean
  follow?: boolean
}

function displayValue(value: number | boolean | null)
{
  if (value === null) return '未設定'
  if (typeof value === 'boolean') return value ? '是' : '否'
  return value
}

export function ArrayCanvas({ view, labels, animate = false, preview = false, step, playing = false, follow = false }: Props)
{
  const canvas = useRef<HTMLDivElement>(null)
  const scrollArea = useRef<HTMLDivElement>(null)
  const noteArea = useRef<HTMLDivElement>(null)
  const previousView = useRef<ArrayView | null>(null)
  const previous = useRef(new Map<string, DOMRect>())
  const motions = useRef<Animation[]>([])
  const focus = view.marked?.indices ?? [view.focusIndex]

  function positionNote(reveal = false)
  {
    const scroll = scrollArea.current
    const note = noteArea.current
    if (!scroll || !note || !scroll.clientWidth) return false
    note.removeAttribute('data-anchored')
    note.style.removeProperty('--step-anchor')
    const targets = [...scroll.querySelectorAll<HTMLElement>('[data-step-focus]')]
    if (!targets.length) return false

    const viewport = scroll.getBoundingClientRect()
    const boxes = targets.map(target => target.getBoundingClientRect())
    const first = boxes[0].left
    const last = boxes[boxes.length - 1].right
    const originalScroll = scroll.scrollLeft
    if (reveal)
    {
      if (first < viewport.left + 1) scroll.scrollLeft += first - viewport.left - 1
      else if (last > viewport.right - 1) scroll.scrollLeft += last - viewport.right + 1
    }
    const shift = scroll.scrollLeft - originalScroll
    const center = (first + last) / 2 - shift
    if (center >= viewport.left && center <= viewport.right)
    {
      note.setAttribute('data-anchored', '')
      note.style.setProperty('--step-anchor', `${center - note.getBoundingClientRect().left}px`)
    }
    return shift !== 0
  }

  useLayoutEffect(() =>
  {
    const node = canvas.current!
    if (follow && step?.kind === 'initial' && scrollArea.current) scrollArea.current.scrollLeft = 0
    const scrolled = positionNote(follow)
    const elements = [...node.querySelectorAll<HTMLElement>('[data-item-id]')]
    const positions = new Map(elements.map(element => [element.dataset.itemId!, element.getBoundingClientRect()]))
    if (animate && !scrolled && previousView.current !== view && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    {
      for (const element of elements)
      {
        const id = element.dataset.itemId!
        const from = previous.current.get(id)
        const to = positions.get(id)!
        if (!from?.width || !to.width) continue
        const x = from.x - to.x
        const y = from.y - to.y
        if (Math.abs(x) > 1 || Math.abs(y) > 1)
        {
          motions.current.push(element.animate(
            [{ transform: `translate(${x}px, ${y}px)`, zIndex: 3 }, { transform: 'none', zIndex: 3 }],
            { duration: 200, easing: 'ease-out' },
          ))
        }
      }
    }
    previousView.current = view
    previous.current = positions
    return () =>
    {
      motions.current.forEach(motion => motion.cancel())
      motions.current = []
    }
  }, [view, animate, follow, step?.kind])

  useLayoutEffect(() =>
  {
    const node = canvas.current!
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    function refresh()
    {
      positionNote()
      motions.current.forEach(motion => motion.cancel())
      motions.current = []
      previous.current = new Map([...node.querySelectorAll<HTMLElement>('[data-item-id]')]
        .map(element => [element.dataset.itemId!, element.getBoundingClientRect()]))
    }
    const observer = new ResizeObserver(refresh)
    observer.observe(node)
    const scroll = scrollArea.current
    scroll?.addEventListener('scroll', refresh)
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', refresh)
    media.addEventListener('change', refresh)
    return () =>
    {
      observer.disconnect()
      scroll?.removeEventListener('scroll', refresh)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh)
      media.removeEventListener('change', refresh)
    }
  }, [])

  return (
    <div className={`array-canvas${preview ? ' preview-canvas' : ''}`} ref={canvas}>
      {preview && <div className="canvas-heading">
        <strong>草稿預覽</strong>
        <span className="tag mono">長度 {view.cells.length}</span>
      </div>}
      {step && <div className="step-area" data-kind={step.kind} ref={noteArea}><StepNote step={step} playing={playing} /></div>}
      {view.cells.length > 0 ? (
        <div className="array-scroll" ref={scrollArea} tabIndex={0} role="region" aria-label={preview ? '草稿的索引與數值' : '陣列索引、數值與指標'}>
          <ol className="array-track">
            {view.cells.map((item, index) =>
            {
              const region = view.regions.find(range => index >= range.from && index <= range.to)
              const marked = view.marked?.indices.includes(index) ? view.marked : undefined
              const focused = !!step && focus.includes(index)
              return (
                <li className="array-position" key={index}>
                  <span className="array-index mono" aria-label={`索引 ${index}`}>{index}</span>
                  <div className={`array-slot ${region?.tone ?? ''} ${marked?.tone ?? ''}`}
                    data-step-focus={focused ? '' : undefined}>
                    {item ? <div className="array-item" key={item.id} data-item-id={item.id} data-motion-key={`array:${item.id}`}>
                      <ElementValue item={item} digit={view.digit} />
                    </div> : <span className="array-gap">空格</span>}
                  </div>
                  <div className="cell-labels">
                    {marked && <span className={`marker ${marked.tone}`}>{marked.label}</span>}
                    {focused && !marked && region?.tone !== 'settled' && <span className="marker current">目前位置</span>}
                    {region?.tone === 'settled' && (
                      <span className="marker settled"><span aria-hidden="true">✓ </span>{region.label}</span>
                    )}
                    {region && region.tone !== 'settled' && <span className={`marker ${region.tone}`}>{region.label}</span>}
                    {view.pointers.filter(pointer => pointer.index === index).map(pointer => (
                      <span className="pointer mono" key={pointer.label}>↑ {pointer.label}</span>
                    ))}
                  </div>
                </li>
              )
            })}
          </ol>
          {view.pointers.filter(pointer => pointer.index < 0 || pointer.index >= view.cells.length).map(pointer => (
            <span className="region-tag" key={pointer.label}>{pointer.label} = {pointer.index}（已超出陣列）</span>
          ))}
        </div>
      ) : <p className="empty-array">陣列目前是空的。可輸入整列資料或插入新值。</p>}
      {!preview && (
        <div className="canvas-details">
          <div className="array-regions" aria-label={view.round === undefined ? '陣列區段' : '輪次與陣列區段'}>
            {view.round !== undefined && <span className="region-tag mono">第 {view.round} 輪</span>}
            {view.regions.length ? view.regions.map(region => (
              <span className={`region-tag ${region.tone}`} key={`${region.from}:${region.to}`}>
                {region.label} <code>{region.from === region.to ? region.from : `${region.from}–${region.to}`}</code>
              </span>
            )) : <span className="region-tag">尚無區段標記</span>}
          </div>
          {view.held !== undefined && (
            <div className="held-slot">
              <span>暫存元素</span>
              {view.held ? <div className="held-item mono" data-item-id={view.held.id}>
                <strong>{view.held.value}</strong>
              </div> : <span className="muted">空</span>}
            </div>
          )}
          <dl className="variables" aria-label="目前變數">
            {Object.entries(view.variables).map(([key, value]) => (
              <div className="variable" key={key}>
                <dt><code>{key}</code> <span>{labels?.[key]}</span></dt>
                <dd className={value === null ? 'muted' : 'mono'}>{displayValue(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
