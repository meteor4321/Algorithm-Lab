import type { ArrayView, Element, Metrics, Result, Step } from './types'

export function makeItems(values: readonly number[]): Element[]
{
  return values.map((value, index) => ({ id: `v${index}`, value }))
}

export function copyItems(items: readonly Element[])
{
  return items.map(item => Object.freeze({ ...item }))
}

type Frame = Omit<Step, 'nextLineId'>

export function createTrace()
{
  const frames: Frame[] = []
  const metrics = { comparisons: 0, swaps: 0, moves: 0 }

  function add(kind: Step['kind'], executedLineId: string | null, message: string, view: Omit<ArrayView, 'type'>, result?: Result)
  {
    const marked = view.marked && Object.freeze({ ...view.marked, indices: Object.freeze([...view.marked.indices]) })
    const rows = view.rows && Object.freeze(view.rows.map(row => Object.freeze({ ...row, values: Object.freeze([...row.values]) })))
    const maze = view.maze && Object.freeze({
      ...view.maze,
      visited: view.maze.visited && Object.freeze([...view.maze.visited]),
      pending: view.maze.pending && Object.freeze([...view.maze.pending]),
      path: view.maze.path && Object.freeze([...view.maze.path]),
    })
    const diagram = view.diagram && Object.freeze({
      ...view.diagram,
      labels: Object.freeze([...view.diagram.labels]),
      edges: Object.freeze(view.diagram.edges.map(edge => Object.freeze([...edge] as [number, number]))),
      levels: view.diagram.levels && Object.freeze(view.diagram.levels.map(level => Object.freeze([...level]))),
      visited: view.diagram.visited && Object.freeze([...view.diagram.visited]),
      path: view.diagram.path && Object.freeze([...view.diagram.path]),
    })
    frames.push({
      kind,
      executedLineId,
      message,
      metrics: Object.freeze<Metrics>({ ...metrics }),
      view: Object.freeze({
        ...view,
        type: 'array',
        cells: Object.freeze([...view.cells]),
        variables: Object.freeze({ ...view.variables }),
        pointers: Object.freeze(view.pointers.map(pointer => Object.freeze(pointer))),
        regions: Object.freeze(view.regions.map(region => Object.freeze(region))),
        marked,
        rows,
        diagram,
        maze,
      }),
      result: result && Object.freeze(result),
    })
  }

  function finish(): readonly Step[]
  {
    return Object.freeze(frames.map((frame, index) => Object.freeze({
      ...frame,
      nextLineId: frames[index + 1]?.executedLineId ?? null,
    })))
  }

  return { add, finish, metrics }
}
