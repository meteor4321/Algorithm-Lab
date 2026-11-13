import { useId } from 'react'
import type { Step } from '../algorithms/types'
import type { Player } from '../player/usePlayer'
import { Icon } from './Icon'

export function Playback({ player, step, last, disabled }: { player: Player; step: Step; last: number; disabled: boolean })
{
  const { index, playing, seek } = player
  const sliderId = useId()
  const playLabel = playing ? '暫停' : index === last ? '重播' : '播放'
  return (
    <div className="playback">
      <div className="progress-meta">
        <label htmlFor={sliderId}>第 <strong className="mono">{index}</strong> 步 <span>／ 共 {last} 步</span></label>
        <div className="metrics" aria-label="累計操作次數">
          <span>比較 <b className="mono">{step.metrics.comparisons}</b></span>
          <span>交換 <b className="mono">{step.metrics.swaps}</b></span>
          <span>位移 <b className="mono">{step.metrics.moves}</b></span>
        </div>
      </div>
      <input id={sliderId} className="timeline" aria-valuetext={`第 ${index} 步，共 ${last} 步`}
        type="range" min={0} max={last} value={index} onChange={event => seek(Number(event.target.value))} disabled={disabled} />
      <div className="play-actions">
        <div className="transport" role="group" aria-label="播放控制">
          <button type="button" className="icon-button" title="回到開始" aria-label="回到開始" disabled={disabled || index === 0} onClick={() => seek(0)}><Icon name="first" /></button>
          <button type="button" className="icon-button" title="上一步" aria-label="上一步" disabled={disabled || index === 0} onClick={() => seek(index - 1, true)}><Icon name="previous" /></button>
          <button type="button" className="button primary play-button" onClick={player.toggle} disabled={disabled}>
            <Icon name={playing ? 'pause' : index === last ? 'replay' : 'play'} />{playLabel}
          </button>
          <button type="button" className="icon-button" title="下一步" aria-label="下一步" disabled={disabled || index === last} onClick={() => seek(index + 1, true)}><Icon name="next" /></button>
          <button type="button" className="icon-button" title="跳到結果" aria-label="跳到結果" disabled={disabled || index === last} onClick={() => seek(last)}><Icon name="last" /></button>
        </div>
        <label className="speed">速度 <select value={player.speed} disabled={disabled} onChange={event => player.changeSpeed(Number(event.target.value))}>
          <option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option>
        </select></label>
      </div>
    </div>
  )
}
