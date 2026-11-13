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
      title: '只找第幾小，不必排完整列',
      text: '在 8、2、7、1、4 中找第 4 小，先把排名 4 換成索引 wanted=3。重複值也各占一名，例如兩個 2 會占兩個位置。',
      show: step => step.executedLineId === 'wanted',
    },
    {
      title: '先做一次分區，確定一張牌的位置',
      text: '選最右端的 4 為 pivot，scan 往右掃，boundary 記住下一個小值位置。遇到 2 < 4，就把 2 換到 boundary，再把分界右移；其餘值仍待後續處理。',
      show: step => step.executedLineId === 'move-small',
    },
    {
      title: '基準值的位置就是它的排名線索',
      text: '分區完成後，4 在索引 2，左邊兩個值都比它小，所以它是第 3 小。左右兩邊還不必各自排好，我們已經能判斷第 4 小在哪一邊。',
      show: step => step.executedLineId === 'place',
    },
    {
      title: '只留下包含目標索引的一側',
      text: 'wanted=3 在索引 2 的右邊，因此只保留 8、7。左側連同 4 都標為不再搜尋；它們的值不可能是這次要找的第 4 小。',
      show: step => step.executedLineId === 'right-half',
    },
    {
      title: '換個排名，就可能改走左側',
      text: '同一列改找第 1 小，wanted=0。第一次分區仍把 4 放在索引 2，但這次只保留左側 2、1，右側不用再處理。',
      example: 1,
      show: step => step.executedLineId === 'left-half',
    },
    {
      title: '基準值落在 wanted 就停止',
      text: '回到找第 4 小的例子，7 最後落在索引 3，回傳 7 即可。若分區一直只能排除一格，最差為 O(n²)；不需要為了回傳這個值把整列都排好。',
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { k: '指定排名', wanted: '排名換成索引', left: '左界', right: '右界', pivot: '基準值', boundary: '較小區下一格', scan: '掃描索引', pivot_index: '基準值就位索引' },
  examples: [
    { label: '找第 4 小', input: input([8,2,7,1,4], 4) },
    { label: '找最小值', input: input([8,2,7,1,4], 1) },
    { label: '多輪縮小範圍', input: input([9,3,7,1,8,2,6,4,5], 8) },
  ],
  practice: input([6,2,-1,5,2], 3),
  run: traceQuickselect,
}
