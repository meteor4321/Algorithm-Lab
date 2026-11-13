import source from '../algorithms/core/quick-sort.py?raw'
import { traceQuickSort } from '../algorithms/quick-sort'
import { input, teachingCode, type Unit } from './types'

export const quickSortUnit: Unit =
{
  slug: 'quick-sort',
  category: 'sorting',
  name: '快速排序',
  english: 'Quicksort',
  goal: '把值分到基準值兩側，再遞迴處理兩個區段。',
  structure: '陣列',
  prerequisite: '採用右端基準值的原地分區，排序不穩定。',
  complexity: '最差 O(n²)',
  cards: [
    {
      title: '先用一個值把問題分成兩邊',
      text: '要整理 8、2、7、1、4，先選最右端的 4 當基準 pivot。目標先不是把兩邊排好，而是把小於 4 的值集中到左邊，其餘留在右邊。',
      show: step => step.executedLineId === 'pivot',
    },
    {
      title: '用兩個位置記住進度',
      text: 'boundary 指向小值區的下一格，scan 指向正在查看的格子。開始時兩者都在索引 0，還沒有任何值被確認屬於小值區。',
      show: step => step.executedLineId === 'scan' && step.view.variables.scan === 0,
    },
    {
      title: '大值先留著，小值才搬到分界',
      text: '先看到 8 ≥ 4，就往右掃。接著 2 < 4，將 2 和 boundary 的 8 交換，2 便進入左側小值區；8 仍留在已掃描部分，不需要現在排好。',
      show: step => step.executedLineId === 'move-small',
    },
    {
      title: '分界只在收到小值時前進',
      text: '放好 2 後，boundary 往右一格。繼續看 7 和 1：7 留著，1 則搬到小值區尾端。畫面的區段能看出哪些已分類、哪些還沒掃過。',
      show: step => step.executedLineId === 'advance',
    },
    {
      title: '把基準值放在兩區之間',
      text: '掃描完後，把 4 換到 boundary。左邊 2、1 都小於 4，右邊 8、7 都不小於 4，因此 4 的位置已確定，但左右各自還沒排好。',
      show: step => step.executedLineId === 'place',
    },
    {
      title: '先整理左邊，回來再整理右邊',
      text: '用相同方式處理左段 2、1，再回上一層處理右段 8、7。下方呼叫紀錄保留各層範圍，讓你看出現在處理哪一段，而不是把整列重新開始。',
      show: step => step.executedLineId === 'recurse-right' && step.view.variables.left === 0 && step.view.variables.right === 4,
    },
    {
      title: '只剩一格，就不用再分',
      text: '區段至多一格就能回上一層。遠距交換可能改變等值元素順序，所以此版本不穩定；若每次切分都很不平均，資料量加倍時最差比較次數約變成四倍。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { left: '左界', right: '右界', pivot: '基準值', boundary: '較小區下一格', scan: '掃描索引', pivot_index: '基準值就位索引' },
  examples: [
    { label: '基準值分區', input: input([8,2,7,1,4]) },
    { label: '多層分區與回到上一層', input: input([9,3,7,1,8,2,6,4,5]) },
    { label: '已排序資料的不平均切分', input: input([1,2,3,4,5,6]) },
  ],
  practice: input([4,-1,5,2,4]),
  run: traceQuickSort,
}
