import source from '../algorithms/core/rabin-karp.py?raw'
import { traceRabinKarp } from '../algorithms/rabin-karp'
import { teachingCode, type Unit } from './types'

export const rabinKarpUnit: Unit =
{
  slug: 'rabin-karp',
  category: 'searching',
  name: 'Rabin–Karp 字串搜尋',
  english: 'Rabin–Karp',
  goal: '用滾動雜湊篩選視窗，再核對可能命中的字串。',
  structure: '字串與滑動視窗',
  prerequisite: '樣式須至少有一個字元。回傳第一個命中的字元索引。',
  complexity: '最差 O(nm)',
  cards: [
    {
      title: '用等長視窗看文字',
      text: '要在 Æa 中找 a，就用一格寬的視窗。先把樣式和第一個視窗換成雜湊值。',
      show: step => step.executedLineId === 'window-hash',
    },
    {
      title: '雜湊相同還要核對',
      text: 'Æ 和 a 的雜湊剛好相同，核對原字元才知道這次是碰撞。',
      show: step => step.executedLineId === 'verify',
    },
    {
      title: '只更新離開與進來的字',
      text: '滑到下一格時，先扣除 Æ 的貢獻，再加進 a。視窗的雜湊沿用上一格的計算。',
      show: step => step.executedLineId === 'roll',
    },
    {
      title: '核對成功就回傳',
      text: '下一格確實是 a，回傳索引 1。視窗數隨文字長度增加，碰撞多時也要多做字串核對。',
      show: step => step.executedLineId === 'found',
    },
  ],
  code: teachingCode(source),
  variables: { size: '視窗長度', base: '雜湊基數', mod: '模數', weight: '最左字元權重', expected: '樣式雜湊', window: '視窗雜湊', i: '初始字元索引', start: '視窗起點' },
  examples: [
    { label: '雜湊碰撞後命中', input: {"items":[],"text":{"value":"Æa","pattern":"a"}} },
    { label: '查無結果', input: {"items":[],"text":{"value":"春天有花","pattern":"冬天"}} },
  ],
  practice: {"items":[],"text":{"value":"BANANANA","pattern":"ANA"}},
  run: traceRabinKarp,
}
