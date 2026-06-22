/**
 * Sorting Algorithms.
 *
 * Algoritmo       Best        Avg         Worst       Espaço   Estável
 * --------------  ----------  ----------  ----------  -------  -------
 * Bubble          O(n)        O(n²)       O(n²)       O(1)     sim
 * Selection       O(n²)       O(n²)       O(n²)       O(1)     não
 * Insertion       O(n)        O(n²)       O(n²)       O(1)     sim
 * Merge           O(n log n)  O(n log n)  O(n log n)  O(n)     sim
 * Quick           O(n log n)  O(n log n)  O(n²)       O(log n) não
 * Heap            O(n log n)  O(n log n)  O(n log n)  O(1)     não
 * Counting        O(n + k)    O(n + k)    O(n + k)    O(k)     sim
 *
 * Para uso geral, prefira `array.sort((a, b) => a - b)` do JS.
 * Estes exemplos existem para fins de estudo.
 */

import { isMainModule, randomInt, swap } from './_utils';

// ----------------------------------------------------------------------------
// Bubble Sort — O(n²). Termina cedo se nenhuma troca ocorrer.
// ----------------------------------------------------------------------------

export function bubbleSort(numbers: number[]): number[] {
  const result = [...numbers];

  for (let lastUnsortedIndex = result.length - 1; lastUnsortedIndex > 0; lastUnsortedIndex--) {
    let swappedThisPass = false;

    for (let i = 0; i < lastUnsortedIndex; i++) {
      if (result[i] > result[i + 1]) {
        swap(result, i, i + 1);
        swappedThisPass = true;
      }
    }
    if (!swappedThisPass) break;
  }
  return result;
}

// ----------------------------------------------------------------------------
// Selection Sort — O(n²). Sempre seleciona o menor restante.
// ----------------------------------------------------------------------------

export function selectionSort(numbers: number[]): number[] {
  const result = [...numbers];

  for (let i = 0; i < result.length - 1; i++) {
    const minIndex = indexOfMinFrom(result, i);
    if (minIndex !== i) swap(result, i, minIndex);
  }
  return result;
}

function indexOfMinFrom(numbers: number[], startIndex: number): number {
  let minIndex = startIndex;
  for (let i = startIndex + 1; i < numbers.length; i++) {
    if (numbers[i] < numbers[minIndex]) minIndex = i;
  }
  return minIndex;
}

// ----------------------------------------------------------------------------
// Insertion Sort — O(n²) worst, O(n) best. Ótimo para arrays quase ordenados.
// ----------------------------------------------------------------------------

export function insertionSort(numbers: number[]): number[] {
  const result = [...numbers];

  for (let i = 1; i < result.length; i++) {
    const valueToInsert = result[i];
    let insertionIndex = i - 1;

    while (insertionIndex >= 0 && result[insertionIndex] > valueToInsert) {
      result[insertionIndex + 1] = result[insertionIndex];
      insertionIndex--;
    }
    result[insertionIndex + 1] = valueToInsert;
  }
  return result;
}

// ----------------------------------------------------------------------------
// Merge Sort — O(n log n) garantido. Estável.
// ----------------------------------------------------------------------------

export function mergeSort(numbers: number[]): number[] {
  if (numbers.length <= 1) return numbers;

  const middle = numbers.length >> 1;
  const leftSorted = mergeSort(numbers.slice(0, middle));
  const rightSorted = mergeSort(numbers.slice(middle));
  return mergeSortedArrays(leftSorted, rightSorted);
}

function mergeSortedArrays(left: number[], right: number[]): number[] {
  const merged: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) merged.push(left[leftIndex++]);
    else merged.push(right[rightIndex++]);
  }
  while (leftIndex < left.length) merged.push(left[leftIndex++]);
  while (rightIndex < right.length) merged.push(right[rightIndex++]);
  return merged;
}

// ----------------------------------------------------------------------------
// Quick Sort — O(n log n) médio. Pivô aleatório para evitar O(n²) no pior caso.
// ----------------------------------------------------------------------------

export function quickSort(numbers: number[]): number[] {
  const result = [...numbers];
  sortInPlace(result, 0, result.length - 1);
  return result;
}

function sortInPlace(numbers: number[], low: number, high: number): void {
  if (low >= high) return;
  const pivotIndex = partitionAroundRandomPivot(numbers, low, high);
  sortInPlace(numbers, low, pivotIndex - 1);
  sortInPlace(numbers, pivotIndex + 1, high);
}

/** Particionamento de Lomuto com pivô aleatório. Retorna o índice final do pivô. */
function partitionAroundRandomPivot(numbers: number[], low: number, high: number): number {
  swap(numbers, randomInt(low, high), high);

  const pivot = numbers[high];
  let nextSmallerSlot = low;

  for (let i = low; i < high; i++) {
    if (numbers[i] <= pivot) {
      swap(numbers, nextSmallerSlot, i);
      nextSmallerSlot++;
    }
  }
  swap(numbers, nextSmallerSlot, high);
  return nextSmallerSlot;
}

// ----------------------------------------------------------------------------
// Heap Sort — O(n log n) garantido. In-place mas não estável.
// 1) Constrói max-heap; 2) extrai a raiz n vezes para o final.
// ----------------------------------------------------------------------------

export function heapSort(numbers: number[]): number[] {
  const result = [...numbers];
  buildMaxHeap(result);
  extractMaxRepeatedly(result);
  return result;
}

function buildMaxHeap(numbers: number[]): void {
  for (let i = (numbers.length >> 1) - 1; i >= 0; i--) {
    siftDown(numbers, i, numbers.length);
  }
}

function extractMaxRepeatedly(numbers: number[]): void {
  for (let lastIndex = numbers.length - 1; lastIndex > 0; lastIndex--) {
    swap(numbers, 0, lastIndex);
    siftDown(numbers, 0, lastIndex);
  }
}

function siftDown(numbers: number[], rootIndex: number, heapSize: number): void {
  while (true) {
    const largestIndex = indexOfLargestAmongParentAndChildren(numbers, rootIndex, heapSize);
    if (largestIndex === rootIndex) return;
    swap(numbers, rootIndex, largestIndex);
    rootIndex = largestIndex;
  }
}

function indexOfLargestAmongParentAndChildren(numbers: number[], parent: number, heapSize: number): number {
  const left = parent * 2 + 1;
  const right = parent * 2 + 2;
  let largest = parent;

  if (left < heapSize && numbers[left] > numbers[largest]) largest = left;
  if (right < heapSize && numbers[right] > numbers[largest]) largest = right;
  return largest;
}

// ----------------------------------------------------------------------------
// Counting Sort — O(n + k). Apenas para inteiros em intervalo limitado.
// ----------------------------------------------------------------------------

export function countingSort(numbers: number[]): number[] {
  if (numbers.length === 0) return [];

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const counts = new Array<number>(max - min + 1).fill(0);

  for (const value of numbers) counts[value - min]++;

  const result: number[] = [];
  for (let i = 0; i < counts.length; i++) {
    for (let occurrence = 0; occurrence < counts[i]; occurrence++) result.push(i + min);
  }
  return result;
}

// ============================================================================

function runExamples(): void {
  const sample = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  console.log('bubble:    ', bubbleSort(sample));
  console.log('selection: ', selectionSort(sample));
  console.log('insertion: ', insertionSort(sample));
  console.log('merge:     ', mergeSort(sample));
  console.log('quick:     ', quickSort(sample));
  console.log('heap:      ', heapSort(sample));
  console.log('counting:  ', countingSort(sample));
}

if (isMainModule(module)) runExamples();
