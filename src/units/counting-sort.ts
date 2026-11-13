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
      title: '不先比較大小，先數每個值',
      text: '要整理 4、1、4、0、2、1、5，其中 4 和 1 都出現兩次。先為 0 到 5 各留一格，沒有出現的 3 也要留著，因為每格代表一個固定的值。',
      show: step => step.executedLineId === 'counts',
    },
    {
      title: '同一個值重複出現就累加',
      text: '從左讀取，第一次看到 4 時記 1，第二次看到 4 時改成 2。累計後可找出每個值在輸出陣列中的位置。',
      show: step => step.executedLineId === 'count' && step.view.focusIndex === 2,
    },
    {
      title: '累計回答：有幾個值不大於它？',
      text: '值 0 有一個，值 1 有兩個，所以累計到 1 時得到 3。這表示排好後的前三格都會放小於或等於 1 的值，不是說 1 出現了三次。',
      show: step => step.executedLineId === 'prefix' && step.view.variables.index === 1,
    },
    {
      title: '筆數減一，才是最後可放的索引',
      text: '從右往左放。輪到右邊的 1 時，累計表是 3；因為索引從 0 開始，先減一得到 2，這個 1 就要放到輸出索引 2。',
      show: step => step.executedLineId === 'position' && step.view.variables.value === 1,
    },
    {
      title: '放好後，下一個同值使用前一格',
      text: '把這個 1 放進索引 2。表中的數已減為 2，稍後遇到左邊的 1 時再減一，便放進索引 1；右邊的同值先放，原本左右次序因此保留下來。',
      show: step => step.executedLineId === 'place' && step.view.variables.value === 1,
    },
    {
      title: '值域太寬，也會花時間',
      text: '最後依輸出格讀取排序結果，相等的值仍維持原順序。成本取決於資料筆數 n 和值域格數 r；只有少量資料但值差很大時，計數表仍可能很長。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { low: '最小值', value: '目前值', index: '計數表索引' },
  examples: [
    { label: '從計數到輸出', input: input([4,1,4,0,2,1,5]) },
  ],
  practice: input([4,-2,3,-2,0]),
  run: traceCountingSort,
}
