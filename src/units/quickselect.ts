import source from '../algorithms/core/quickselect.py?raw'
import { traceQuickselect } from '../algorithms/quickselect'
import { input, teachingCode, type Unit } from './types'

export const quickselectUnit: Unit =
{
  slug: 'quickselect',
  category: 'searching',
  name: '快速選擇',
  english: 'Quickselect',
  goal: '用分區縮小範圍，找出指定排名的值。',
  structure: '陣列',
  prerequisite: '排名 k 從 1 起算，重複值各占一個名次。',
  complexity: '最差 O(n²)',
  rankInput: true,
  cards: [
    {
      title: '只找指定名次',
      text: '在 8、2、7、1、4 中找第 4 小。先把排名 4 換成從 0 起算的索引 3。',
      show: step => step.executedLineId === 'wanted',
    },
    {
      title: '用基準值確定一個位置',
      text: '用 4 當基準值，分區後它到索引 2。左邊的 2 和 1 都比它小。',
      show: step => step.executedLineId === 'place',
    },
    {
      title: '只繼續找包含目標的那側',
      text: '索引 3 在基準值右邊，接下來只看右側的 8 和 7。',
      show: step => step.executedLineId === 'right-half',
    },
    {
      title: '基準值到目標索引就完成',
      text: '分區得到的索引等於 3 時，回傳該處的 7。若每次分區只排除一格，格數加倍時，最差比較次數約變成四倍。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { k: '指定排名', wanted: '排名換成索引', left: '左界', right: '右界', pivot: '基準值', boundary: '較小區下一格', scan: '掃描索引', pivot_index: '基準值就位索引' },
  examples: [
    { label: '找第 4 小', input: input([8,2,7,1,4], 4) },
    { label: '找最小值', input: input([8,2,7,1,4], 1) },
  ],
  practice: input([6,2,-1,5,2], 3),
  run: traceQuickselect,
}
