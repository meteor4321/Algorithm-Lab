import source from '../algorithms/core/merge-sort.py?raw'
import { traceMergeSort } from '../algorithms/merge-sort'
import { input, teachingCode, type Unit } from './types'

export const mergeSortUnit: Unit =
{
  slug: 'merge-sort',
  category: 'sorting',
  name: '合併排序',
  english: 'Merge Sort',
  goal: '把相鄰的小有序段，逐輪合成較長的有序段。',
  structure: '陣列與合併暫存區',
  prerequisite: '每格可先視為一段有序資料。等值先取左段，因此排序穩定。',
  complexity: 'O(n log n)',
  cards: [
    {
      title: '先把每一格當成排好的小段',
      text: '5、2、8、1、4 還沒排好，但單獨一格不需要排序。先把相鄰兩段各複製出來，用另一列暫存合併結果；原陣列等合完才改寫。',
      show: step => step.executedLineId === 'cursors',
    },
    {
      title: '只比兩段還沒取走的第一格',
      text: '第一對是 5 和 2，2 較小，先放進合併暫存。i 和 j 是左右副本各自的索引；主陣列上的顏色標出它們原來的位置。',
      show: step => step.executedLineId === 'take-right',
    },
    {
      title: '一邊用完，另一邊直接接上',
      text: '右段只有 2，取完後不必再比較，把左段剩下的 5 接上。暫存是 2、5，現在整段寫回原陣列。',
      show: step => step.executedLineId === 'write',
    },
    {
      title: '兩段變長，仍只比較段首',
      text: '下一輪左段是 2、5，右段是 1、8。先取 1，再取 2，接著比較 5 和 8；每次只移動剛取值那一側的指標，另一側留著下次比。',
      show: step => step.executedLineId === 'compare' && step.view.variables.width === 2 && step.view.variables.i === 1 && step.view.variables.j === 1,
    },
    {
      title: '剩下半段也不會遺漏',
      text: '五格無法整齊兩兩配對，最右邊的 4 有時沒有右段可配。空段不參與比較，直接保留另一段；最後再把 2、5、1、8 整理出的四格和 4 合併。',
      show: step => step.executedLineId === 'right' && step.view.variables.start === 4 && step.view.variables.width === 1,
    },
    {
      title: '相等時先取左段，保留原順序',
      text: '換成含兩個 2 的資料。左右段遇到相等值時先取左段，較早出現的 2 就先進暫存；所以相等的值會維持原順序。',
      example: 1,
      show: step => step.executedLineId === 'compare' && step.message.includes('2 = 2'),
    },
    {
      title: '每一輪把段長加倍',
      text: '所有段合成一段就完成。資料量加倍時，每輪要處理的資料加倍，合併輪數通常多一輪，因此整體是 O(n log n)。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { width: '區段寬度', start: '區段起點', i: '左段索引', j: '右段索引' },
  examples: [
    { label: '相鄰區段逐輪合併', input: input([5,2,8,1,4]) },
    { label: '相等先取左段', input: input([7,2,5,2,-3]) },
  ],
  practice: input([7,2,5,2,-3]),
  run: traceMergeSort,
}
