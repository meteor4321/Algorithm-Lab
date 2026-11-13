import source from '../algorithms/core/radix-sort.py?raw'
import { traceRadixSort } from '../algorithms/radix-sort'
import { input, teachingCode, type Unit } from './types'

export const radixSortUnit: Unit =
{
  slug: 'radix-sort',
  category: 'sorting',
  name: '基數排序',
  english: 'Radix Sort',
  goal: '從個位開始逐位分桶，保留同一桶的先後順序。',
  structure: '陣列與位數桶',
  prerequisite: '整數資料。負值先用共同偏移量換算位數，原值照常顯示。此排序穩定。',
  complexity: 'O(d(n + 10))',
  cards: [
    {
      title: '先看個位數',
      text: '在 32、11、22、5、43 裡，先看每個數字的個位。32 和 22 都進入桶 2，照原本順序排隊。',
    },
    {
      title: '按桶號收回',
      text: '從桶 0 到桶 9 依序收回，同一桶內先進先出。這一輪只排好了個位。',
      show: step => step.executedLineId === 'output',
    },
    {
      title: '再按十位分桶',
      text: '收回個位的結果後，再用同樣方式看十位。十位相同時，先前排好的個位順序會保留。',
      show: step => step.executedLineId === 'advance',
    },
    {
      title: '最高位也完成就停',
      text: '處理完需要的最高位後，整排就有序了。每多一位，就要多走訪資料和十個桶一次。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { offset: '共同偏移量', maximum: '最大鍵或 1', place: '目前位值', value: '目前值', digit: '目前位的數字' },
  examples: [
    { label: '個位與十位分桶', input: input([32,11,22,5,43]) },
  ],
  practice: input([26,-12,14,2,-12]),
  run: traceRadixSort,
}
