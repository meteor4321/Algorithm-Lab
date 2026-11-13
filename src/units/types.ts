import type { Algorithm, Input, Step } from '../algorithms/types'
import { makeItems } from '../algorithms/trace'

export type Category = 'sorting' | 'searching'

export interface CodeLine
{
  id?: string
  text: string
}

export interface IntroCard
{
  title: string
  text: string
  example?: number
  show?: (step: Step) => boolean
}

export interface Example
{
  label: string
  input: Input
}

export interface Unit
{
  slug: string
  category: Category
  name: string
  english: string
  goal: string
  structure: string
  prerequisite: string
  complexity: string
  sortedInput?: boolean
  rankInput?: boolean
  cards: readonly IntroCard[]
  code: readonly CodeLine[]
  variables: Readonly<Record<string, string>>
  examples: readonly Example[]
  practice: Input
  run: Algorithm
}

export function input(values: readonly number[], target?: number): Input
{
  return { items: makeItems(values), target }
}

export function teachingCode(source: string): CodeLine[]
{
  return source.trimEnd().split(/\r?\n/).map(line =>
  {
    const [text, id] = line.split('  # @line ')
    return { text, id }
  })
}
