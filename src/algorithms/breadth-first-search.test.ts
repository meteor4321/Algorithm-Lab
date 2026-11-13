import { expect, it } from 'vitest'
import { breadthFirstSearchUnit as unit } from '../units/breadth-first-search'
import { prepareMaze } from './maze'
import { expectPython, expectTrace } from './trace-checks'

const results = [[25, 26, 27, 22, 23, 24, 29], []]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'lesson', text: ['最少 6 步到達終點', '無法到達終點'][index] })
  expect(steps.at(-1)?.view.maze?.path).toEqual(results[index])
  const { graph, start, target } = prepareMaze(data.maze)
  expectPython(unit, data, steps, results[index], [graph, start, target])
  expectTrace(unit, steps, [])
})

it('走訪順序由上、右、下、左決定，牆和換列邊界都不可通過', () =>
{
  const { graph } = prepareMaze(unit.examples[0].input.maze)
  expect(graph[25]).toEqual([20, 26])
  expect(graph[2]).toEqual([7])
  expect(graph[1]).toEqual([])
  expect(graph[24]).toEqual([29, 23])
})
