import source from '../algorithms/core/bst-search.py?raw'
import { traceBstSearch } from '../algorithms/bst-search'
import { input, teachingCode, type Unit } from './types'

export const bstSearchUnit: Unit =
{
  slug: 'bst-search',
  category: 'searching',
  name: '二元搜尋樹查找',
  english: 'Binary Search Tree Lookup',
  goal: '從根節點出發，每次只走可能包含目標的一側。',
  structure: '二元搜尋樹',
  prerequisite: '依輸入順序建樹。等值使用第一個建立的節點。',
  complexity: 'O(h)，h 為樹高',
  cards: [
    {
      title: '先有一棵遵守大小規則的樹',
      text: '依序放入 8、3、10、1、6、14：第一個 8 是根，較小的走左邊，較大的走右邊，直到遇到空位置。本單元從建好的樹開始查找；每個節點的整棵左子樹都較小，右子樹都較大。',
    },
    {
      title: '先分清楚值和節點編號',
      text: '圓內的 8 是值，下方的索引 0 是節點編號。node、left、right 記的是編號。根節點的 left=1 表示走向索引 1，該節點的值是 3。',
      show: step => step.executedLineId === 'read' && step.view.variables.node === 0,
    },
    {
      title: '小於目前值，整個右子樹都不用找',
      text: '目標是 6，6 < 8，所以從根走左邊到 3。右邊整棵樹都大於 8，不可能含有 6，這就是只選一側的理由。',
      show: step => step.executedLineId === 'left',
    },
    {
      title: '大於目前值，改走右邊',
      text: '到了 3，6 > 3，往它的右子節點走到 6。每一步都重新與目前節點比較，不能把第一次往左的決定一直沿用。',
      show: step => step.executedLineId === 'right',
    },
    {
      title: '相等時回傳節點編號',
      text: '目前值等於目標 6，回傳節點編號 4。這個 4 不是值 6 在排序後的排名，而是建樹時分配的識別編號。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '走到空連結，就確定不存在',
      text: '同一棵樹改找 5：先到 3，再到 6，接著要往左，但那裡是空連結 −1。畫面保留從 6 指向空位置的標記，因此不是「還有一格沒畫出來」。',
      example: 1,
      show: step => step.executedLineId === 'miss',
    },
    {
      title: '樹若長成一條鏈，就沒有折半優勢',
      text: '改依 1、2、3、4、5、6 的順序建樹，每個新值都走右邊，形成一條鏈。找 6 必須逐層走到底；查找成本取決於樹高 h，並非所有搜尋樹都能保證 O(log n)。',
      example: 2,
      show: step => step.executedLineId === 'found',
    },
  ],
  code: teachingCode(source),
  variables: { target: '搜尋目標', node: '目前節點編號', value: '目前讀取值', left: '左子節點', right: '右子節點' },
  examples: [
    { label: '沿左右分支命中', input: input([8,3,10,1,6,14], 6) },
    { label: '走到空連結', input: input([8,3,10,1,6,14], 5) },
    { label: '依序建樹退化成鏈', input: input([1,2,3,4,5,6], 6) },
  ],
  practice: input([8,2,10,-1,5], 5),
  run: traceBstSearch,
}
