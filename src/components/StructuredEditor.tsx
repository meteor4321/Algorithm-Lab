import { useId, useState } from 'react'
import { parseText } from '../algorithms/structured-input'
import type { Input } from '../algorithms/types'

export function StructuredEditor({ input, onApply, onCancel }: {
  input: Input
  onApply: (input: Input) => void
  onCancel: () => void
})
{
  const [value, setValue] = useState(input.text?.value ?? '')
  const [pattern, setPattern] = useState(input.text?.pattern ?? '')
  const messageId = useId()
  const { error, value: validText } = parseText(value, pattern)
  return (
    <form className="editor" aria-describedby={messageId} onSubmit={event =>
    {
      event.preventDefault()
      if (validText) onApply({ items: [], text: validText })
    }}>
      <div className="structured-fields">
        <label className="field">文字<input value={value} onChange={event => setValue(event.target.value)} /></label>
        <label className="field">搜尋樣式<input value={pattern} onChange={event => setPattern(event.target.value)} /></label>
      </div>
      <p id={messageId} role="status" className={error ? 'error field-note' : 'field-note'}>
        {error ?? '字元索引從 0 開始，空白也算一個字元。'}
      </p>
      {validText && <div className="array-canvas">
        <div className="canvas-heading"><strong>草稿預覽</strong><span className="tag">{[...value].length} 個字元</span></div>
        <p className="mono structured-preview">{value}</p>
        <p className="field-note">搜尋「{pattern}」，共 {[...pattern].length} 個字元</p>
      </div>}
      <div className="editor-footer">
        <button type="submit" className="button primary" disabled={!validText}>套用並重跑</button>
        <button type="button" className="button" onClick={onCancel}>取消</button>
      </div>
    </form>
  )
}
