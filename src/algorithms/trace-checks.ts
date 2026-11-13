import { spawnSync } from 'node:child_process'
import { expect } from 'vitest'
import type { Unit } from '../units/types'
import type { Input, Step } from './types'

const runTeachingCode = `
import json
import sys

source, name, args = json.load(sys.stdin)
namespace = {}
exec(compile(source, "<lesson>", "exec"), namespace)
lesson = namespace[name]
lines = []

def trace(frame, event, arg):
    if frame.f_code.co_filename == "<lesson>" and not frame.f_code.co_name.startswith("<") and event == "line":
        lines.append(frame.f_lineno)
    return trace

sys.settrace(trace)
result = lesson(*args)
sys.settrace(None)
print(json.dumps([result, lines]))
`

export function expectPython(unit: Unit, input: Input, steps: readonly Step[], expected: boolean | number | number[], pythonArgs?: readonly unknown[])
{
  const values = input.items.map(item => item.value)
  const args = pythonArgs ?? (input.target === undefined ? [values] : [values, input.target])
  const python = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['-X', 'utf8', '-c', runTeachingCode], {
    input: JSON.stringify([unit.code.map(line => line.text).join('\n'), unit.slug.replaceAll('-', '_'), args]),
    encoding: 'utf8',
    timeout: 5000,
  })
  if (python.error) throw new Error('測試需要可從命令列執行的 Python 3。', { cause: python.error })
  expect(python.status, python.stderr).toBe(0)
  const [result, lines]: [boolean | number | number[], number[]] = JSON.parse(python.stdout)
  expect(result).toEqual(expected)
  expect(lines.map(line => unit.code[line - 1].id)).toEqual(executed(steps).slice(1))
}

export function executed(steps: readonly Step[])
{
  return steps.map(step => step.executedLineId)
}

export function expectTrace(unit: Unit, steps: readonly Step[], ids: readonly string[])
{
  const known = new Set(unit.code.flatMap(line => line.id ?? []))
  expect(known.size).toBe(unit.code.filter(line => line.id).length)
  expect(steps[0].executedLineId).toBeNull()
  expect(steps[0].kind).toBe('initial')
  expect(steps.at(-1)?.nextLineId).toBeNull()
  expect(steps.at(-1)?.result).toBeDefined()
  expect(Object.isFrozen(steps)).toBe(true)
  for (const [index, step] of steps.entries())
  {
    expect(step.nextLineId).toBe(steps[index + 1]?.executedLineId ?? null)
    if (step.executedLineId) expect(known.has(step.executedLineId)).toBe(true)
    const live = step.view.cells.flatMap(item => item ? [item.id] : [])
    if (step.view.held) live.push(step.view.held.id)
    expect(live.sort()).toEqual([...ids].sort())
    expect(Object.isFrozen(step.view.cells)).toBe(true)
    expect(Object.isFrozen(step.view.variables)).toBe(true)
    expect(step.view.cells.every(item => item === null || Object.isFrozen(item))).toBe(true)
    expect(Object.isFrozen(step.metrics)).toBe(true)
  }
}

export const sortingCases = [[-1], [-1, 0, 2, 2], [4, 3, 2, 1], [5, 3, 8, 3, 1], [4, 2, 4, 1], [0, -1, -1, 5, -4]]
