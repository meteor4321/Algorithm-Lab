import { expect, it } from 'vitest'
import { hashSearchUnit as unit } from '../units/hash-search'
import { hashTable } from './hash-search'
import { expectPython, expectTrace } from './trace-checks'

const results = [2,-1]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'search', index: results[index], target: data.target })
  expectPython(unit, data, steps, results[index], [hashTable(data.items), data.target])
  expectTrace(unit, steps, data.items.map(item => item.id))
})
