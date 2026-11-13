import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { ElementValue } from './ElementValue'

it('32 以一張牌顯示，只高亮目前個位的 2', () =>
{
  const html = renderToStaticMarkup(createElement(ElementValue, { item: { id: 'v0', value: 32 }, digit: { place: 1, offset: 0 } }))
  expect(html).toContain('<span>3</span><mark')
  expect(html).toContain('目前位數 2')
  expect(html.match(/<strong/g)).toHaveLength(1)
  expect(html).not.toContain('#1')
})

it('負數的原值與非負鍵分開顯示，不把原值的位數當成鍵', () =>
{
  const html = renderToStaticMarkup(createElement(ElementValue, { item: { id: 'v0', value: -12 }, digit: { place: 10, offset: -12 } }))
  expect(html).toContain('<strong class="mono">-12</strong>')
  expect(html).toContain('鍵 ')
  expect(html).toContain('目前位數 0')
})

it('不足位數使用前導零，仍只顯示一個元素', () =>
{
  const html = renderToStaticMarkup(createElement(ElementValue, { item: { id: 'v3', value: 5 }, digit: { place: 10, offset: 0 } }))
  expect(html).toContain('目前位數 0')
  expect(html).toContain('</mark><span>5</span>')
  expect(html).not.toContain('#4')
})
