export interface Element
{
  readonly id: string
  readonly value: number
}

export interface Input
{
  readonly items: readonly Element[]
  readonly target?: number
  readonly text?: { readonly value: string; readonly pattern: string }
  readonly maze?: MazeInput
}

export interface MazeInput
{
  readonly width: number
  readonly height: number
  readonly walls: readonly number[]
  readonly start: number
  readonly target: number
}

export interface MazeView
{
  readonly distances?: readonly (number | null)[]
  readonly map: MazeInput
  readonly active?: number
  readonly candidate?: number
  readonly visited?: readonly number[]
  readonly pending?: readonly number[]
  readonly path?: readonly number[]
  readonly backtracked?: number
}

export interface Diagram
{
  readonly children?: readonly (readonly [number, number])[]
  readonly roles?: readonly { readonly node: number; readonly label: string }[]
  readonly emptyLink?: { readonly parent: number; readonly side: 'left' | 'right' }
  readonly labels: readonly number[]
  readonly edges: readonly (readonly [number, number])[]
  readonly levels?: readonly (readonly number[])[]
  readonly active?: number
  readonly visited?: readonly number[]
  readonly path?: readonly number[]
}

export interface DetailRow
{
  readonly digit?: ArrayView['digit']
  readonly id?: string
  readonly items?: readonly (Element | null)[]
  readonly pointers?: readonly Pointer[]
  readonly regions?: readonly Region[]
  readonly offset?: number
  readonly note?: string
  readonly linked?: boolean
  readonly indexed?: boolean
  readonly label: string
  readonly values: readonly (string | number)[]
  readonly active?: number
}

export interface Pointer
{
  readonly label: string
  readonly index: number
}

export interface Region
{
  readonly label: string
  readonly from: number
  readonly to: number
  readonly tone: 'settled' | 'candidate' | 'excluded' | 'compare' | 'move' | 'prefix' | 'suffix'
}

export interface ArrayView
{
  readonly digit?: { readonly place: number; readonly offset: number }
  readonly annotation?: string
  readonly transfer?: { readonly ids: readonly string[]; readonly from: string; readonly to: string }
  readonly type: 'array'
  readonly cells: readonly (Element | null)[]
  readonly pointers: readonly Pointer[]
  readonly regions: readonly Region[]
  readonly variables: Readonly<Record<string, number | boolean | null>>
  readonly round?: number
  readonly held?: Element | null
  readonly focusIndex?: number
  readonly marked?: { readonly indices: readonly number[]; readonly label: string; readonly tone: 'compare' | 'move' | 'found' }
  readonly rows?: readonly DetailRow[]
  readonly diagram?: Diagram
  readonly maze?: MazeView
}

export interface Metrics
{
  readonly comparisons: number
  readonly swaps: number
  readonly moves: number
}

export type Result =
  | { readonly type: 'sorted'; readonly items: readonly Element[] }
  | { readonly type: 'search'; readonly index: number; readonly target: number }
  | { readonly type: 'lesson'; readonly text: string }

export interface Step
{
  readonly kind: 'initial' | 'check' | 'compare' | 'update' | 'move' | 'return'
  readonly executedLineId: string | null
  readonly nextLineId: string | null
  readonly view: ArrayView
  readonly message: string
  readonly metrics: Metrics
  readonly result?: Result
}

export type Algorithm = (input: Input) => readonly Step[]
