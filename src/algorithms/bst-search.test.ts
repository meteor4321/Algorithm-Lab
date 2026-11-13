import { expect, it } from 'vitest'
import { bstSearchUnit as unit } from '../units/bst-search'
import { searchTree } from './bst-search'
import { expectPython, expectTrace } from './trace-checks'

const results = [4,-1,5]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'lesson', text: ["節點 4 的值為 6","查無 5","節點 5 的值為 6"][index] })
  expectPython(unit, data, steps, results[index], [searchTree(data.items), data.target])
  expectTrace(unit, steps, [])
})
