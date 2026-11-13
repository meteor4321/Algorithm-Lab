import source from '../algorithms/core/selection-sort.py?raw'
import { traceSelectionSort } from '../algorithms/selection-sort'
import { input, teachingCode, type Unit } from './types'

export const selectionSortUnit: Unit =
{
  slug: 'selection-sort',
  category: 'sorting',
  name: '選擇排序',
  english: 'Selection Sort',
  goal: '每輪從未排序區挑最小值，放到前端。',
  structure: '陣列',
  prerequisite: '索引從 0 開始。交換式選擇排序不穩定。',
  complexity: 'O(n²)',
  cards: [
    {
      title: '每輪只挑一張',
      text: '想把 7、4、9、2、5 這排號碼牌排好，先找整排最小的那張。',
    },
    {
      title: '先記住最小的位置',
      text: '從 7 開始比，遇到更小的 4 就記下它的位置，再繼續往右找。',
      show: step => step.executedLineId === 'update',
    },
    {
      title: '找完才交換',
      text: '掃完整排發現 2 最小，就把它和最左邊的 7 交換。下一輪從索引 1 開始。',
      show: step => step.executedLineId === 'swap',
    },
    {
      title: '剩一張時就完成',
      text: '最後只剩一格時，其他牌都已就位。牌數加倍時，比較次數約變成四倍。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { index: '就位索引', smallest: '目前最小的索引', scan: '掃描索引' },
  examples: [
    { label: '挑最小值', input: input([7,4,9,2,5]) },
    { label: '交換使相等值順序改變', input: input([4,4,1,5,6]) },
  ],
  practice: input([6,2,-1,5,2]),
  run: traceSelectionSort,
}
