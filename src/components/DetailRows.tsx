import { useLayoutEffect, useRef } from 'react'
import type { ArrayView } from '../algorithms/types'
import { ElementValue } from './ElementValue'

export function DetailRows({ view, follow }: { view: ArrayView; follow?: boolean })
{
  const root = useRef<HTMLDivElement>(null)
  const aligned = view.rows?.some(row => row.offset !== undefined)
  useLayoutEffect(() =>
  {
    if (!follow || !root.current) return
    const scrolls = aligned ? [root.current] : [...root.current.querySelectorAll<HTMLElement>('.lesson-row-values')]
    for (const scroll of scrolls)
    {
      const current = scroll.querySelector<HTMLElement>('[data-active]')
      if (!current) continue
      const box = current.getBoundingClientRect()
      const viewport = scroll.getBoundingClientRect()
      if (box.right > viewport.right) scroll.scrollLeft += box.right - viewport.right + 4
      else if (box.left < viewport.left) scroll.scrollLeft -= viewport.left - box.left + 4
    }
  }, [view, aligned, follow])
  return <div ref={root} className={`detail-rows${aligned ? ' aligned-rows' : ''}${view.rows?.some(row => row.id?.startsWith('bucket-')) ? ' bucket-rows' : ''}`} tabIndex={aligned ? 0 : undefined}>
    {view.rows?.map(row => <section className="lesson-row" data-bucket={row.id?.startsWith('bucket-') ? '' : undefined} key={row.id ?? row.label} aria-label={row.label}>
      <strong>{row.label}</strong>
      {row.note && <p className="row-note">{row.note}</p>}
      {row.values.length ? <ol className={`lesson-row-values mono${row.linked ? ' linked' : ''}`} tabIndex={0}>
        {Array.from({ length: row.offset ?? 0 }, (_, index) => <li className="alignment-gap" aria-hidden="true" key={`gap-${index}`} />)}
        {row.values.map((value, index) =>
        {
          const item = row.items?.[index]
          const regions = row.regions?.filter(region => index >= region.from && index <= region.to) ?? []
          const pointers = row.pointers?.filter(pointer => pointer.index === index) ?? []
          return <li key={item?.id ?? index} className={`detail-position ${regions.map(region => region.tone).join(' ')}`} data-active={index === row.active ? '' : undefined}>
            {row.indexed !== false && <span className="detail-index">{index}</span>}
            <div className="detail-value" data-motion-key={item ? `${row.id ?? row.label}:${item.id}` : undefined}>
              {item ? <ElementValue item={item} digit={row.digit ?? view.digit} /> : value === ' ' ? '␣' : value}
            </div>
            {index === row.active && <span className="detail-tag">目前</span>}
            {pointers.map(pointer => <span className="detail-tag" key={pointer.label}>↑ {pointer.label}</span>)}
            {regions.map(region => <span className="detail-tag" key={region.label}>{region.label}</span>)}
          </li>
        })}
        {row.pointers?.filter(pointer => pointer.index < 0 || pointer.index >= row.values.length).map(pointer => <li className="past-end" key={pointer.label}>{pointer.label} = {pointer.index}（範圍外）</li>)}
      </ol> : <p className="muted">空</p>}
    </section>)}
  </div>
}
