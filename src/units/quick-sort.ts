import source from '../algorithms/core/quick-sort.py?raw'
import { traceQuickSort } from '../algorithms/quick-sort'
import { input, teachingCode, type Unit } from './types'

export const quickSortUnit: Unit =
{
  slug: 'quick-sort',
  category: 'sorting',
  name: '快速排序',
  english: 'Quicksort',
  goal: '把值分到基準值兩側，再遞迴處理兩個區段。',
  structure: '陣列',
  prerequisite: '採用右端基準值的原地分區，排序不穩定。',
  complexity: '最差 O(n²)',
  cards: [
    {
      title: '先挑一張當基準',
      text: '要整理 8、2、7、1、4，可以拿最右邊的 4 當比較基準。',
      show: step => step.executedLineId === 'pivot',
    },
    {
      title: '把較小的值集中',
      text: '從左往右掃，遇到比 4 小的 2，就把它放到較小區的尾端。',
      show: step => step.executedLineId === 'move-small',
    },
    {
      title: '基準值就位後處理兩側',
      text: '把 4 移到兩區的交界，4 左側的值都比它小。接下來以同樣的方法處理左右兩段。',
      show: step => step.executedLineId === 'place',
    },
    {
      title: '短段可以直接結束',
      text: '區段至多一格就已經有序。若每輪都分得很不平均，格數加倍時，最差比較次數約變成四倍。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { left: '左界', right: '右界', pivot: '基準值', boundary: '較小區下一格', scan: '掃描索引', pivot_index: '基準值就位索引' },
  examples: [
    { label: '基準值分區', input: input([8,2,7,1,4]) },
  ],
  practice: input([4,-1,5,2,4]),
  run: traceQuickSort,
}
