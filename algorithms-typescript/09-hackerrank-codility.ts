/**
 * Problemas clássicos — HackerRank / Codility.
 *
 * Cobre as Lessons mais frequentes da Codility e os problemas comuns do
 * "Problem Solving" do HackerRank.
 */

import { isMainModule } from './_utils';

// ============================================================================
// Codility — Lesson 1: BinaryGap.
// Maior sequência de zeros entre dois 1s na representação binária de N.
// ============================================================================

export function binaryGap(n: number): number {
  const binary = n.toString(2);
  let longestGap = 0;
  let currentGapLength = 0;
  let firstOneSeen = false;

  for (const bit of binary) {
    if (bit === '1') {
      if (firstOneSeen) longestGap = Math.max(longestGap, currentGapLength);
      firstOneSeen = true;
      currentGapLength = 0;
    } else if (firstOneSeen) {
      currentGapLength++;
    }
  }
  return longestGap;
}

// ============================================================================
// Codility — OddOccurrencesInArray.
// Em um array onde todos aparecem em pares menos um, encontra o ímpar. O(n).
// XOR cancela pares.
// ============================================================================

export function oddOccurrence(numbers: number[]): number {
  return numbers.reduce((accumulator, value) => accumulator ^ value, 0);
}

// ============================================================================
// Codility — FrogJmp.
// Quantos saltos de tamanho `jumpSize`, partindo de `start`,
// para alcançar pelo menos `target`. O(1).
// ============================================================================

export function frogJumps(start: number, target: number, jumpSize: number): number {
  return Math.ceil((target - start) / jumpSize);
}

// ============================================================================
// Codility — PermCheck.
// Verifica se o array é permutação de 1..N. O(n).
// ============================================================================

const IS_PERMUTATION = 1;
const NOT_PERMUTATION = 0;

export function isPermutation(numbers: number[]): typeof IS_PERMUTATION | typeof NOT_PERMUTATION {
  const expectedLength = numbers.length;
  const seen = new Array<boolean>(expectedLength + 1).fill(false);

  for (const value of numbers) {
    if (value < 1 || value > expectedLength || seen[value]) return NOT_PERMUTATION;
    seen[value] = true;
  }
  return IS_PERMUTATION;
}

// ============================================================================
// Codility — MissingInteger.
// Menor inteiro positivo (>0) que NÃO está no array. O(n).
// ============================================================================

export function missingInteger(numbers: number[]): number {
  const present = new Set(numbers);
  for (let candidate = 1; candidate <= numbers.length + 1; candidate++) {
    if (!present.has(candidate)) return candidate;
  }
  return 1;
}

// ============================================================================
// Codility — PassingCars.
// Pares (P, Q) com P < Q, cars[P] = 0 (oeste→leste) e cars[Q] = 1.
// Retorna -1 se ultrapassar 1e9.
// ============================================================================

const PASSING_CARS_LIMIT = 1_000_000_000;
const EASTBOUND = 0;
const PASSING_CARS_OVERFLOW = -1;

export function passingCars(cars: number[]): number {
  let eastboundSoFar = 0;
  let passingPairs = 0;

  for (const direction of cars) {
    if (direction === EASTBOUND) {
      eastboundSoFar++;
      continue;
    }
    passingPairs += eastboundSoFar;
    if (passingPairs > PASSING_CARS_LIMIT) return PASSING_CARS_OVERFLOW;
  }
  return passingPairs;
}

// ============================================================================
// Codility — CountDiv.
// Quantos inteiros em [from, to] são divisíveis por `divisor`. O(1).
// ============================================================================

export function countDivisible(from: number, to: number, divisor: number): number {
  return Math.floor(to / divisor) - Math.floor((from - 1) / divisor);
}

// ============================================================================
// HackerRank — Sock Merchant.
// Quantos pares de meias podem ser formados.
// ============================================================================

export function sockMerchant(sockColors: number[]): number {
  const countByColor = new Map<number, number>();
  for (const color of sockColors) countByColor.set(color, (countByColor.get(color) ?? 0) + 1);

  let totalPairs = 0;
  for (const count of countByColor.values()) totalPairs += Math.floor(count / 2);
  return totalPairs;
}

// ============================================================================
// HackerRank — Jumping on the Clouds.
// Mínimo de saltos para chegar ao fim (0 = nuvem segura, 1 = trovão).
// Greedy: salta 2 quando possível.
// ============================================================================

const SAFE_CLOUD = 0;

