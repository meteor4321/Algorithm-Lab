import source from '../algorithms/core/rabin-karp.py?raw'
import { traceRabinKarp } from '../algorithms/rabin-karp'
import { teachingCode, type Unit } from './types'

export const rabinKarpUnit: Unit =
{
  slug: 'rabin-karp',
  category: 'searching',
  name: 'Rabin–Karp 字串搜尋',
  english: 'Rabin–Karp',
  goal: '用滾動雜湊篩選視窗，再核對可能命中的字串。',
  structure: '字串與滑動視窗',
  prerequisite: '樣式須至少有一個字元。回傳第一個命中的字元索引。',
  complexity: '最差 O(nm)',
  cards: [
    {
      title: '用三格視窗找一段字',
      text: '在 CABABANANA 裡找 ANA，視窗長度是 3。先看 CAB，再向右看 ABA、BAB 等等；畫面把原文的視窗範圍框起來，樣式放在同一個起點下方。',
      show: step => step.executedLineId === 'window-hash' && step.view.variables.i === 2,
    },
    {
      title: '先把字元換成能快速比較的數字',
      text: '每個字元有字碼，例如 A 是 65。同樣三個字元依位置給不同權重，累積時乘 base 再加新字碼，最後取 mod 的餘數；這個摘要叫雜湊，並不保證每段文字都不同。',
      show: step => step.executedLineId === 'pattern-hash' && step.view.variables.i === 2,
    },
    {
      title: '摘要不同，就不必逐字核對',
      text: '第一個視窗 CAB 的雜湊與 ANA 不同，可以直接略過。雜湊是先篩掉不可能的候選，不是光看它就能確認找到。',
      show: step => step.executedLineId === 'hash-match' && step.view.variables.start === 0,
    },
    {
      title: '向右滑時，只先扣掉離開的字',
      text: '從 CAB 滑到 ABA 時，先扣掉最左邊 C 的字碼乘上權重。中間的 AB 還在視窗中，因此保留已算好的部分，不必把三個字元從頭重算。',
      show: step => step.executedLineId === 'remove' && step.view.variables.start === 0,
    },
    {
      title: '把保留部分移位，再加入新字',
      text: '接著把保留部分的雜湊乘 base，加入右側 A 的字碼，再取餘數，就得到新視窗 ABA。離開的格子、保留的範圍與新進來的字元使用不同標記。',
      show: step => step.executedLineId === 'roll' && step.view.variables.start === 0,
    },
    {
      title: '滑過多個候選，直到核對成功',
      text: '繼續滑過 ABA、BAB、ABA、BAN，到了索引 5 的 ANA，雜湊相同，完整字串也相同，才回傳起點 5。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '相同摘要也可能是碰撞',
      text: '另外用一格寬的短例 Æa 找 a，專門觀察碰撞。Æ 與 a 的字碼不同，但取模後的雜湊相同；逐字核對會拒絕 Æ，繼續滑動才找到 a。',
      example: 2,
      show: step => step.executedLineId === 'verify',
    },
    {
      title: '視窗走完就結束',
      text: '換成春天有花找冬天，所有完整視窗檢查完都沒有命中，就回傳 −1。文字越長，視窗越多；若雜湊常碰撞，每次還要逐字核對，最差成本為 O(nm)。',
      example: 1,
      show: step => step.executedLineId === 'miss',
    },
  ],
  code: teachingCode(source),
  variables: { size: '視窗長度', base: '雜湊基數', mod: '模數', weight: '最左字元權重', expected: '樣式雜湊', window: '視窗雜湊', i: '初始字元索引', start: '視窗起點' },
  examples: [
    { label: '多格視窗滾動後命中', input: { items: [], text: { value: 'CABABANANA', pattern: 'ANA' } } },
    { label: '查無結果', input: {"items":[],"text":{"value":"春天有花","pattern":"冬天"}} },
    { label: '雜湊碰撞後命中', input: { items: [], text: { value: 'Æa', pattern: 'a' } } },
  ],
  practice: {"items":[],"text":{"value":"BANANANA","pattern":"ANA"}},
  run: traceRabinKarp,
}
