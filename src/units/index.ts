import { binarySearchUnit } from './binary-search'
import { bubbleSortUnit } from './bubble-sort'
import { insertionSortUnit } from './insertion-sort'
import { linearSearchUnit } from './linear-search'
import type { Category, Unit } from './types'
import { selectionSortUnit } from './selection-sort'
import { mergeSortUnit } from './merge-sort'
import { quickSortUnit } from './quick-sort'
import { heapSortUnit } from './heap-sort'
import { countingSortUnit } from './counting-sort'
import { radixSortUnit } from './radix-sort'
import { bucketSortUnit } from './bucket-sort'
import { hashSearchUnit } from './hash-search'
import { bstSearchUnit } from './bst-search'
import { quickselectUnit } from './quickselect'
import { breadthFirstSearchUnit } from './breadth-first-search'
import { depthFirstSearchUnit } from './depth-first-search'
import { kmpSearchUnit } from './kmp-search'
import { rabinKarpUnit } from './rabin-karp'

export const units = [
  bubbleSortUnit, insertionSortUnit,
  selectionSortUnit, mergeSortUnit, quickSortUnit, heapSortUnit, countingSortUnit, radixSortUnit, bucketSortUnit,
  linearSearchUnit, binarySearchUnit,
  hashSearchUnit, bstSearchUnit, quickselectUnit, breadthFirstSearchUnit, depthFirstSearchUnit, kmpSearchUnit, rabinKarpUnit,
] as const

export const categories = {
  sorting: { name: '排序', english: 'Sorting', number: '01', description: '追蹤比較和搬移，看一列數字如何排成升冪。' },
  searching: { name: '搜尋', english: 'Searching', number: '02', description: '在陣列、樹、圖和字串中追蹤如何找到目標。' },
}

export const categoryPath = (category: Category) => `#/${category}`
export const unitPath = (unit: Unit) => `${categoryPath(unit.category)}/${unit.slug}`
