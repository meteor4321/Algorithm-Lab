import { useId, useRef, useState } from 'react'
import { firstInversion, MAX_ITEMS, MAX_VALUE, MIN_VALUE, parseArray, parseInteger } from '../algorithms/input'
import type { Element, Input } from '../algorithms/types'
import { ArrayCanvas, itemLabel } from './ArrayCanvas'
import { Icon } from './Icon'

const serialize = (items: readonly Element[]) => items.map(item => item.value).join(', ')

export function PracticeEditor({ input, sorted, rank = false, onApply, onCancel }: {
  input: Input
  sorted: boolean
  rank?: boolean
  onApply: (input: Input) => void
  onCancel: () => void
})
{
  const [items, setItems] = useState(input.items)
  const [raw, setRaw] = useState(serialize(input.items))
  const [targetText, setTargetText] = useState(input.target?.toString() ?? '')
  const [index, setIndex] = useState(0)
  const [cellText, setCellText] = useState(input.items[0]?.value.toString() ?? '')
  const [insertAt, setInsertAt] = useState(input.items.length)
  const [insertText, setInsertText] = useState('0')
  const [insertError, setInsertError] = useState('')
  const counter = useRef(Math.max(-1, ...input.items.map(item => Number(item.id.slice(1)))) + 1)
  const fieldId = useId()
  const array = parseArray(raw)
  const target = parseInteger(targetText)
  const cell = parseInteger(cellText)
  const current = items[index]
  const needsTarget = input.target !== undefined
  const inversion = sorted && array.ok ? firstInversion(items) : -1
  const rankError = rank && target.ok && (target.value < 1 || target.value > items.length)
  const invalid = !array.ok || !items.length || (!!current && !cell.ok) || (needsTarget && !target.ok) || inversion >= 0 || rankError

  function newItem(value: number): Element
  {
    return { id: `v${counter.current++}`, value }
  }

  function refresh(next: readonly Element[], selected = index)
  {
    const safeIndex = Math.max(0, Math.min(selected, next.length - 1))
    setItems(next)
    setIndex(safeIndex)
    setCellText(next[safeIndex]?.value.toString() ?? '')
    setInsertAt(Math.min(insertAt, next.length))
  }

  function update(next: readonly Element[], selected = index)
  {
    refresh(next, selected)
    setRaw(serialize(next))
  }

  function changeArray(text: string)
  {
    setRaw(text)
    const parsed = parseArray(text)
    if (parsed.ok) refresh(parsed.value.map((value, position) =>
    {
      const item = items[position]
      return item ? { ...item, value } : newItem(value)
    }))
  }

  function changeCell(text: string)
  {
    setCellText(text)
    const parsed = parseInteger(text)
    if (!parsed.ok) return
    const next = items.map((item, position) => position === index ? { ...item, value: parsed.value } : item)
    setItems(next)
    setRaw(serialize(next))
  }

  function insert()
  {
    const parsed = parseInteger(insertText)
    if (!parsed.ok)
    {
      setInsertError(parsed.error)
      return
    }
    const next = [...items]
    next.splice(insertAt, 0, newItem(parsed.value))
    update(next, insertAt)
    setInsertError('')
  }

  return (
    <form className="editor" onSubmit={event =>
    {
      event.preventDefault()
      if (!invalid) onApply({ items, target: needsTarget && target.ok ? target.value : undefined })
    }}>
      <div className="editor-inputs">
        <label className="field">
          <span>整列資料</span>
          <input value={raw} onChange={event => changeArray(event.target.value)} aria-invalid={!array.ok}
            aria-describedby={`${fieldId}-array`} placeholder="5, 3, -1, 3" />
          <small className={array.ok ? '' : 'error'} id={`${fieldId}-array`}>
            {!array.ok ? array.error : items.length ? '1–12 個整數，以半形或全形逗號分隔。' : '套用前請至少放入一個值。'}
          </small>
        </label>
        {needsTarget && <label className="field target-field">
          <span>{rank ? '排名 k' : '搜尋目標'}</span>
          <input value={targetText} onChange={event => setTargetText(event.target.value)} aria-invalid={!target.ok || rankError}
            aria-describedby={`${fieldId}-target`} />
          <small className={target.ok && !rankError ? '' : 'error'} id={`${fieldId}-target`}>
            {target.ok ? rank ? '排名須為 1 到陣列長度。' : '−99 到 99' : target.error}
          </small>
        </label>}
      </div>
      {inversion >= 0 && <div className="editor-warning">
        <span role="status">二分搜尋需要非遞減陣列。索引 {inversion - 1} 的 {items[inversion - 1].value} 大於索引 {inversion} 的 {items[inversion].value}。</span>
        <button type="button" className="button small" onClick={() =>
        {
          const next = [...items].sort((a, b) => a.value - b.value)
          update(next, next.findIndex(item => item.id === current?.id))
        }}>整理為升冪</button>
      </div>}
      <ArrayCanvas preview view={{ type: 'array', cells: items, pointers: [], regions: [], variables: {} }} />
      {!array.ok && <p className="field-note">預覽保留上一份有效草稿。</p>}
      <fieldset disabled={!array.ok} className="edit-rows">
        <legend className="sr-only">逐格修改</legend>
        {current && <div className="edit-row">
          <label className="field">
            <span>選擇格子</span>
            <select value={index} onChange={event =>
            {
              const next = Number(event.target.value)
              setIndex(next)
              setCellText(String(items[next].value))
            }}>
              {items.map((item, position) => <option value={position} key={item.id}>索引 {position} · {itemLabel(item)}</option>)}
            </select>
          </label>
          <label className="field cell-field">
            <span>格子數值</span>
            <input value={cellText} onChange={event => changeCell(event.target.value)} aria-invalid={!cell.ok}
              aria-describedby={!cell.ok ? `${fieldId}-cell` : undefined} />
          </label>
          <div className="edit-buttons">
            <button type="button" className="button small mono" aria-label="選取格減一" onClick={() => changeCell(String(current.value - 1))}
              disabled={!cell.ok || current.value <= MIN_VALUE}>−1</button>
            <button type="button" className="button small mono" aria-label="選取格加一" onClick={() => changeCell(String(current.value + 1))}
              disabled={!cell.ok || current.value >= MAX_VALUE}>+1</button>
            <button type="button" className="button small" onClick={() => update(items.filter((_, position) => position !== index))}>刪除</button>
          </div>
          {!cell.ok && <small className="error row-error" id={`${fieldId}-cell`}>{cell.error}</small>}
        </div>}
        <div className="edit-row">
          <label className="field">
            <span>插入位置</span>
            <select value={insertAt} onChange={event => setInsertAt(Number(event.target.value))}>
              {items.map((item, position) => <option value={position} key={item.id}>索引 {position} 前</option>)}
              <option value={items.length}>末尾 · 索引 {items.length}</option>
            </select>
          </label>
          <label className="field cell-field">
            <span>新增數值</span>
            <input value={insertText} onChange={event =>
            {
              setInsertText(event.target.value)
              setInsertError('')
            }} onKeyDown={event =>
            {
              if (event.key === 'Enter')
              {
                event.preventDefault()
                if (items.length < MAX_ITEMS) insert()
              }
            }} aria-invalid={!!insertError} aria-describedby={insertError ? `${fieldId}-insert` : undefined} />
          </label>
          <div className="edit-buttons">
            <button type="button" className="button small" onClick={insert} disabled={items.length >= MAX_ITEMS}>插入</button>
          </div>
          {insertError && <small className="error row-error" id={`${fieldId}-insert`}>{insertError}</small>}
        </div>
      </fieldset>
      <div className="editor-footer">
        <button type="submit" className="button primary" disabled={invalid}>套用並重跑 <Icon name="arrow" /></button>
        <button type="button" className="button" onClick={onCancel}>取消</button>
      </div>
    </form>
  )
}
