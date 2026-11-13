import type { ArrayView, Element } from '../algorithms/types'

export function ElementValue({ item, digit }: { item: Element; digit?: ArrayView['digit'] })
{
  const key = digit ? item.value - digit.offset : item.value
  const digits = String(Math.abs(key)).padStart(digit ? String(digit.place).length : 1, '0')
  const position = digit ? digits.length - String(digit.place).length : -1
  const highlighted = <>{[...digits].map((char, index) => index === position
    ? <mark className="digit-active" key={index} aria-label={`目前位數 ${char}`}>{char}</mark>
    : <span key={index}>{char}</span>)}</>
  return <>
    <strong className="mono">{!digit || digit.offset !== 0 ? item.value : highlighted}</strong>
    {digit && digit.offset !== 0 && <span className="digit-key">鍵 {highlighted}</span>}
  </>
}
