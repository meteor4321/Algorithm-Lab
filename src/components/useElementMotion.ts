import { useLayoutEffect, useRef } from 'react'
import type { ArrayView } from '../algorithms/types'

function position(view: ArrayView, key: string)
{
  const [location, id] = key.split(':')
  return (location === 'array' ? view.cells : view.rows?.find(row => (row.id ?? row.label) === location)?.items)?.findIndex(item => item?.id === id)
}

// A location identifies a rendered copy; the element ID identifies the whole number.
export function useElementMotion(view: ArrayView, index: number | undefined, animate: boolean, playing: boolean)
{
  const container = useRef<HTMLDivElement>(null)
  const previous = useRef<{ index: number | undefined; view: ArrayView; boxes: Map<string, DOMRect> }>(undefined)
  useLayoutEffect(() =>
  {
    const root = container.current
    if (!root) return
    const nodes = [...root.querySelectorAll<HTMLElement>('[data-motion-key]')]
    const boxes = new Map(nodes.map(node => [node.dataset.motionKey!, node.getBoundingClientRect()]))
    const before = previous.current
    previous.current = { index, view, boxes }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!animate || media.matches || index === undefined || before?.index === undefined || Math.abs(index - before.index) !== 1) return
    const backwards = index < before.index
    const transfer = backwards ? before.view.transfer : view.transfer
    const cleanups: (() => void)[] = []
    for (const node of nodes)
    {
      const key = node.dataset.motionKey!
      const id = key.slice(key.indexOf(':') + 1)
      const destination = backwards ? transfer?.from : transfer?.to
      const source = backwards ? transfer?.to : transfer?.from
      const fromKey = transfer?.ids.includes(id) && key === `${destination}:${id}` ? `${source}:${id}` : key
      if (fromKey === key && position(before.view, key) === position(view, key)) continue
      const from = before.boxes.get(fromKey)
      const to = boxes.get(key)!
      if (!from?.width || !to.width || (Math.abs(from.x - to.x) < 1 && Math.abs(from.y - to.y) < 1)) continue
      const ghost = node.cloneNode(true) as HTMLElement
      ghost.removeAttribute('data-motion-key')
      ghost.setAttribute('aria-hidden', 'true')
      ghost.classList.add('element-flight')
      Object.assign(ghost.style, { position: 'fixed', left: `${to.x}px`, top: `${to.y}px`, width: `${to.width}px`, height: `${to.height}px`, zIndex: '1000', pointerEvents: 'none' })
      document.body.append(ghost)
      node.style.visibility = 'hidden'
      const animation = ghost.animate([
        { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px)` },
        { transform: 'translate(0, 0)' },
      ], { duration: 420, easing: 'ease-in-out' })
      const cleanup = () =>
      {
        animation.cancel()
        ghost.remove()
        node.style.removeProperty('visibility')
      }
      animation.onfinish = cleanup
      cleanups.push(cleanup)
    }
    const cancel = () => cleanups.forEach(cleanup => cleanup())
    media.addEventListener('change', cancel)
    window.addEventListener('resize', cancel)
    window.addEventListener('scroll', cancel, true)
    document.addEventListener('visibilitychange', cancel)
    return () =>
    {
      cancel()
      media.removeEventListener('change', cancel)
      window.removeEventListener('resize', cancel)
      window.removeEventListener('scroll', cancel, true)
      document.removeEventListener('visibilitychange', cancel)
    }
  }, [view, index, animate, playing])
  return container
}
