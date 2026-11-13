import { useCallback, useEffect, useRef, useState } from 'react'

const STEP_INTERVAL_MS = 1800

export function usePlayer(lastStep: number, visible: boolean)
{
  const [position, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [animate, setAnimate] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const index = Math.min(position, lastStep)

  const clear = useCallback(() =>
  {
    window.clearTimeout(timer.current)
    timer.current = undefined
  }, [])

  const pause = useCallback(() =>
  {
    clear()
    setPlaying(false)
  }, [clear])

  function seek(to: number, adjacent = false)
  {
    pause()
    setAnimate(adjacent)
    setIndex(Math.min(lastStep, Math.max(0, to)))
  }

  function toggle()
  {
    if (playing)
    {
      pause()
    }
    else if (visible && !document.hidden && lastStep > 0)
    {
      if (index === lastStep)
      {
        setAnimate(false)
        setIndex(0)
      }
      setPlaying(true)
    }
  }

  function changeSpeed(value: number)
  {
    clear()
    setSpeed(value)
  }

  useEffect(() =>
  {
    if (!visible) pause()
  }, [visible, pause])

  useEffect(() =>
  {
    if (position <= lastStep) return
    pause()
    setIndex(lastStep)
  }, [position, lastStep, pause])

  useEffect(() =>
  {
    if (!playing || !visible || index >= lastStep) return
    timer.current = window.setTimeout(() =>
    {
      const next = index + 1
      setAnimate(true)
      setIndex(next)
      if (next === lastStep) pause()
    }, STEP_INTERVAL_MS / speed)
    return clear
  }, [index, lastStep, speed, playing, visible, clear, pause])

  useEffect(() =>
  {
    function handleVisibility()
    {
      if (document.hidden) pause()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () =>
    {
      clear()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [clear, pause])

  return { index, playing, speed, animate, pause, seek, toggle, changeSpeed }
}

export type Player = ReturnType<typeof usePlayer>
