import { lessonTrace } from './lesson-trace'
import type { Algorithm, Result, Step } from './types'

export const traceRabinKarp: Algorithm = ({ text }) =>
{
  if (!text?.pattern) throw new Error('需要非空的搜尋樣式。')
  const letters = [...text.value]
  const pattern = [...text.pattern]
  const { variables, metrics, record, finish } = lessonTrace([])
  Object.assign(variables, { size: null, base: null, mod: null, weight: null, expected: null, window: null, i: null, start: null })
  const size = pattern.length
  let windowValues: string[] = []
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', result?: Result)
  {
    const active = variables.start ?? variables.i
    record(line, message, kind, {
      rows: [
        { label: '文字', values: letters, active: typeof active === 'number' ? active : undefined },
        { label: '搜尋樣式', values: pattern },
        { label: '目前視窗', values: windowValues },
      ],
    }, result)
  }

  const miss = { type: 'lesson', text: `查無「${text.pattern}」` } as const
  frame(null, '用等長的視窗掃過文字，先比雜湊，再確認字元。', 'initial')
  variables.size = size
  frame('size', `視窗長度設為樣式長度 ${size}。`)
  frame('fits', size > letters.length ? '樣式比文字長，沒有可比對的視窗。' : '文字至少有一個完整視窗。', 'check')
  if (size > letters.length)
  {
    frame('too-long', '查無結果，回傳 −1。', 'return', miss)
    return finish()
  }
  const base = 257
  const mod = 101
  const remainder = (value: number) => ((value % mod) + mod) % mod
  const code = (char: string) => char.codePointAt(0)!
  Object.assign(variables, { base, mod })
  frame('parameters', '用基數 257 和模數 101 計算雜湊。')
  let weight = 1
  for (let i = 1; i < size; i++) weight = remainder(weight * base)
  variables.weight = weight
  frame('weight', `最左字元的權重取餘數後是 ${weight}。`)
  let expected = 0
  let window = 0
  Object.assign(variables, { expected, window })
  frame('initialize', '樣式和視窗的雜湊值都從 0 開始。')
  for (let i = 0; i < size; i++)
  {
    variables.i = i
    frame('init-loop', `處理第 ${i} 個字元。`)
    variables.expected = expected = remainder(expected * base + code(pattern[i]))
    frame('pattern-hash', `加入樣式字元「${pattern[i]}」，雜湊變成 ${expected}。`)
    variables.window = window = remainder(window * base + code(letters[i]))
    windowValues.push(letters[i])
    frame('window-hash', `加入文字字元「${letters[i]}」，雜湊變成 ${window}。`)
  }
  frame('init-loop', '第一個視窗的雜湊已完成。', 'check')
  for (let start = 0; start <= letters.length - size; start++)
  {
    variables.start = start
    frame('window-loop', `檢查起點為 ${start} 的視窗。`)
    metrics.comparisons++
    frame('hash-match', `${window} ${window === expected ? '=' : '≠'} ${expected}，${window === expected ? '接著核對原字串。' : '可以跳到下一個視窗。'}`, 'compare')
    if (window === expected)
    {
      const same = windowValues.join('') === text.pattern
      metrics.comparisons++
      frame('verify', same ? '原字串相同，確認命中。' : '原字串不同，兩段文字的雜湊發生碰撞。', 'compare')
      if (same)
      {
        frame('found', '回傳目前視窗的開始索引。', 'return', { type: 'lesson', text: `在字元索引 ${start} 找到「${text.pattern}」` })
        return finish()
      }
    }
    frame('more', start + size < letters.length ? '右邊還有字元，可以滑動視窗。' : '已到最後一個視窗。', 'check')
    if (start + size < letters.length)
    {
      variables.window = window = remainder(window - code(letters[start]) * weight)
      windowValues = windowValues.slice(1)
      frame('remove', `移除最左邊的「${letters[start]}」及其雜湊貢獻。`)
      const next = letters[start + size]
      variables.window = window = remainder(window * base + code(next))
      windowValues.push(next)
      frame('roll', `接上「${next}」後，新視窗的雜湊是 ${window}。`)
    }
  }
  frame('window-loop', '所有視窗都已檢查。', 'check')
  frame('miss', '查無結果，回傳 −1。', 'return', miss)
  return finish()
}
