import source from '../algorithms/core/linear-search.py?raw'
import { traceLinearSearch } from '../algorithms/linear-search'
import { input, teachingCode, type Unit } from './types'

export const linearSearchUnit: Unit =
{
  slug: 'linear-search',
  category: 'searching',
  name: '線性搜尋',
  english: 'Linear Search',
  goal: '從左到右逐格比對，找出第一個符合目標的索引。',
  structure: '陣列',
  prerequisite: '資料可以用任意順序排列。',
  complexity: '最差 O(n)',
  cards: [
    {
      title: '從最左邊開始找',
      text: '在一排沒有排序的號碼牌裡找第一個 3，可以從最左邊的 7 開始。每次記下格子的索引和值，再把這格和目標比一比。',
      show: step => step.executedLineId === 'loop' && step.view.variables.index === 0,
    },
    {
      title: '這格不同，就接著找',
      text: '第一格是 7，和要找的 3 不同，這一格就可以排除。接著迴圈會讓 index 指向下一格，用同樣的方法繼續找。',
      show: step => step.executedLineId === 'loop' && step.view.variables.index === 1,
    },
    {
      title: '找到第一個就停',
      text: '第二格就是 3，於是回傳它的索引 1。因為一路從左往右找，後面即使還有另一個 3，也已經找到最左邊的那個。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '如果一路找不到呢？',
      text: '改找 5 試試看，走到最後一格還沒找到，就回傳 −1 表示查無結果。最差得每格都看一次，所以格數加倍時，最多的比較次數也會加倍（O(n)）。',
      example: 1,
      show: step => !!step.result,
    },
  ],
  code: teachingCode(source),
  variables: { index: '檢查索引', value: '目前值', target: '搜尋目標' },
  examples: [
    { label: '命中第一個 3', input: input([7, 3, 9, 3], 3) },
    { label: '查無結果', input: input([7, 3, 9, 3], 5) },
  ],
  practice: input([8, -2, 4, 8, 1], 8),
  run: traceLinearSearch,
}
