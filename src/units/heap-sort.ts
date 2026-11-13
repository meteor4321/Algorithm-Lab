import source from '../algorithms/core/heap-sort.py?raw'
import { traceHeapSort } from '../algorithms/heap-sort'
import { input, teachingCode, type Unit } from './types'

export const heapSortUnit: Unit =
{
  slug: 'heap-sort',
  category: 'sorting',
  name: '堆積排序',
  english: 'Heapsort',
  goal: '建立最大堆，反覆把根節點的最大值放到陣列尾端。',
  structure: '陣列與二元堆',
  prerequisite: '樹形代表陣列索引的父子關係。此排序不穩定。',
  complexity: 'O(n log n)',
  cards: [
    {
      title: '用樹看一排數字',
      text: '把 3、8、4、1、6 的陣列從上到下排成一棵樹。每個父節點都不小於子節點時，根就是最大值。',
    },
    {
      title: '先修正父子順序',
      text: '從底部有子節點的位置開始檢查，遇到比父節點大的子節點就交換。',
      show: step => step.executedLineId === 'sink',
    },
    {
      title: '把最大值送到尾端',
      text: '最大堆建好後，把根的 8 放到陣列最後一格。這格退出堆，下一步重新修正根。',
      show: step => step.executedLineId === 'place-max',
    },
    {
      title: '堆逐輪縮小',
      text: '每取出一次最大值，就多一個值就位。資料增加時，取出的次數和樹高都會影響操作量，整體為 O(n log n)。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { start: '建堆起點', end: '本輪輸出位置', root: '目前父節點', child: '候選子節點', size: '堆的大小' },
  examples: [
    { label: '建堆、取最大與下沉', input: input([3,8,4,1,6]) },
  ],
  practice: input([6,2,-1,5,2]),
  run: traceHeapSort,
}
