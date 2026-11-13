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
      title: '從樹頂開始',
      text: '把 8、3、10、1、6、14 依序建成樹。每個節點的左側值較小，右側值較大。',
    },
    {
      title: '比較後選一邊',
      text: '要找 6，從 8 開始，因為 6 比 8 小，就走到左邊的 3。',
      show: step => step.executedLineId === 'left',
    },
    {
      title: '找到就回傳',
      text: '6 比 3 大，所以再走到右邊的 6。相等時回傳這個節點的編號。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '走到空連結就是查無',
      text: '改找 5，走到 6 後會發現它的左側沒有節點。資料量變大時，查找要走幾步取決於樹長得有多高。',
      example: 1,
      show: step => step.executedLineId === 'miss',
    },
  ],
  code: teachingCode(source),
  variables: { target: '搜尋目標', node: '目前節點編號', value: '目前讀取值', left: '左子節點', right: '右子節點' },
  examples: [
    { label: '沿左右分支命中', input: input([8,3,10,1,6,14], 6) },
    { label: '走到空連結', input: input([8,3,10,1,6,14], 5) },
  ],
  practice: input([8,2,10,-1,5], 5),
  run: traceBstSearch,
}
