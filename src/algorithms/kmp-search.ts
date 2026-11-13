import { lessonTrace } from './lesson-trace'
import type { Algorithm, Result, Step } from './types'

export const traceKmpSearch: Algorithm = ({ text }) =>
{
  if (!text?.pattern) throw new Error('需要非空的搜尋樣式。')
  const letters = [...text.value]
  const pattern = [...text.pattern]
  const prefix: number[] = []
  const { variables, metrics, record, finish } = lessonTrace([])
  Object.assign(variables, { i: null, j: null })
  let building = true
  let i = 0
  let j = 0
  function frame(line: string | null, message: string, kind: Step['kind'] = 'update', result?: Result)
  {
    record(line, message, kind, {
      rows: [
        { label: '文字', values: letters, active: building ? undefined : i },
        { label: '搜尋樣式', values: pattern, active: building ? i : j },
        { label: '前綴表', values: prefix, active: building ? i : j - 1 },
      ],
    }, result)
  }

  frame(null, '先在樣式裡找可重用的前綴，再比對文字。', 'initial')
  prefix.push(...Array(pattern.length).fill(0))
  frame('prefix', '前綴表各格先填 0。')
  variables.j = j
  frame('prefix-reset', '目前可重用的前綴長度是 0。')
  variables.i = i = 1
  frame('prefix-start', '長度為 1 的樣式沒有較短的非空前綴，從第二格開始。')
  while (i < pattern.length)
  {
    frame('prefix-loop', `計算樣式索引 ${i} 的前綴長度。`, 'check')
    const same = pattern[i] === pattern[j]
    metrics.comparisons++
    frame('prefix-compare', `「${pattern[i]}」 ${same ? '=' : '≠'} 「${pattern[j]}」，${same ? '前綴可以再長一格。' : '檢查能否改用更短的前綴。'}`, 'compare')
    if (same)
    {
      variables.j = ++j
      frame('prefix-grow', `可重用的前綴長度增為 ${j}。`)
      prefix[i] = j
      frame('prefix-write', `前綴表第 ${i} 格記下 ${j}。`)
      variables.i = ++i
      frame('prefix-next', '往下一格繼續建表。')
    }
    else
    {
      frame('prefix-can-fallback', j > 0 ? '還有已知的較短前綴可試。' : '目前前綴長度為 0。', 'check')
      if (j > 0)
      {
        variables.j = j = prefix[j - 1]
        frame('prefix-fallback', `改用長度 ${j} 的前綴，繼續比同一格。`)
      }
      else
      {
        variables.i = ++i
        frame('prefix-skip', '這格的前綴長度維持 0，往下一格繼續。')
      }
    }
  }
  frame('prefix-loop', '前綴表已建好。', 'check')
  building = false
  i = j = 0
  Object.assign(variables, { i, j })
  frame('cursors', '文字和樣式的指標從第一個字元開始。')
  while (i < letters.length)
  {
    frame('loop', `繼續比對文字索引 ${i}。`, 'check')
    const same = letters[i] === pattern[j]
    metrics.comparisons++
    frame('compare', `「${letters[i]}」 ${same ? '=' : '≠'} 「${pattern[j]}」，${same ? '兩個指標可以前進。' : '檢查已匹配的前綴。'}`, 'compare')
    if (same)
    {
      variables.i = ++i
      frame('next-text', '文字指標前進。')
      variables.j = ++j
      frame('next-pattern', '樣式指標前進。')
      frame('complete', j === pattern.length ? '整個樣式已比對成功。' : '樣式還有字元待查。', 'check')
      if (j === pattern.length)
      {
        frame('found', '用文字指標減去樣式長度，得到開始索引。', 'return', { type: 'lesson', text: `在字元索引 ${i - j} 找到「${text.pattern}」` })
        return finish()
      }
    }
    else
    {
      frame('can-fallback', j > 0 ? '有已匹配的字元，可查前綴表。' : '樣式第一個字元就不相符。', 'check')
      if (j > 0)
      {
        variables.j = j = prefix[j - 1]
        frame('fallback', `保留 ${j} 個已匹配字元，文字指標維持原位。`)
      }
      else
      {
        variables.i = ++i
        frame('skip', '移到下一個文字字元。')
      }
    }
  }
  frame('loop', '已檢查完整段文字。', 'check')
  frame('miss', '查無結果，回傳 −1。', 'return', { type: 'lesson', text: `查無「${text.pattern}」` })
  return finish()
}
