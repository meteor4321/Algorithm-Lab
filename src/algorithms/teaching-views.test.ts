import { expect, it } from 'vitest'
import { units } from '../units'
import { input } from '../units/types'
import { treeLayout } from './tree-layout'
import { expectPython, expectTrace } from './trace-checks'

it.each(units)('$name 的每張介紹卡都能找到指定畫面', unit =>
{
  const timelines = unit.examples.map(example => unit.run(example.input))
  for (const card of unit.cards)
  {
    const steps = timelines[card.example ?? 0]
    expect(steps, card.title).toBeDefined()
    if (card.show) expect(steps.find(card.show), card.title).toBeDefined()
  }
})

it.each(units.filter(unit => unit.category === 'sorting'))('$name 的全部經典範例結果與 Python 實際執行行一致', unit =>
{
  for (const example of unit.examples)
  {
    const steps = unit.run(example.input)
    const expected = example.input.items.map(item => item.value).sort((a, b) => a - b)
    expectPython(unit, example.input, steps, expected)
    expectTrace(unit, steps, example.input.items.map(item => item.id))
  }
})

it('基數排序固定十桶、保留元素身分，並記錄完整元素的分發與收回', () =>
{
  const unit = units.find(unit => unit.slug === 'radix-sort')!
  const steps = unit.run(input([32, 11, 22, 5, 43, 12, 31]))
  for (const step of steps.filter(step => step.executedLineId === 'distribute'))
  {
    const buckets = step.view.rows!.filter(row => row.id?.startsWith('bucket-'))
    expect(buckets).toHaveLength(10)
    const transfer = step.view.transfer!
    expect(transfer.from).toBe('array')
    expect(transfer.ids).toHaveLength(1)
    const item = buckets.find(row => row.id === transfer.to)!.items!.at(-1)!
    expect(item.id).toBe(transfer.ids[0])
    expect(Math.floor(item.value / step.view.digit!.place) % 10).toBe(Number(transfer.to.slice(7)))
    expect(Object.isFrozen(buckets[0].items)).toBe(true)
  }
  const secondPass = steps.find(step => step.executedLineId === 'collect' && step.kind === 'check' && step.view.variables.place === 10)!
  expect(secondPass.view.rows!.find(row => row.id === 'bucket-1')!.items!.map(item => item!.value)).toEqual([11,12])
})

it('含負數的位數高亮使用共同偏移的非負鍵', () =>
{
  const unit = units.find(unit => unit.slug === 'radix-sort')!
  const steps = unit.run(input([26,-12,14,2,-12]))
  const step = steps.find(step => step.executedLineId === 'distribute')!
  expect(step.view.digit).toEqual({ place: 1, offset: -12 })
  expect(step.view.transfer!.to).toBe('bucket-8')
  expect(step.view.rows!.find(row => row.id === 'bucket-8')!.items![0]!.value).toBe(26)
})

it('換位時舊桶仍標示上一輪位數，不把舊桶誤當新桶', () =>
{
  const unit = units.find(unit => unit.slug === 'radix-sort')!
  const steps = unit.run(unit.examples[0].input)
  const advance = steps.find(step => step.executedLineId === 'advance')!
  expect(advance.view.digit?.place).toBe(10)
  expect(advance.view.rows?.filter(row => row.id?.startsWith('bucket-')).every(row => row.digit?.place === 1)).toBe(true)
  const lastAdvance = steps.filter(step => step.executedLineId === 'advance').at(-1)!
  expect(lastAdvance.view.digit).toBeUndefined()
})

it('選擇排序的不穩定範例在結果中確實反轉等值編號', () =>
{
  const unit = units.find(unit => unit.slug === 'selection-sort')!
  const data = unit.examples[1].input
  const result = unit.run(data).at(-1)!.result!
  expect(result.type).toBe('sorted')
  if (result.type !== 'sorted') throw new Error('缺少排序結果')
  expect(result.items.filter(item => item.value === 4).map(item => item.id)).toEqual(['v1', 'v0'])
})

it('所有桶排序搬移的來源與目的都含同一元素', () =>
{
  for (const slug of ['bucket-sort', 'radix-sort', 'counting-sort'])
  {
    const unit = units.find(unit => unit.slug === slug)!
    const steps = unit.run(unit.examples[0].input)
    for (const [index, step] of steps.entries())
    {
      const transfer = step.view.transfer
      if (!transfer) continue
      const from = transfer.from === 'array' ? steps[index - 1].view.cells : steps[index - 1].view.rows?.find(row => row.id === transfer.from)?.items
      const to = transfer.to === 'array' ? step.view.cells : step.view.rows?.find(row => row.id === transfer.to)?.items
      for (const id of transfer.ids)
      {
        expect(from?.some(item => item?.id === id), `${slug} ${step.executedLineId} source`).toBe(true)
        expect(to?.some(item => item?.id === id), `${slug} ${step.executedLineId} target`).toBe(true)
      }
    }
  }
})

it('單邊樹仍保留左右關係，查無時顯示空連結', () =>
{
  const unit = units.find(unit => unit.slug === 'bst-search')!
  for (const values of [[1,2,3,4], [4,3,2,1], [8,3,10,1,6,14]])
  {
    const steps = unit.run(input(values, 5))
    const diagram = steps[0].view.diagram!
    const { points } = treeLayout(diagram)
    diagram.children!.forEach(([left, right], node) =>
    {
      if (left >= 0) expect(points.get(left)!.x).toBeLessThan(points.get(node)!.x)
      if (right >= 0) expect(points.get(right)!.x).toBeGreaterThan(points.get(node)!.x)
    })
    expect(steps.at(-1)!.view.diagram!.emptyLink).toBeDefined()
  }
})

it('KMP 回退保留文字位置、對齊樣式並標出實際讀取的表格', () =>
{
  const unit = units.find(unit => unit.slug === 'kmp-search')!
  const step = unit.run(unit.examples[0].input).find(step => step.executedLineId === 'fallback')!
  expect(step.view.variables).toEqual({ i: 5, j: 3 })
  expect(step.view.rows![1].offset).toBe(2)
  expect(step.view.rows![2].active).toBe(4)
  expect(step.view.rows![2].values[4]).toBe(3)
})

it('Rabin–Karp 滑動後框住新視窗，並區分離開與進入', () =>
{
  const unit = units.find(unit => unit.slug === 'rabin-karp')!
  const step = unit.run(unit.examples[0].input).find(step => step.executedLineId === 'roll')!
  expect(step.view.rows![2].values.join('')).toBe('ABA')
  expect(step.view.rows![2].offset).toBe(1)
  expect(step.view.rows![0].regions).toContainEqual({ from: 0, to: 0, tone: 'excluded', label: '離開' })
  expect(step.view.rows![0].regions).toContainEqual({ from: 3, to: 3, tone: 'move', label: '進入' })
})

it('BFS 的距離與最短路線一致，每個已記來路的格子距離只增一', () =>
{
  const unit = units.find(unit => unit.slug === 'breadth-first-search')!
  const steps = unit.run(unit.examples[0].input)
  const final = steps.at(-1)!.view.maze!
  expect(final.distances![final.map.target]).toBe(6)
  expect(final.path!.map(cell => final.distances![cell])).toEqual([0,1,2,3,4,5,6])
})
