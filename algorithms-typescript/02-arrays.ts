/**
 * Arrays — padrões clássicos de HackerRank / Codility / LeetCode.
 *
 * Complexidade das operações nativas:
 *   acesso por índice ........ O(1)
 *   push / pop ............... O(1) amortizado
 *   unshift / shift / splice . O(n)
 *   indexOf / includes ....... O(n)
 *   sort ..................... O(n log n)
 */

import { isMainModule, swap } from './_utils';

// ----------------------------------------------------------------------------
// Two pointers — inverter array in-place. O(n) tempo, O(1) memória.
// ----------------------------------------------------------------------------

export function reverseInPlace<T>(items: T[]): T[] {
  let left = 0;
  let right = items.length - 1;

  while (left < right) {
    swap(items, left, right);
    left++;
    right--;
  }
  return items;
}

// ----------------------------------------------------------------------------
// Two Sum em array ORDENADO — two pointers convergentes. O(n).
// ----------------------------------------------------------------------------

export type IndexPair = readonly [number, number];

export function twoSumSorted(sortedNumbers: number[], target: number): IndexPair | null {
  let left = 0;
  let right = sortedNumbers.length - 1;

  while (left < right) {
    const currentSum = sortedNumbers[left] + sortedNumbers[right];
    if (currentSum === target) return [left, right];
    if (currentSum < target) left++;
    else right--;
  }
  return null;
}

// ----------------------------------------------------------------------------
// Two Sum em array NÃO ordenado — hash. O(n) tempo / O(n) memória.
// ----------------------------------------------------------------------------

export function twoSum(numbers: number[], target: number): IndexPair | null {
  const indexByValue = new Map<number, number>();

  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    const complementIndex = indexByValue.get(complement);
    if (complementIndex !== undefined) return [complementIndex, i];
    indexByValue.set(numbers[i], i);
  }
  return null;
}

// ----------------------------------------------------------------------------
// Kadane — subarray contíguo de soma máxima. O(n).
// Codility: MaxSliceSum / MaxProfit.
// ----------------------------------------------------------------------------

export function maxSubarraySum(numbers: number[]): number {
  let bestSum = numbers[0];
  let currentSum = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    currentSum = Math.max(numbers[i], currentSum + numbers[i]);
    bestSum = Math.max(bestSum, currentSum);
  }
  return bestSum;
}

// ----------------------------------------------------------------------------
// Sliding window (tamanho fixo) — média máxima de k consecutivos. O(n).
// ----------------------------------------------------------------------------

export function maxAverageOfWindow(numbers: number[], windowSize: number): number {
  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) windowSum += numbers[i];

  let bestSum = windowSum;
  for (let i = windowSize; i < numbers.length; i++) {
    windowSum += numbers[i] - numbers[i - windowSize];
    bestSum = Math.max(bestSum, windowSum);
  }
  return bestSum / windowSize;
}

// ----------------------------------------------------------------------------
// Sliding window (variável) — tamanho do menor subarray com soma >= target. O(n).
// ----------------------------------------------------------------------------

export function minSubarrayLengthForSum(target: number, numbers: number[]): number {
  let windowStart = 0;
  let windowSum = 0;
  let bestLength = Infinity;

  for (let windowEnd = 0; windowEnd < numbers.length; windowEnd++) {
    windowSum += numbers[windowEnd];

    while (windowSum >= target) {
      bestLength = Math.min(bestLength, windowEnd - windowStart + 1);
      windowSum -= numbers[windowStart];
      windowStart++;
    }
  }
  return bestLength === Infinity ? 0 : bestLength;
}

// ----------------------------------------------------------------------------
// Prefix sum — soma de qualquer intervalo em O(1) após pré-processamento O(n).
// ----------------------------------------------------------------------------

export function buildPrefixSum(numbers: number[]): number[] {
  const prefix = new Array<number>(numbers.length + 1).fill(0);
  for (let i = 0; i < numbers.length; i++) {
    prefix[i + 1] = prefix[i] + numbers[i];
  }
  return prefix;
}

/** Soma de numbers[left..right] inclusivo, dado o prefix sum pré-calculado. */
export function rangeSum(prefix: number[], left: number, right: number): number {
  return prefix[right + 1] - prefix[left];
}

// ----------------------------------------------------------------------------
// Codility — MissingInteger: menor inteiro positivo ausente. O(n).
// ----------------------------------------------------------------------------

export function missingInteger(numbers: number[]): number {
  const present = new Set(numbers);
  for (let candidate = 1; candidate <= numbers.length + 1; candidate++) {
    if (!present.has(candidate)) return candidate;
  }
  return 1;
}

// ----------------------------------------------------------------------------
// Codility — TapeEquilibrium: minimizar |sum(left) - sum(right)|. O(n).
// ----------------------------------------------------------------------------

export function tapeEquilibrium(numbers: number[]): number {
  const total = numbers.reduce((acc, value) => acc + value, 0);

  let leftSum = 0;
  let bestDifference = Infinity;

  for (let i = 0; i < numbers.length - 1; i++) {
    leftSum += numbers[i];
    const rightSum = total - leftSum;
    bestDifference = Math.min(bestDifference, Math.abs(leftSum - rightSum));
  }
  return bestDifference;
}

// ----------------------------------------------------------------------------
// Codility — CyclicRotation: rotacionar K posições à direita. O(n).
// ----------------------------------------------------------------------------

export function rotateRight<T>(items: T[], shift: number): T[] {
  if (items.length === 0) return items;
  const normalizedShift = normalizeShift(shift, items.length);
  return [...items.slice(items.length - normalizedShift), ...items.slice(0, items.length - normalizedShift)];
}

function normalizeShift(shift: number, length: number): number {
  return ((shift % length) + length) % length;
}

// ----------------------------------------------------------------------------
// Boyer-Moore Voting — elemento majoritário (> n/2). O(n) tempo, O(1) memória.
// ----------------------------------------------------------------------------

export function majorityElement(numbers: number[]): number | null {
  const candidate = findMajorityCandidate(numbers);
  return isMajority(numbers, candidate) ? candidate : null;
}

function findMajorityCandidate(numbers: number[]): number {
  let candidate = numbers[0];
  let count = 0;

  for (const value of numbers) {
    if (count === 0) candidate = value;
    count += value === candidate ? 1 : -1;
  }
  return candidate;
}

function isMajority(numbers: number[], candidate: number): boolean {
  const occurrences = numbers.filter(value => value === candidate).length;
  return occurrences > numbers.length / 2;
}

// ----------------------------------------------------------------------------

function runExamples(): void {
  console.log('reverseInPlace:', reverseInPlace([1, 2, 3, 4, 5]));
  console.log('twoSum:', twoSum([2, 7, 11, 15], 9));
  console.log('maxSubarraySum:', maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
  console.log('minSubarrayLengthForSum:', minSubarrayLengthForSum(7, [2, 3, 1, 2, 4, 3])); // 2
  console.log('missingInteger:', missingInteger([1, 3, 6, 4, 1, 2])); // 5
  console.log('tapeEquilibrium:', tapeEquilibrium([3, 1, 2, 4, 3])); // 1
  console.log('rotateRight:', rotateRight([3, 8, 9, 7, 6], 3)); // [9,7,6,3,8]
  console.log('majorityElement:', majorityElement([3, 2, 3]));
}

if (isMainModule(module)) runExamples();
