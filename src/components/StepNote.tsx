import type { Result, Step } from '../algorithms/types'

function resultText(result: Result)
{
  if (result.type === 'sorted') return `[${result.items.map(item => item.value).join(', ')}]`
  if (result.type === 'lesson') return result.text
  return result.index < 0 ? `查無 ${result.target}，回傳 −1` : `在索引 ${result.index} 找到 ${result.target}`
}

const kinds = {
  initial: '準備', check: '判斷', compare: '比較', update: '更新', move: '搬移', return: '結果',
}

export function StepNote({ step, playing }: { step: Step; playing: boolean })
{
  return (
    <div className="step-note" role={playing ? undefined : 'status'}>
      <span className="step-kind">{kinds[step.kind]}</span>
      <div>
        <p>{step.message}</p>
        {step.result && <p className="result mono">{resultText(step.result)}</p>}
      </div>
    </div>
  )
}
