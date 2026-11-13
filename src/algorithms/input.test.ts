import { expect, it } from 'vitest'
import { firstInversion, parseArray, parseInteger } from './input'
import { makeItems } from './trace'

it('接受兩種逗號、前後空白、重複值和空白草稿', () =>
{
  expect(parseArray(' 99，-99, -99, 0 ')).toEqual({ ok: true, value: [99, -99, -99, 0] })
  expect(parseArray('  ')).toEqual({ ok: true, value: [] })
  expect(parseArray(Array(12).fill('0').join(','))).toEqual({ ok: true, value: Array(12).fill(0) })
})

it.each(['99,', ',2', '1,,2', '1.5', '0x10', '100', '-100', Array(13).fill('0').join(',')])('標出無效陣列 %s', text =>
{
  expect(parseArray(text).ok).toBe(false)
})

it('目標值採用相同整數範圍，逆序檢查接受重複', () =>
{
  expect(parseInteger('')).toMatchObject({ ok: false })
  expect(parseInteger('100')).toMatchObject({ ok: false })
  expect(parseInteger('-99')).toEqual({ ok: true, value: -99 })
  expect(firstInversion(makeItems([-2, -2, 3, 0, -1]))).toBe(3)
  expect(firstInversion(makeItems([-2, -2, 3]))).toBe(-1)
})
