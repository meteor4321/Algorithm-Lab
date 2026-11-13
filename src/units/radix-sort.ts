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
      title: '每次只看一位，搬走整張牌',
      text: '要整理 32、11、22、5、43、12、31，先只看個位。黃底標出這一輪看的數字；32 要整張進桶 2，不是把 2 從 32 拆下來。',
      show: step => step.executedLineId === 'digit' && step.view.variables.value === 32,
    },
    {
      title: '同一桶照加入順序排隊',
      text: '32 和 22 的個位都是 2，先進來的 32 排前面，22 接在後面。十個桶固定留在原位，空桶也保留，方便追蹤數字搬到哪裡。',
      show: step => step.executedLineId === 'distribute' && step.view.variables.value === 22 && step.view.variables.place === 1,
    },
    {
      title: '按桶號收回，先排好個位',
      text: '從桶 0 到桶 9 收回，桶內由左至右取出。本輪得到 11、31、32、22、12、43、5；個位已由小到大，但整個數字還沒有排好。',
      show: step => step.executedLineId === 'collect' && step.kind === 'check' && step.view.variables.place === 1,
    },
    {
      title: '用上一輪結果再分十位',
      text: '現在黃底改標十位。先前收回的順序不能打亂：11 先進桶 1，接著 12 也進桶 1，所以這兩張牌的個位順序被留下來。',
      show: step => step.executedLineId === 'distribute' && step.view.variables.value === 12 && step.view.variables.place === 10,
    },
    {
      title: '同十位時，個位已經幫忙排好',
      text: '十位相同的 31、32 留在同一桶，依上一輪順序收回就會是 31 在前、32 在後。先個位再十位，每輪都保留同桶先後，才能得到整體順序。',
      show: step => step.executedLineId === 'collect' && step.kind === 'check' && step.view.variables.place === 10,
    },
    {
      title: '負數先用共同偏移換成非負鍵',
      text: '換成 26、−12、14、2、−12。全體減去最小值 −12，得到鍵 38、0、26、14、0；大小關係不變。黃底標的是鍵的位數，整張牌仍帶著原值一起移動。',
      example: 1,
      show: step => step.executedLineId === 'distribute' && step.view.variables.value === 26,
    },
    {
      title: '最高位完成才停',
      text: '所有需要的位數處理完，數字就排好了。相等值每輪都保留先後，因此排序穩定；每多一位，就多走訪整列和十個桶一次。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { offset: '共同偏移量', maximum: '最大鍵或 1', place: '目前位值', value: '目前值', digit: '最近算出的位數' },
  examples: [
    { label: '個位與十位分桶', input: input([32,11,22,5,43,12,31]) },
    { label: '負數的鍵與穩定順序', input: input([26,-12,14,2,-12]) },
  ],
  practice: input([26,-12,14,2,-12]),
  run: traceRadixSort,
}
