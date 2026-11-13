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
      title: '把範圍切成區間',
      text: '要整理 17、3、9、6、15、5，可以先把 3 到 17 分成幾個區間。每個區間用一個桶來裝。',
      show: step => step.executedLineId === 'width',
    },
    {
      title: '按數值分到對應的桶',
      text: '17 先進較右邊的桶，3 進最左邊的桶。每個值只要和同桶的值一起排序。',
      show: step => step.executedLineId === 'distribute' && step.view.variables.value === 3,
    },
    {
      title: '桶內排好再接回',
      text: '先排左邊桶中的 3、6、5，再往右處理其他桶。接回時由區間小的桶先出。',
      show: step => step.executedLineId === 'sort-bucket',
    },
    {
      title: '分得平均時桶內較短',
      text: '全部接回後就得到升冪結果。資料增加時，各桶若仍分得均勻，單一桶內要排序的資料通常會比較少。',
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
