/**
 * Searching Algorithms.
 *
 *   Linear Search  : O(n)
 *   Binary Search  : O(log n) — requer array ORDENADO
 *     - first occurrence (lower_bound)
 *     - last occurrence  (upper_bound)
 *     - busca em rotated sorted array
 *     - binary search "by answer" (sobre a resposta, não sobre o array)
 *
 * Sempre use `midpoint(low, high)` para evitar overflow em outras linguagens.
 */

import { isMainModule, midpoint } from './_utils';

const NOT_FOUND = -1;

// ----------------------------------------------------------------------------
// Linear Search — O(n).
// ----------------------------------------------------------------------------

export function linearSearch<T>(items: T[], target: T): number {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return i;
  }
  return NOT_FOUND;
}

// ----------------------------------------------------------------------------
// Binary Search clássico — retorna índice ou -1. O(log n).
// ----------------------------------------------------------------------------

export function binarySearch(sortedNumbers: number[], target: number): number {
  let low = 0;
  let high = sortedNumbers.length - 1;

  while (low <= high) {
    const mid = midpoint(low, high);
    if (sortedNumbers[mid] === target) return mid;
    if (sortedNumbers[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return NOT_FOUND;
}

// ----------------------------------------------------------------------------
// Lower Bound — menor índice cujo valor é >= target.
// Equivalente a `std::lower_bound` do C++. O(log n).
// ----------------------------------------------------------------------------

export function lowerBound(sortedNumbers: number[], target: number): number {
  let low = 0;
  let high = sortedNumbers.length;

  while (low < high) {
    const mid = midpoint(low, high);
    if (sortedNumbers[mid] < target) low = mid + 1;
    else high = mid;
  }
  return low;
}

// ----------------------------------------------------------------------------
// Upper Bound — menor índice cujo valor é > target. O(log n).
// ----------------------------------------------------------------------------

export function upperBound(sortedNumbers: number[], target: number): number {
  let low = 0;
  let high = sortedNumbers.length;

  while (low < high) {
    const mid = midpoint(low, high);
    if (sortedNumbers[mid] <= target) low = mid + 1;
    else high = mid;
  }
  return low;
}

/** Quantas vezes `target` aparece no array ordenado. O(log n). */
export function countOccurrences(sortedNumbers: number[], target: number): number {
  return upperBound(sortedNumbers, target) - lowerBound(sortedNumbers, target);
}

/** Primeira ocorrência de `target`, ou -1 se ausente. O(log n). */
export function firstOccurrence(sortedNumbers: number[], target: number): number {
  const index = lowerBound(sortedNumbers, target);
  if (index >= sortedNumbers.length) return NOT_FOUND;
  return sortedNumbers[index] === target ? index : NOT_FOUND;
}

// ----------------------------------------------------------------------------
// Busca em rotated sorted array — ex.: [4,5,6,7,0,1,2]. O(log n).
// ----------------------------------------------------------------------------

export function searchRotated(rotatedSorted: number[], target: number): number {
  let low = 0;
  let high = rotatedSorted.length - 1;

  while (low <= high) {
    const mid = midpoint(low, high);
    if (rotatedSorted[mid] === target) return mid;

    if (isLeftHalfSorted(rotatedSorted, low, mid)) {
      if (isTargetInRange(target, rotatedSorted[low], rotatedSorted[mid])) high = mid - 1;
      else low = mid + 1;
    } else {
      if (isTargetInRange(target, rotatedSorted[mid], rotatedSorted[high])) low = mid + 1;
      else high = mid - 1;
    }
  }
  return NOT_FOUND;
}

function isLeftHalfSorted(numbers: number[], low: number, mid: number): boolean {
  return numbers[low] <= numbers[mid];
}

/** True quando minExclusive < target < maxExclusive (intervalo aberto nas pontas). */
function isTargetInRange(target: number, minExclusive: number, maxExclusive: number): boolean {
  return minExclusive <= target && target < maxExclusive;
}

// ----------------------------------------------------------------------------
// Encontrar QUALQUER pico — arr[i] > arr[i-1] && arr[i] > arr[i+1]. O(log n).
// ----------------------------------------------------------------------------

export function findPeakIndex(numbers: number[]): number {
  let low = 0;
  let high = numbers.length - 1;

  while (low < high) {
    const mid = midpoint(low, high);
    if (numbers[mid] > numbers[mid + 1]) high = mid;
    else low = mid + 1;
  }
  return low;
}

// ----------------------------------------------------------------------------
// Raiz quadrada inteira — binary search "by answer". O(log n).
// ----------------------------------------------------------------------------

export function integerSquareRoot(n: number): number {
  if (n < 2) return n;

  let low = 1;
  let high = n;
  let bestAnswer = 0;

  while (low <= high) {
    const candidate = midpoint(low, high);
    if (candidate <= n / candidate) {
      bestAnswer = candidate;
      low = candidate + 1;
    } else {
      high = candidate - 1;
    }
  }
  return bestAnswer;
}

// ----------------------------------------------------------------------------
// Capacidade mínima do navio para entregar tudo em `daysAvailable` dias.
// Binary search SOBRE A RESPOSTA (capacidade). O(n log sum(weights)).
// ----------------------------------------------------------------------------

export function shipWithinDays(packageWeights: number[], daysAvailable: number): number {
  let low = Math.max(...packageWeights);
  let high = packageWeights.reduce((sum, weight) => sum + weight, 0);

  while (low < high) {
    const candidateCapacity = midpoint(low, high);
    if (canShipWithCapacity(packageWeights, daysAvailable, candidateCapacity)) high = candidateCapacity;
    else low = candidateCapacity + 1;
  }
  return low;
}

function canShipWithCapacity(weights: number[], daysAvailable: number, capacity: number): boolean {
  let daysUsed = 1;
  let currentLoad = 0;

  for (const weight of weights) {
    if (currentLoad + weight > capacity) {
      daysUsed++;
      currentLoad = 0;
    }
    currentLoad += weight;
  }
  return daysUsed <= daysAvailable;
}

// ============================================================================

function runExamples(): void {
  const sortedSample = [1, 2, 2, 2, 3, 5, 7, 9];

  console.log('binarySearch 5:', binarySearch(sortedSample, 5)); // 5
  console.log('lowerBound 2:', lowerBound(sortedSample, 2)); // 1
  console.log('upperBound 2:', upperBound(sortedSample, 2)); // 4
  console.log('countOccurrences 2:', countOccurrences(sortedSample, 2)); // 3
  console.log('firstOccurrence 2:', firstOccurrence(sortedSample, 2)); // 1
  console.log('searchRotated:', searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
  console.log('findPeakIndex:', findPeakIndex([1, 2, 3, 1])); // 2
  console.log('integerSquareRoot(10):', integerSquareRoot(10)); // 3
  console.log('shipWithinDays:', shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)); // 15
}

if (isMainModule(module)) runExamples();
