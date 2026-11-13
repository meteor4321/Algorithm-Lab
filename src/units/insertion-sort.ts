import source from '../algorithms/core/insertion-sort.py?raw'
import { traceInsertionSort } from '../algorithms/insertion-sort'
import { input, teachingCode, type Unit } from './types'

export const insertionSortUnit: Unit =
{
  slug: 'insertion-sort',
  category: 'sorting',
  name: '插入排序',
  english: 'Insertion Sort',
  goal: '像整理手牌一樣，把新元素插進左側已排好的區段。',
  structure: '陣列',
  prerequisite: '知道陣列的索引從 0 開始。',
  complexity: '最差 O(n²)',
  cards: [
    {
      title: '像整理手牌一樣',
      text: '想像你在整理手牌，每拿到一張新牌，就從手上排好的牌裡找個位置插進去。畫布最左邊的 4 單獨一張就算排好了，所以先從第二張開始。',
      show: step => step.executedLineId === 'outer' && step.kind === 'update',
    },
    {
      title: '拿起新牌，留出空格',
      text: '先拿起第二張牌 2，把它暫存在 key，原位就空出一格。接著從空格左邊開始找，看看哪些牌需要往右讓位。',
      show: step => step.executedLineId === 'hold',
    },
    {
      title: '比新牌大的，往右挪',
      text: '左邊的 4 比手上的 2 大，就把 4 挪進空格，空格也跟著往左移。一路往左找，直到左邊沒有牌，或遇到小於或等於 2 的牌。',
      show: step => step.executedLineId === 'shift',
    },
    {
      title: '把新牌放進空格',
      text: '把 2 放進空格，左邊的 2 和 4 就排好了。遇到相等的牌時，新牌放在舊牌後面，兩張牌的先後順序就能保留下來，這叫做「穩定」。',
      show: step => step.executedLineId === 'insert',
    },
    {
      title: '排好的部分越來越長',
      text: '每插好一張牌，左邊排好的部分就多一張，直到整列排完。如果一開始是由大到小，前面的牌每輪都得讓位，資料量大時，牌數加倍會讓比較次數約變成四倍（O(n²)）。',
      show: step => !!step.result,
    },
  ],
  code: teachingCode(source),
  variables: { index: '本輪索引', scan: '向左檢查的索引', key: '待插入值' },
  examples: [{ label: '右移與插回', input: input([4, 2, 7, 1, 3]) }],
  practice: input([7, 2, 5, 2, -3]),
  run: traceInsertionSort,
}
