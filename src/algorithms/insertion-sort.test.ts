import { expect, it } from 'vitest'
import { insertionSortUnit } from '../units/insertion-sort'
import { input } from '../units/types'
import { traceInsertionSort } from './insertion-sort'
import { executed, expectPython, expectTrace, sortingCases } from './trace-checks'

it.each([[4, 2, 7, 1, 3], ...sortingCases].map(values => ({ values })))('穩定排序 $values 並保存所有元素的身分', ({ values }) =>
{
  const data = input(values)
  const steps = traceInsertionSort(data)
  const expected = [...data.items].sort((a, b) => a.value - b.value)
  expect(steps.at(-1)?.result).toEqual({ type: 'sorted', items: expected })
  expectPython(insertionSortUnit, data, steps, expected.map(item => item.value))
  expect(data.items.map(item => item.value)).toEqual(values)
  expectTrace(insertionSortUnit, steps, data.items.map(item => item.id))
})

it('抽出、右移與插回時，空格和暫存區逐步更新', () =>
{
  const steps = traceInsertionSort(input([4, 2]))
  expect(executed(steps)).toEqual([
    null, 'copy', 'outer', 'hold', 'scan', 'inner', 'shift', 'retreat', 'inner', 'insert', 'outer', 'result',
  ])
  const [, , , hold, scan, compare, shift, , leftEdge, insert] = steps
  expect(hold.view.held).toEqual({ id: 'v1', value: 2 })
  expect(hold.view.cells.map(item => item?.id)).toEqual(['v0', undefined])
  expect(hold.metrics.moves).toBe(1)
  expect(scan.view.variables).toEqual({ index: 1, scan: 0, key: 2 })
  expect(compare.nextLineId).toBe('shift')
  expect(shift.view.cells.map(item => item?.id)).toEqual([undefined, 'v0'])
  expect(shift.view.regions).toEqual([])
  expect(leftEdge.kind).toBe('check')
  expect(leftEdge.metrics.comparisons).toBe(1)
  expect(insert.view.cells.map(item => item?.id)).toEqual(['v1', 'v0'])
  expect(insert.view.held).toBeNull()
  expect(steps.at(-1)?.metrics).toEqual({ comparisons: 1, swaps: 0, moves: 3 })
})

it('遇到相等值時跳到插回行', () =>
{
  const steps = traceInsertionSort(input([4, 4]))
  expect(steps.find(step => step.executedLineId === 'inner')?.nextLineId).toBe('insert')
})
