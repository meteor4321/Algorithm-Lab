import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { bubbleSortUnit } from '../units/bubble-sort'
import { CodePanel } from './CodePanel'

it('同一行同時剛執行和準備執行時，顯示兩個標籤', () =>
{
  const [initial] = bubbleSortUnit.run(bubbleSortUnit.examples[0].input)
  const step = { ...initial, executedLineId: initial.nextLineId }
  const markup = renderToStaticMarkup(createElement(CodePanel, { unit: bubbleSortUnit, step, id: 'code' }))
  expect(markup).toContain('Python 核心函式')
  expect(markup).toContain('code-line is-next is-ran')
  expect(markup).toContain('code-marker next-line">下一行')
  expect(markup).toContain('code-marker ran-line">剛執行')
  expect(markup).not.toContain('@line')
})
