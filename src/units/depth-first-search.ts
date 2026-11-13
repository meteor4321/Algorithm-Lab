import source from '../algorithms/core/depth-first-search.py?raw'
import { traceDepthFirstSearch } from '../algorithms/depth-first-search'
import { blockedMaze, openMaze } from './maze-examples'
import { teachingCode, type Unit } from './types'

export const depthFirstSearchUnit: Unit =
{
  slug: 'depth-first-search',
  category: 'searching',
  name: '深度優先搜尋',
  english: 'Depth-First Search',
  goal: '沿著一條路往深處走，遇到死路就退回去試別條。',
  structure: '格子迷宮與遞迴堆疊',
  prerequisite: '只能上下左右移動。示範依上、右、下、左的順序試路。',
  complexity: 'O(V + E)',
  cards: [
    {
      title: '沿一條路找出口',
      text: '起點在左下角，終點在右下角。起點往上和往右都有路，這次約定有岔路時依上、右、下、左試，所以先往上。',
    },
    {
      title: '一路往前，順手記下走過哪裡',
      text: '走到新格子，就留下記號，免得繞一圈又把同一格當作新路。這次先沿左側往上，再向右走到格 12。照探索順序先往上，經過格 7 到格 2，這裡只剩來時那條路。',
      show: step => step.executedLineId === 'mark' && step.view.maze?.active === 2,
    },
    {
      title: '一路退回還有路可試的岔口',
      text: '格 2 走不通，先退回格 7。格 7 也沒有新路，再退回格 12。畫面上的 ↶ 是剛離開的格 7，● 是現在所在的格 12。右邊的格 13 還沒試過，接著就往右走。',
      show: step => step.executedLineId === 'retreat' && step.view.maze?.backtracked === 7,
    },
    {
      title: '第二條岔路也走不通',
      text: '到了格 13，上方是牆，所以先往右到格 14，再往上到格 9。這條路也走不通，只好經格 14 退回格 13。現在右邊已經試過，接著往下走到格 18。',
      show: step => step.executedLineId === 'retreat' && step.view.maze?.backtracked === 14,
    },
    {
      title: '到達終點，留下這次的路線',
      text: '從格 18 沿下方通道繞到終點時，畫面留下十步的路線。來時的格子一格格記著，回頭時先拿掉最後一格，這就是堆疊。同一張迷宮裡，BFS 走六步就能到。',
      show: step => step.executedLineId === 'result',
    },
    {
      title: '把能走的路都試完',
      text: '現在用牆把出口堵住。一路試過所有能到的格子，最後退回起點也沒有別的路可試，就能確定到不了終點。迷宮能走的格子和相鄰連線越多，需要檢查的地方也越多。',
      example: 1,
      show: step => step.executedLineId === 'result',
    },
  ],
  code: teachingCode(source),
  variables: { start: '起點格號', target: '終點格號', node: '正在處理的格號', neighbor: '旁邊的格號', found: '是否找到' },
  examples: [
    { label: '試過兩條死路再找到出口', input: openMaze },
    { label: '出口被牆堵住', input: blockedMaze },
  ],
  practice: openMaze,
  run: traceDepthFirstSearch,
}
