import { expect, it } from 'vitest'
import { quickselectUnit as unit } from '../units/quickselect'
import { expectPython, expectTrace } from './trace-checks'

const results = [7,1,8]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'lesson', text: ["第 4 小的值是 7","第 1 小的值是 1","第 8 小的值是 8"][index] })
  expectPython(unit, data, steps, results[index], undefined)
  expectTrace(unit, steps, data.items.map(item => item.id))
})
