import source from '../algorithms/core/bubble-sort.py?raw'
import { traceBubbleSort } from '../algorithms/bubble-sort'
import { input, teachingCode, type Unit } from './types'

export const bubbleSortUnit: Unit =
{
  slug: 'bubble-sort',
  category: 'sorting',
  name: '氣泡排序',
  english: 'Bubble Sort',
  goal: '比較相鄰的值，讓較大的元素一輪一輪移向右端。',
  structure: '陣列',
  prerequisite: '知道陣列的索引從 0 開始。',
  complexity: '最差 O(n²)',
  cards: [
    {
      title: '先看相鄰的兩個數',
      text: '想像要把五張號碼牌由小到大排好，可以先比最左邊的 5 和 3。比完一對就往右移一格，再看下一對。',
      show: step => step.executedLineId === 'inner' && step.kind === 'update',
    },
    {
      title: '左邊比較大，就交換',
      text: '第一對是 5 和 3，左邊比較大，所以交換成 3 和 5。遇到兩個相等的值就維持原順序，這就是氣泡排序的「穩定」。',
      show: step => step.kind === 'move',
    },
    {
      title: '一輪送一個最大值到右端',
      text: '照這個方法一路比較到右端，這一輪最大的 8 就到了最後一格。下一輪再從左邊開始，只比較 8 左側的格子。',
      show: step => step.executedLineId === 'inner' && step.kind === 'check',
    },
    {
      title: '每輪少比一格，直到排完',
      text: '每輪都有一個數就位，待排序的範圍只剩一格時，整列就排好了。資料量很大時，格數加倍，比較次數約變成四倍（O(n²)）。',
      show: step => !!step.result,
    },
  ],
  code: teachingCode(source),
  variables: { end: '比較右界', index: '左側索引' },
  examples: [{ label: '相鄰比較與交換', input: input([5, 3, 8, 4, 1]) }, { label: '相等不交換，維持原順序', input: input([5,3,5,1,3]) }],
  practice: input([6, 2, -1, 5, 2]),
  run: traceBubbleSort,
}
