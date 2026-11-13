import { expect, it } from 'vitest'
import { binarySearchUnit } from '../units/binary-search'
import { input } from '../units/types'
import { traceBinarySearch } from './binary-search'
import { executed, expectPython, expectTrace } from './trace-checks'

it.each([
  { values: [-3, 1, 4, 7, 10, 13, 18], target: 13, index: 5 },
  { values: [-3, 1, 4, 7, 10, 13, 18], target: -3, index: 0 },
  { values: [-3, 1, 4, 7, 10, 13, 18], target: 18, index: 6 },
  { values: [-3, 1, 4, 7, 10, 13, 18], target: 6, index: -1 },
  { values: [-1, -1, -1], target: -1, index: 1 },
  { values: [2], target: 2, index: 0 },
  { values: [2], target: 1, index: -1 },
  { values: [2], target: 3, index: -1 },
])('在 $values 找 $target，回傳 $index', ({ values, target, index }) =>
{
  const data = input(values, target)
  const steps = traceBinarySearch(data)
  expectPython(binarySearchUnit, data, steps, index)
  expect(steps.at(-1)?.result).toEqual({ type: 'search', index, target })
  expect(steps.at(-1)?.view.regions.some(region => region.tone === 'candidate')).toBe(index >= 0)
  expectTrace(binarySearchUnit, steps, data.items.map(item => item.id))
})

it('先判斷，再更新區段，依比較結果走到正確分支', () =>
{
  const steps = traceBinarySearch(binarySearchUnit.examples[0].input)
  expect(executed(steps)).toEqual([null, 'bounds', 'loop', 'middle', 'equal', 'compare', 'right-half', 'loop', 'middle', 'equal', 'found'])
  expect(steps[0].view.variables).toEqual({ left: null, mid: null, right: null, target: 13 })
  expect(steps[0].view.pointers).toEqual([])
  expect(steps[1].view.variables).toEqual({ left: 0, mid: null, right: 6, target: 13 })
  expect(steps[5].view.regions).toEqual([{ from: 0, to: 6, label: '候選區', tone: 'candidate' }])
  expect(steps[6].view.regions).toEqual([
    { from: 0, to: 3, label: '已排除', tone: 'excluded' },
    { from: 4, to: 6, label: '候選區', tone: 'candidate' },
  ])
  expect(steps.at(-1)?.metrics.comparisons).toBe(3)
  const miss = traceBinarySearch(input([4], 3))
  expect(miss.find(step => step.executedLineId === 'compare')?.nextLineId).toBe('left-half')
  expect(miss.find(step => step.executedLineId === 'left-half')?.view.variables.right).toBe(-1)
  expect(miss.find(step => step.executedLineId === 'left-half')?.message).toBe('右界移到 -1，已低於左界 0。')
})

it('拒絕缺少目標或有逆序的輸入', () =>
{
  expect(() => traceBinarySearch(input([0]))).toThrow('需要目標值')
  expect(() => traceBinarySearch(input([2, -1], 2))).toThrow('需要非遞減陣列')
})
