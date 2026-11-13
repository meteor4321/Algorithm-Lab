import { expect, it } from 'vitest'
import { linearSearchUnit } from '../units/linear-search'
import { input } from '../units/types'
import { traceLinearSearch } from './linear-search'
import { executed, expectPython, expectTrace } from './trace-checks'

it.each([
  { values: [7, 3, 9, 3], target: 3, index: 1 },
  { values: [7, 3, 9, 3], target: 5, index: -1 },
  { values: [7, 3, 9, 3], target: 7, index: 0 },
  { values: [-1, 4, -3], target: -3, index: 2 },
  { values: [-1], target: -1, index: 0 },
  { values: [-1], target: 0, index: -1 },
])('在 $values 找 $target，回傳 $index', ({ values, target, index }) =>
{
  const data = input(values, target)
  const steps = traceLinearSearch(data)
  expectPython(linearSearchUnit, data, steps, index)
  expect(steps.at(-1)?.result).toEqual({ type: 'search', index, target })
  expect(steps.at(-1)?.metrics.comparisons).toBe(index < 0 ? values.length : index + 1)
  expectTrace(linearSearchUnit, steps, data.items.map(item => item.id))
})

it('未命中回到迴圈取得下一格，命中則直接回傳', () =>
{
  const steps = traceLinearSearch(input([7, 3, 3], 3))
  expect(executed(steps)).toEqual([null, 'loop', 'compare', 'loop', 'compare', 'found'])
  expect(steps[1].view.variables).toEqual({ index: 0, value: 7, target: 3 })
  expect(steps[3].view.variables).toEqual({ index: 1, value: 3, target: 3 })
  expect(steps[3].view.regions).toEqual([{ from: 0, to: 0, tone: 'excluded', label: '已排除' }])
  expect(steps[4].view.marked).toEqual({ indices: [1], label: '✓ 命中', tone: 'found' })
  const miss = traceLinearSearch(input([7], 3))
  expect(miss.at(-2)?.view.variables).toEqual({ index: 0, value: 7, target: 3 })
  expect(miss.at(-2)?.view.pointers).toEqual([])
  expect(miss.at(-2)?.view.regions).toEqual([{ from: 0, to: 0, tone: 'excluded', label: '已排除' }])
  expect(() => traceLinearSearch(input([0]))).toThrow('需要目標值')
})
