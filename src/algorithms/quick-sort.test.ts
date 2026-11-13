import { expect, it } from 'vitest'
import { quickSortUnit as unit } from '../units/quick-sort'
import { input } from '../units/types'
import { expectPython, expectTrace } from './trace-checks'

it.each([unit.examples[0].input, input([4, -2, 1, -2]), input([-1])])('回傳升冪資料並對齊 Python 的執行行', data =>
{
  const steps = unit.run(data)
  const expected = [...data.items].sort((a, b) => a.value - b.value)
  const result = steps.at(-1)?.result
  expect(result?.type).toBe('sorted')
  if (result?.type !== 'sorted') throw new Error('缺少排序結果。')
  expect(result.items.map(item => item.value)).toEqual(expected.map(item => item.value))
  expectPython(unit, data, steps, expected.map(item => item.value))
  expectTrace(unit, steps, data.items.map(item => item.id))
})

it('交換可能改變等值元素的先後次序', () =>
{
  const data = input([2,1,2])
  const result = unit.run(data).at(-1)?.result
  expect(result?.type === 'sorted' && result.items.filter(item => item.value === 2).map(item => item.id))
    .toEqual(data.items.filter(item => item.value === 2).map(item => item.id).reverse())
})
