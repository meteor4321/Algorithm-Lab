import { expect, it } from 'vitest'
import { depthFirstSearchUnit as unit } from '../units/depth-first-search'
import { prepareMaze } from './maze'
import { expectPython, expectTrace } from './trace-checks'

const results = [true, false]

it.each(unit.examples.map(({ input }, index) => ({ data: input, index })))('範例 $index 的結果與執行行和 Python 一致', ({ data, index }) =>
{
  const steps = unit.run(data)
  const result = steps.at(-1)?.result
  expect(result).toEqual({ type: 'lesson', text: ['這條路線共 10 步', '無法到達終點'][index] })
  expect(steps.at(-1)?.view.maze?.path).toEqual(index === 0 ? [25, 20, 15, 10, 11, 12, 13, 18, 23, 24, 29] : [])
  const { graph, start, target } = prepareMaze(data.maze)
  expectPython(unit, data, steps, results[index], [graph, start, target])
  expectTrace(unit, steps, [])
})

it('先走完兩條死路再找到終點，介紹卡停在各次退回岔口的畫面', () =>
{
  const steps = unit.run(unit.examples[0].input)
  const hit = steps.findIndex(step => step.executedLineId === 'hit')
  expect(hit).toBeGreaterThan(0)
  const retreats = steps.slice(0, hit).filter(step => step.executedLineId === 'retreat')
  expect(retreats.map(step => [step.view.maze?.backtracked, step.view.maze?.active])).toEqual([
    [2, 7], [7, 12], [9, 14], [14, 13],
  ])
  const firstBranch = steps.find(unit.cards[2].show!)
  const secondBranch = steps.find(unit.cards[3].show!)
  expect(firstBranch).toBe(retreats[1])
  expect(firstBranch?.view.maze?.visited).not.toContain(13)
  expect(secondBranch).toBe(retreats[3])
  expect(secondBranch?.view.maze?.visited).not.toContain(18)
})
