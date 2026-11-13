export function parseText(value: string, pattern: string)
{
  if ([...value].length < 1 || [...value].length > 40) return { error: '文字須有 1 到 40 個字元。' } as const
  if ([...pattern].length < 1 || [...pattern].length > 12) return { error: '搜尋樣式須有 1 到 12 個字元。' } as const
  return { value: { value, pattern } } as const
}
