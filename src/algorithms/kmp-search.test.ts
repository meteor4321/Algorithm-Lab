import { expect, it } from 'vitest'
import { kmpSearchUnit as unit } from '../units/kmp-search'
import { expectPython, expectTrace } from './trace-checks'

const results = [2,-1,6]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'lesson', text: ["在字元索引 2 找到「ABABAC」","查無「ABABAC」","在字元索引 6 找到「AAAAAB」"][index] })
  expectPython(unit, data, steps, results[index], [data.text!.value, data.text!.pattern])
  expectTrace(unit, steps, [])
})
