import { expect, it } from 'vitest'
import { rabinKarpUnit as unit } from '../units/rabin-karp'
import { expectPython, expectTrace } from './trace-checks'

const results = [5,-1,1]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'lesson', text: ["在字元索引 5 找到「ANA」","查無「冬天」","在字元索引 1 找到「a」"][index] })
  expectPython(unit, data, steps, results[index], [data.text!.value, data.text!.pattern])
  expectTrace(unit, steps, [])
})
