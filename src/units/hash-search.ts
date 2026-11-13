import source from '../algorithms/core/hash-search.py?raw'
import { traceHashSearch } from '../algorithms/hash-search'
import { input, teachingCode, type Unit } from './types'

export const hashSearchUnit: Unit =
{
  slug: 'hash-search',
  category: 'searching',
  name: '雜湊查找',
  english: 'Hash Table Lookup',
  goal: '先算出目標所屬的桶，再逐項核對同桶的值。',
  structure: '陣列與鏈結雜湊桶',
  prerequisite: '用除以 5 的非負餘數建表。重複值回傳原陣列第一個命中的索引。',
  complexity: '查找最差 O(n)',
  cards: [
    {
      title: '像用分格收納盒找物品',
      text: '像先把物品放進有編號的收納盒，再用同樣規則查找。資料先依除以 5 的餘數建表：6、11、16 都進桶 1，4 進桶 4；不同值落在同桶叫碰撞。本單元從建好的表開始，箭頭表示桶內查看的先後。',
    },
    {
      title: '用同一個規則找桶',
      text: '要找 16，就先算它除以 5 的餘數 1，接下來只看桶 1。',
      show: step => step.executedLineId === 'bucket',
    },
    {
      title: '碰撞後逐一核對',
      text: '在桶 1 先看到 6，和 16 不相等就繼續找。找到 16 時回傳它在原陣列的索引。',
      show: step => step.executedLineId === 'compare',
    },
    {
      title: '桶查完就能確定結果',
      text: '改找同樣落在桶 1 的 21，查完整桶仍沒有就回傳 −1。若大量值集中在同一桶，比較次數會隨該桶的長度增加。',
      example: 1,
      show: step => step.executedLineId === 'miss',
    },
  ],
  code: teachingCode(source),
  variables: { target: '搜尋目標', bucket: '桶索引', index: '原陣列索引', value: '目前值' },
  examples: [
    { label: '碰撞後命中', input: input([6,11,16,4], 16) },
    { label: '碰撞但查無', input: input([6,11,16,4], 21) },
    { label: '分布在多個桶', input: input([10,6,12,8,4,11,17,23], 17) },
    { label: '目標落在空桶', input: input([5,10,6,11,4,9], 3) },
  ],
  practice: input([6,11,-4,9,5], -4),
  run: traceHashSearch,
}
