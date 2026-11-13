import source from '../algorithms/core/binary-search.py?raw'
import { traceBinarySearch } from '../algorithms/binary-search'
import { input, teachingCode, type Unit } from './types'

export const binarySearchUnit: Unit =
{
  slug: 'binary-search',
  category: 'searching',
  name: '二分搜尋',
  english: 'Binary Search',
  goal: '比較候選區的中點，每次把搜尋範圍縮小約一半。',
  structure: '陣列',
  prerequisite: '陣列必須先按非遞減順序排列，允許重複值。',
  complexity: '最差 O(log n)',
  sortedInput: true,
  cards: [
    {
      title: '有順序，就能從中間找',
      text: '翻書找某一頁時，知道頁碼有順序，就能先翻開中間，看看該往哪邊找。二分搜尋也需要先把數字由小到大排好，可以有重複值。',
      show: step => step.executedLineId === 'bounds',
    },
    {
      title: '中間太小，往右找',
      text: '要找 13，先看整排中間的 7。數字已經排好，7 和它左邊的值都比 13 小，接下來只要找右半邊。',
      show: step => step.executedLineId === 'right-half',
    },
    {
      title: '在剩下的範圍再取中點',
      text: '剩下 10、13、18，再看中間就找到 13，回傳它的索引 5。如果目標值出現好幾次，就回傳這次碰到的那一格。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '中間太大，往左找',
      text: '同一排數字改找 6，第一次看到的還是 7。這回 7 和它右邊的值都太大，接下來就到左半邊重新取中點。',
      example: 1,
      show: step => step.executedLineId === 'left-half',
    },
    {
      title: '沒有格子可找，就停下來',
      text: '當左界越過右界，代表搜尋範圍已經空了，回傳 −1 表示查無結果。每輪都把範圍縮到約一半，所以資料量加倍時，最差只多找一輪（O(log n)）。',
      example: 1,
      show: step => !!step.result,
    },
  ],
  code: teachingCode(source),
  variables: { left: '左界', mid: '中點', right: '右界', target: '搜尋目標' },
  examples: [
    { label: '命中 13', input: input([-3, 1, 4, 7, 10, 13, 18], 13) },
    { label: '查無結果', input: input([-3, 1, 4, 7, 10, 13, 18], 6) },
  ],
  practice: input([-4, 0, 2, 2, 7, 12], 2),
  run: traceBinarySearch,
}
