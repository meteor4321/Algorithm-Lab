import source from '../algorithms/core/counting-sort.py?raw'
import { traceCountingSort } from '../algorithms/counting-sort'
import { input, teachingCode, type Unit } from './types'

export const countingSortUnit: Unit =
{
  slug: 'counting-sort',
  category: 'sorting',
  name: '計數排序',
  english: 'Counting Sort',
  goal: '先數每個整數出現幾次，再從累計表算出輸出位置。',
  structure: '陣列、計數表與輸出陣列',
  prerequisite: '適合整數值域較小的資料。從右往左放回，因此排序穩定。',
  complexity: 'O(n + r)',
  cards: [
    {
      title: '用表格數出現次數',
      text: '要整理 4、1、3、0、2，可以先準備 0 到 4 的計數格。每讀到一個值，就在它的格子加一。',
      show: step => step.executedLineId === 'count',
    },
    {
      title: '把次數累計起來',
      text: '將每格與左側累計值相加，就知道有幾個值小於或等於目前數字。',
      show: step => step.executedLineId === 'prefix',
    },
    {
      title: '從右邊開始放入輸出',
      text: '最右邊的 2 依累計值找到輸出索引。等值由後往前填，輸出仍保留等值元素的原始順序。',
      show: step => step.executedLineId === 'place',
    },
    {
      title: '資料範圍也影響成本',
      text: '當所有格子都放好，輸出就是排序結果。操作量取決於資料筆數 n 和最小值到最大值的整數格數 r。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { low: '最小值', value: '目前值', index: '計數表索引' },
  examples: [
    { label: '從計數到輸出', input: input([4,1,3,0,2]) },
  ],
  practice: input([4,-2,3,-2,0]),
  run: traceCountingSort,
}
