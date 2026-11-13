import source from '../algorithms/core/kmp-search.py?raw'
import { traceKmpSearch } from '../algorithms/kmp-search'
import { teachingCode, type Unit } from './types'

export const kmpSearchUnit: Unit =
{
  slug: 'kmp-search',
  category: 'searching',
  name: 'KMP 字串搜尋',
  english: 'Knuth–Morris–Pratt',
  goal: '用前綴表保留已匹配的字元，遇到不符時直接換到可續比的位置。',
  structure: '字串與前綴表',
  prerequisite: '樣式須至少有一個字元。回傳第一個命中的字元索引。',
  complexity: 'O(n + m)',
  cards: [
    {
      title: '同一段字可以接著用',
      text: '在 ABABABAC 裡找 ABABAC。從左逐格比到第一次不符時，前面其實已經有一部分能接著用。',
    },
    {
      title: '先在樣式裡找重複',
      text: '樣式的 ABAB 開頭和結尾都有 AB，前綴表在這格記下 2。遇到不符時，就知道可以試著保留哪一段。',
      show: step => step.executedLineId === 'prefix-write' && step.view.variables.i === 3,
    },
    {
      title: '文字位置維持原處',
      text: '文字的 B 和樣式的 C 不同時，查前綴表換成較短的已匹配長度。接著用同一個文字字元繼續比。',
      show: step => step.executedLineId === 'fallback',
    },
    {
      title: '整個樣式匹配就回傳',
      text: '最後在索引 2 找到 ABABAC。建表和搜尋的操作量隨樣式及文字長度增加。',
      show: step => step.executedLineId === 'found',
    },
  ],
  code: teachingCode(source),
  variables: { i: '目前文字或建表索引', j: '已匹配長度' },
  examples: [
    { label: '前綴回退後命中', input: {"items":[],"text":{"value":"ABABABAC","pattern":"ABABAC"}} },
    { label: '查無結果', input: {"items":[],"text":{"value":"ABABABAB","pattern":"ABABAC"}} },
  ],
  practice: {"items":[],"text":{"value":"ABABABAC","pattern":"ABABAC"}},
  run: traceKmpSearch,
}
