import { expect, it } from 'vitest'
import { bubbleSortUnit } from '../units/bubble-sort'
import { input } from '../units/types'
import { traceBubbleSort } from './bubble-sort'
import { executed, expectPython, expectTrace, sortingCases } from './trace-checks'

it.each([[5, 3, 8, 4, 1], ...sortingCases].map(values => ({ values })))('穩定排序 $values，並與教學程式回傳值一致', ({ values }) =>
{
  const data = input(values)
  const steps = traceBubbleSort(data)
  const expected = [...data.items].sort((a, b) => a.value - b.value)
  expect(steps.at(-1)?.result).toEqual({ type: 'sorted', items: expected })
  expectPython(bubbleSortUnit, data, steps, expected.map(item => item.value))
  expect(data.items.map(item => item.value)).toEqual(values)
  expectTrace(bubbleSortUnit, steps, data.items.map(item => item.id))
})

it('比較、交換、標記已排序格和離開迴圈逐行對齊', () =>
{
  const steps = traceBubbleSort(input([2, -1]))
  expect(executed(steps)).toEqual([
    null, 'copy', 'outer', 'inner', 'compare', 'swap', 'inner', 'outer', 'result',
  ])
  const [, , outer, inner, compare, swap, roundEnd] = steps
  expect(steps[0].view.round).toBeUndefined()
  expect(outer.view.variables).toEqual({ end: 1, index: null })
  expect(outer.view.round).toBe(1)
  expect(inner.view.variables).toEqual({ end: 1, index: 0 })
  expect(inner.view.pointers).toEqual([{ label: 'end', index: 1 }, { label: 'index', index: 0 }, { label: 'index+1', index: 1 }])
  expect(compare.metrics).toEqual({ comparisons: 1, swaps: 0, moves: 0 })
  expect(swap.view.cells.map(item => item?.value)).toEqual([-1, 2])
  expect(swap.metrics).toEqual({ comparisons: 1, swaps: 1, moves: 0 })
  expect(roundEnd.view.pointers).toEqual([{ label: 'end', index: 1 }])
  expect(roundEnd.view.regions).toEqual([{ from: 1, to: 1, tone: 'settled', label: '已排序' }])
})

it('等值跳過交換，依外層迴圈縮小右界直到排序完成', () =>
{
  const steps = traceBubbleSort(input([3, 3, 3]))
  const rounds = steps.filter(step => step.executedLineId === 'outer' && step.kind === 'update')
  expect(rounds.map(step => step.view.round)).toEqual([1, 2])
  expect(rounds.map(step => step.view.variables.end)).toEqual([2, 1])
  expect(rounds[1].view.regions).toEqual([{ from: 2, to: 2, tone: 'settled', label: '已排序' }])
  expect(steps.filter(step => step.kind === 'compare').map(step => step.nextLineId)).toEqual(['inner', 'inner', 'inner'])
  expect(steps.at(-1)?.metrics).toEqual({ comparisons: 3, swaps: 0, moves: 0 })
})
