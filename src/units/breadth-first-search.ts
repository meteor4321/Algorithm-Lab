import source from '../algorithms/core/breadth-first-search.py?raw'
import { traceBreadthFirstSearch } from '../algorithms/breadth-first-search'
import { blockedMaze, openMaze } from './maze-examples'
import { teachingCode, type Unit } from './types'

export const breadthFirstSearchUnit: Unit =
{
  slug: 'breadth-first-search',
  category: 'searching',
  name: '廣度優先搜尋',
  english: 'Breadth-First Search',
  goal: '在每步成本相同的迷宮裡，找出走到終點最少要幾步。',
  structure: '格子迷宮與佇列',
  prerequisite: '只能上下左右移動，牆不可通過。畫布的小格號對應程式裡的位置編號。',
  complexity: 'O(V + E)',
  cards: [
    {
      title: '最少要走幾步？',
      text: '你站在左下角，想走到右下角的終點。底排中間有牆，往上走又會遇到岔路。每次只能上下左右走一格，怎麼知道哪條路要走的步數最少？',
    },
    {
      title: '先看一步就能到的地方',
      text: '從起點往上或往右，都只要走一步。先把這兩格寫進「待查看」清單，照加入的順序查看。查第一格時發現的新路要接到清單最後面，讓原先排著的另一格先輪到。這種先加入、先查看的清單叫做佇列。',
      show: step => step.executedLineId === 'push' && step.view.maze?.pending?.length === 2,
    },
    {
      title: '為什麼第一次到終點就是最短？',
      text: '照這個順序，一步能到的格子會先於兩步的，兩步的又先於三步的。輪到終點時，更短的距離都已查過，所以終點第一次被找到時，所用的步數就是最少的。',
      show: step => step.executedLineId === 'compare' && step.view.maze?.active === step.view.maze?.map.target,
    },
    {
      title: '找到終點後，怎麼把路畫出來？',
      text: '每次發現新格子，都記下是從哪裡走過來的。找到終點後，沿著紀錄往回走，再反過來看，就能畫出完整路線。這次先沿底排往右，遇到牆再往上繞，最後從終點上方走下去，共六步。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '待查看的格子用完了呢？',
      text: '這次把終點上方唯一的入口封起來。只要清單上還有格子，就還有地方可查。等清單用完仍沒遇到終點，就知道這次走不到出口。',
      example: 1,
      show: step => step.executedLineId === 'miss',
    },
    {
      title: '把迷宮當成一張圖',
      text: '每個能走的格子都可以看成一個節點，相鄰且能互走的兩格之間就有一條邊。右欄程式用 graph 記下每格能通往哪些格子。從起點能走到的格子和相鄰連線越多，搜尋就要檢查越多。',
      show: step => step.executedLineId === 'found',
    },
  ],
  code: teachingCode(source),
  variables: { start: '起點格號', target: '終點格號', node: '正在處理的格號', neighbor: '旁邊的格號' },
  examples: [
    { label: '繞過牆的最短路線', input: openMaze },
    { label: '出口被牆堵住', input: blockedMaze },
  ],
  practice: openMaze,
  run: traceBreadthFirstSearch,
}
