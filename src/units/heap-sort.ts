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
      title: '同一列數字，也能畫成樹',
      text: '3、8、4、1、6 從根往下逐層排成樹，圓內是值，圓下方是陣列索引。索引 i 的左右子節點是 2i+1 與 2i+2；樹沒有另外複製一份資料。',
    },
    {
      title: '父節點要不小於兩個孩子',
      text: '目標是讓每個父節點都不小於左右孩子，這樣根一定最大。從底部仍有孩子的索引 1 開始；先修好下面的小樹，往上修時就能沿已整理的分支下沉。',
      show: step => step.executedLineId === 'build' && step.view.variables.start === 1,
    },
    {
      title: '先選較大的孩子，再比父節點',
      text: '索引 1 的孩子是 1 和 6，先選較大的 6，再和父節點 8 比。8 ≥ 6，這裡不必交換；若只隨便挑一個孩子，可能留下另一個比父節點大的值。',
      show: step => step.executedLineId === 'compare-root' && step.view.variables.root === 1,
    },
    {
      title: '父節點太小，就交換並繼續往下',
      text: '輪到根的 3，較大的孩子是 8，交換後 8 升到根、3 下沉。下一步仍要沿 3 的新位置檢查，因為它下面還有 6。',
      show: step => step.executedLineId === 'sink' && step.view.variables.root === 0,
    },
    {
      title: '根是最大值，送到尾端就定位',
      text: '建好最大堆後，根的 8 與最後一格交換。8 退出堆並標為已排序；換上根的值可能太小，需要再選較大的孩子逐層下沉。',
      show: step => step.executedLineId === 'place-max',
    },
    {
      title: '縮小堆，重複取出最大值',
      text: '堆中的格子越來越少，右邊就位的格子越來越多。這種遠距交換不保證等值順序；資料增加時，取出次數與樹高共同決定 O(n log n) 的成本。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { start: '建堆起點', end: '本輪輸出位置', root: '目前父節點', child: '候選子節點', size: '本次下沉的堆大小' },
  examples: [
    { label: '建堆、取最大與下沉', input: input([3,8,4,1,6]) },
    { label: '較深的樹與連續下沉', input: input([2,9,7,6,8,3,5,1,4]) },
  ],
  practice: input([6,2,-1,5,2]),
  run: traceHeapSort,
}