export function jumpingOnClouds(clouds: number[]): number {
  let jumps = 0;
  let position = 0;

  while (position < clouds.length - 1) {
    const canSkipOne = position + 2 < clouds.length && clouds[position + 2] === SAFE_CLOUD;
    position += canSkipOne ? 2 : 1;
    jumps++;
  }
  return jumps;
}

// ============================================================================
// HackerRank — Repeated String.
// Quantos 'a's nos primeiros `totalLength` caracteres de `pattern` repetido.
// ============================================================================

const LETTER_A = 'a';

export function countAsInRepeatedString(pattern: string, totalLength: number): number {
  const asPerPattern = countLetterA(pattern);
  const fullRepeats = Math.floor(totalLength / pattern.length);
  const remainder = totalLength % pattern.length;
  const asInRemainder = countLetterA(pattern.slice(0, remainder));
  return fullRepeats * asPerPattern + asInRemainder;
}

function countLetterA(text: string): number {
  let count = 0;
  for (const char of text) if (char === LETTER_A) count++;
  return count;
}

// ============================================================================
// HackerRank — 2D Array DS: Hourglass Sum.
// Em matriz 6x6, encontra a maior soma de "ampulheta" (3 + 1 + 3).
// ============================================================================

const HOURGLASS_GRID_SIZE = 6;
const HOURGLASS_LAST_TOP_INDEX = HOURGLASS_GRID_SIZE - 3;

export function hourglassSum(matrix: number[][]): number {
  let maxSum = -Infinity;

  for (let row = 0; row <= HOURGLASS_LAST_TOP_INDEX; row++) {
    for (let col = 0; col <= HOURGLASS_LAST_TOP_INDEX; col++) {
      maxSum = Math.max(maxSum, sumHourglassAt(matrix, row, col));
    }
  }
  return maxSum;
}

function sumHourglassAt(matrix: number[][], topRow: number, leftCol: number): number {
  const top = matrix[topRow][leftCol] + matrix[topRow][leftCol + 1] + matrix[topRow][leftCol + 2];
  const middle = matrix[topRow + 1][leftCol + 1];
  const bottom = matrix[topRow + 2][leftCol] + matrix[topRow + 2][leftCol + 1] + matrix[topRow + 2][leftCol + 2];
  return top + middle + bottom;
}

// ============================================================================
// HackerRank — Left Rotation. Rotaciona `shift` posições à esquerda.
// ============================================================================

export function leftRotation<T>(items: T[], shift: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((shift % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

// ============================================================================
// HackerRank — New Year Chaos / Minimum Bribes.
// Cada pessoa pode subornar no máximo 2. Conta total de subornos
// ou retorna "Too chaotic".
// ============================================================================

const TOO_CHAOTIC = 'Too chaotic';
const MAX_BRIBES_PER_PERSON = 2;

export function minimumBribes(queue: number[]): number | typeof TOO_CHAOTIC {
  let totalBribes = 0;

  for (let position = 0; position < queue.length; position++) {
    const originalPosition = queue[position];
    const positionsMovedForward = originalPosition - (position + 1);

    if (positionsMovedForward > MAX_BRIBES_PER_PERSON) return TOO_CHAOTIC;

    const earliestBriberIndex = Math.max(0, originalPosition - MAX_BRIBES_PER_PERSON);
    for (let i = earliestBriberIndex; i < position; i++) {
      if (queue[i] > originalPosition) totalBribes++;
    }
  }
  return totalBribes;
}

// ============================================================================

function runExamples(): void {
  console.log('binaryGap(529):', binaryGap(529)); // 4
  console.log('oddOccurrence:', oddOccurrence([9, 3, 9, 3, 9, 7, 9])); // 7
  console.log('frogJumps(10, 85, 30):', frogJumps(10, 85, 30)); // 3
  console.log('isPermutation:', isPermutation([4, 1, 3, 2])); // 1
  console.log('missingInteger:', missingInteger([1, 3, 6, 4, 1, 2])); // 5
  console.log('passingCars:', passingCars([0, 1, 0, 1, 1])); // 5
  console.log('sockMerchant:', sockMerchant([10, 20, 20, 10, 10, 30, 50, 10, 20])); // 3
  console.log('jumpingOnClouds:', jumpingOnClouds([0, 0, 1, 0, 0, 1, 0])); // 3
  console.log('countAsInRepeatedString:', countAsInRepeatedString('aba', 10)); // 7
  console.log('leftRotation:', leftRotation([1, 2, 3, 4, 5], 2)); // [3,4,5,1,2]
  console.log('minimumBribes:', minimumBribes([2, 1, 5, 3, 4])); // 3
}

if (isMainModule(module)) runExamples();
