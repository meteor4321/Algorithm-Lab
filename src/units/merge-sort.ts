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
      title: '從短段開始',
      text: '把 5、2、8、1、4 想成五張各自排好的小紙條。先兩兩合成較長的紙條。',
    },
    {
      title: '看兩段的第一格',
      text: '第一對是 5 和 2，先把較小的 2 放進合併暫存區。',
      show: step => step.executedLineId === 'take-right',
    },
    {
      title: '接上剩下的值',
      text: '右段的 2 已取完，把左段的 5 接在後面，就能寫回 2、5。',
      show: step => step.executedLineId === 'write',
    },
    {
      title: '每輪合併更長的段',
      text: '兩格的有序段再合成四格，直到整排只剩一段。格數加倍時，每輪的資料量也加倍，並且多做一輪。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { width: '區段寬度', start: '區段起點', i: '左段索引', j: '右段索引' },
  examples: [
    { label: '相鄰區段逐輪合併', input: input([5,2,8,1,4]) },
  ],
  practice: input([7,2,5,2,-3]),
  run: traceMergeSort,
}
