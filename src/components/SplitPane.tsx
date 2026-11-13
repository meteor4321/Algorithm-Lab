import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const LEFT_MIN = 360
const RIGHT_MIN = 280
const DIVIDER = 12

export function SplitPane({ left, right, leftId, rightId }: { left: ReactNode; right: ReactNode; leftId: string; rightId: string })
{
  const root = useRef<HTMLDivElement>(null)
  const grabOffset = useRef(0)
  const [width, setWidth] = useState(0)
  const [ratio, setRatio] = useState(0.6)
  const available = width - DIVIDER
  const stacked = available < LEFT_MIN + RIGHT_MIN
  const max = available - RIGHT_MIN
  const leftWidth = Math.max(LEFT_MIN, Math.min(max, available * ratio))

  useLayoutEffect(() =>
  {
    const element = root.current!
    const measure = () => setWidth(element.clientWidth)
    const observer = new ResizeObserver(measure)
    measure()
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function resize(pixels: number)
  {
    setRatio(Math.max(LEFT_MIN, Math.min(max, pixels)) / available)
  }

  return (
    <div className={`split-pane${stacked ? ' stacked' : ''}`} ref={root}
      style={stacked ? undefined : { gridTemplateColumns: `${leftWidth}px ${DIVIDER}px minmax(0, 1fr)` }}>
      {left}
      {!stacked && <div className="splitter" role="separator" tabIndex={0} aria-orientation="vertical"
        aria-label="調整畫布與程式碼寬度" aria-controls={`${leftId} ${rightId}`}
        aria-valuemin={LEFT_MIN} aria-valuemax={Math.floor(max)} aria-valuenow={Math.round(leftWidth)}
        aria-valuetext={`畫布寬 ${Math.round(leftWidth)} 像素`}
        onPointerDown={event =>
        {
          if (!event.isPrimary || event.button !== 0) return
          grabOffset.current = event.clientX - event.currentTarget.getBoundingClientRect().left
          event.currentTarget.focus({ preventScroll: true })
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={event =>
        {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
          {
            resize(event.clientX - root.current!.getBoundingClientRect().left - grabOffset.current)
          }
        }}
        onKeyDown={event =>
        {
          const positions: Record<string, number> = {
            ArrowLeft: leftWidth - 24, ArrowRight: leftWidth + 24, Home: LEFT_MIN, End: max,
          }
          if (!(event.key in positions)) return
          event.preventDefault()
          resize(positions[event.key])
        }}><span /></div>}
      {right}
    </div>
  )
}
