import source from '../algorithms/core/kmp-search.py?raw'
import { traceKmpSearch } from '../algorithms/kmp-search'
import { teachingCode, type Unit } from './types'

export const kmpSearchUnit: Unit =
{
  slug: 'kmp-search',
  category: 'searching',
  name: 'KMP 字串搜尋',
  english: 'Knuth–Morris–Pratt',
  goal: '用前綴表保留已匹配的字元，遇到不符時直接換到可續比的位置。',
  structure: '字串與前綴表',
  prerequisite: '樣式須至少有一個字元。回傳第一個命中的字元索引。',
  complexity: 'O(n + m)',
  cards: [
    {
      title: '比到一半不符，前面能不能留著？',
      text: '在 ABABABAC 裡找 ABABAC，先從左邊對齊。前五個字元 ABABA 相同，第六格卻是文字 B 對樣式 C；如果每次都從樣式第一格重比，就會重做許多已知的比較。',
      show: step => step.executedLineId === 'compare' && step.view.variables.i === 5 && step.view.variables.j === 5,
    },
    {
      title: '先在樣式裡準備一張表',
      text: '先回到建表階段，只看樣式的 ABAB。開頭 AB 是前綴，結尾 AB 是後綴；兩者相同、長度是 2，因此 prefix[3] 記 2。不能把整個 ABAB 算進去，否則不會得到較短的續比位置。',
      show: step => step.executedLineId === 'prefix-write' && step.view.variables.i === 3,
    },
    {
      title: '更長一格，記下更長的可重用部分',
      text: '看到 ABABA 時，開頭和結尾都有 ABA，長度是 3，所以 prefix[4] 記 3。表的索引表示這段的最後一格，表中的數字表示可以保留的長度，兩者不是同一件事。',
      show: step => step.executedLineId === 'prefix-write' && step.view.variables.i === 4,
    },
    {
      title: '不符時查已匹配段的最後一格',
      text: '回到文字 B 對樣式 C 的不符位置：已匹配長度 j=5，因此查 prefix[j−1]，也就是 prefix[4]=3。文字末尾的 ABA 已知等於樣式開頭 ABA，這三格不必重比。',
      show: step => step.executedLineId === 'fallback' && step.view.variables.i === 5,
    },
    {
      title: '文字不退，樣式移到可以續比的位置',
      text: '現在 i 仍是 5，j 改成 3，樣式起點對齊文字索引 2。接著比較同一個文字 B 與樣式索引 3 的 B，兩者相同就能繼續前進。',
      show: step => step.executedLineId === 'compare' && step.view.variables.i === 5 && step.view.variables.j === 3,
    },
    {
      title: '保留後仍不符，就再縮短',
      text: '換成 AAAAACAAAAAB 裡找 AAAAAB。遇到 C 時，一次縮短還不夠，就繼續查表，直到沒有可保留的前綴才移動文字位置；i 不會倒退。',
      example: 2,
      show: step => step.executedLineId === 'fallback' && step.view.variables.j === 2,
    },
    {
      title: '整段匹配，回推開始索引',
      text: '回到原例，最後 i=8、樣式長度 6，開始索引就是 8−6=2。建表和搜尋都利用已知結果避免反覆重比，工作量隨文字與樣式總長度增加，為 O(n+m)。',
      show: step => step.executedLineId === 'found',
    },
    {
      title: '文字用完仍未匹配完整，就是查無',
      text: '把原例最後一個 C 改成 B，就算前面多次部分匹配，也不能當作找到。整段文字讀完仍沒有完整樣式時，回傳 −1；文字或樣式加長時，建表與搜尋的總工作量隨兩者長度增加。',
      example: 1,
      show: step => step.executedLineId === 'miss',
    },
  ],
  code: teachingCode(source),
  variables: { i: '目前文字或建表索引', j: '已匹配長度' },
  examples: [
    { label: '前綴回退後命中', input: {"items":[],"text":{"value":"ABABABAC","pattern":"ABABAC"}} },
    { label: '查無結果', input: {"items":[],"text":{"value":"ABABABAB","pattern":"ABABAC"}} },
    { label: '同一字元連續回退', input: { items: [], text: { value: 'AAAAACAAAAAB', pattern: 'AAAAAB' } } },
  ],
  practice: {"items":[],"text":{"value":"ABABABAC","pattern":"ABABAC"}},
  run: traceKmpSearch,
}
