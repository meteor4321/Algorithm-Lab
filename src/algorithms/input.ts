import type { Element } from './types'

export const MAX_ITEMS = 12
export const MIN_VALUE = -99
export const MAX_VALUE = 99

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string }

export function parseInteger(text: string): Parsed<number>
{
  const raw = text.trim()
  const value = Number(raw)
  if (!/^[+-]?\d+$/.test(raw) || value < MIN_VALUE || value > MAX_VALUE)
  {
    return { ok: false, error: '請輸入 −99 到 99 的整數。' }
  }
  return { ok: true, value: value === 0 ? 0 : value }
}

export function parseArray(text: string): Parsed<number[]>
{
  if (!text.trim()) return { ok: true, value: [] }
  const parts = text.split(/[,，]/)
  if (parts.length > MAX_ITEMS) return { ok: false, error: '陣列最多可放 12 個數值。' }
  const values: number[] = []
  for (const [index, part] of parts.entries())
  {
    const parsed = parseInteger(part)
    if (!parsed.ok) return { ok: false, error: `索引 ${index}：${parsed.error}` }
    values.push(parsed.value)
  }
  return { ok: true, value: values }
}

export function firstInversion(items: readonly Element[]): number
{
  return items.findIndex((item, index) => index > 0 && items[index - 1].value > item.value)
}
