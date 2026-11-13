import source from '../algorithms/core/bucket-sort.py?raw'
import { traceBucketSort } from '../algorithms/bucket-sort'
import { input, teachingCode, type Unit } from './types'

export const bucketSortUnit: Unit =
{
  slug: 'bucket-sort',
  category: 'sorting',
  name: '桶排序',
  english: 'Bucket Sort',
  goal: '按區間分桶，排好各桶後依順序接回。',
  structure: '陣列與區間桶',
  prerequisite: '整數資料。相同值落在同一桶，桶內採用穩定排序。',
  complexity: '成本隨分布而變',
  cards: [
    {
      title: '先用區間分開不同大小的數',
      text: '整理 17、3、9、6、15、5 時，先找到最小值 3 和最大值 17。本例用四個等寬桶，每桶涵蓋四個整數，因此桶 0 是 3–6，桶 1 是 7–10，依此類推。',
      show: step => step.executedLineId === 'buckets',
    },
    {
      title: '先找區間，再搬整張牌',
      text: '17 落在 15–18 的桶 3；接著 3 落在桶 0。區間確定之後，不同桶的大小順序已經確定，但同桶內還可能是亂的。',
      show: step => step.executedLineId === 'distribute' && step.view.variables.value === 3,
    },
    {
      title: '同桶還要排序',
      text: '分完後，桶 0 是 3、6、5，不能直接接回結果。這裡呼叫 Python 的穩定排序整理成 3、5、6；若想看桶內如何一步步整理，可先看插入排序單元。',
      show: step => step.executedLineId === 'sort-bucket',
    },
    {
      title: '按區間從小到大收集',
      text: '先把桶 0 的 3、5、6 接到輸出，再依序接桶 1、2、3。桶內已排好，不同桶的範圍又不重疊，所以不用跨桶再比較。',
      show: step => step.executedLineId === 'append',
    },
    {
      title: '分布影響桶內工作量',
      text: '四個桶接完就得到結果；同值同桶且桶內穩定，所以原順序能保留。資料若都擠在同一桶，仍要在那個桶內排序；桶數固定時，資料增加也會讓桶內工作增加。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { low: '最小值', width: '每桶涵蓋的整數數量', value: '目前值', index: '桶索引' },
  examples: [
    { label: '分桶、桶內排序與收集', input: input([17,3,9,6,15,5]) },
  ],
  practice: input([19,-4,3,-4,8]),
  run: traceBucketSort,
}
