/**
 * Big O Notation — exemplos práticos em TypeScript.
 *
 * Hierarquia (do mais rápido ao mais lento):
 *   O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!)
 *
 * Cada função aqui é o menor exemplo possível da complexidade indicada,
 * para servir como referência rápida.
 */

import { isMainModule, midpoint } from './_utils';

// ----------------------------------------------------------------------------
// O(1) — Tempo constante.
// ----------------------------------------------------------------------------

/** Acesso por índice é independente do tamanho do array. */
export function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// ----------------------------------------------------------------------------
// O(log n) — Tempo logarítmico (divide e conquista).
// ----------------------------------------------------------------------------

const NOT_FOUND = -1;

/** Busca binária em array ordenado. */
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
// O(n) — Tempo linear.
// ----------------------------------------------------------------------------

/** Soma dos elementos: visita cada elemento exatamente uma vez. */
export function sum(numbers: number[]): number {
  let total = 0;
  for (const value of numbers) total += value;
  return total;
}

// ----------------------------------------------------------------------------
// O(n log n) — Sorts eficientes (merge, heap, quicksort médio).
// ----------------------------------------------------------------------------

/** Cópia ordenada — não muta o array original. */
export function sortedCopy(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => a - b);
}

// ----------------------------------------------------------------------------
// O(n²) — Loops aninhados sobre a mesma entrada.
// ----------------------------------------------------------------------------

/** Implementação ingênua: compara cada par de elementos. */
export function hasDuplicateQuadratic(numbers: number[]): boolean {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] === numbers[j]) return true;
    }
  }
  return false;
}

/** Mesmo problema em O(n): troca tempo por memória usando Set. */
export function hasDuplicate(numbers: number[]): boolean {
  const seen = new Set<number>();
  for (const value of numbers) {
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
}

// ----------------------------------------------------------------------------
// O(2^n) — Recursão sem memoization.
// ----------------------------------------------------------------------------

/** Fibonacci ingênuo: cada chamada gera duas novas. */
export function fibonacciSlow(n: number): number {
  if (n < 2) return n;
  return fibonacciSlow(n - 1) + fibonacciSlow(n - 2);
}

/** Mesma função em O(n) com memoization. */
export function fibonacciFast(n: number): number {
  const memo = new Map<number, number>();

  function compute(value: number): number {
    if (value < 2) return value;
    const cached = memo.get(value);
    if (cached !== undefined) return cached;
    const result = compute(value - 1) + compute(value - 2);
    memo.set(value, result);
    return result;
  }

  return compute(n);
}

// ----------------------------------------------------------------------------
// O(n!) — Explosão fatorial.
// ----------------------------------------------------------------------------

/** Gera todas as permutações — número de saídas é n!. */
export function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];

  const result: T[][] = [];
  for (let i = 0; i < items.length; i++) {
    const remaining = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const permutation of permutations(remaining)) {
      result.push([items[i], ...permutation]);
    }
  }
  return result;
}

// ----------------------------------------------------------------------------
// Armadilhas comuns:
//
//   - `array.includes(x)` dentro de um loop transforma O(n) em O(n²).
//   - `array.unshift(x)` é O(n) — prefira `push` quando possível.
//   - Concatenar strings com `+=` em loop pode ser O(n²); use `Array.join`.
//   - Recursão sem memoization explode (ver fibonacciSlow vs fibonacciFast).
// ----------------------------------------------------------------------------

function runExamples(): void {
  const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
  const sorted = [1, 2, 3, 4, 5, 9];

  console.log('O(1)  getFirst:', getFirst(numbers));
  console.log('O(log n) binarySearch(9):', binarySearch(sorted, 9));
  console.log('O(n)  sum:', sum(numbers));
  console.log('O(n²) hasDuplicateQuadratic:', hasDuplicateQuadratic(numbers));
  console.log('O(n)  hasDuplicate:', hasDuplicate(numbers));
  console.log('O(2^n) fibonacciSlow(20):', fibonacciSlow(20));
  console.log('O(n)  fibonacciFast(50):', fibonacciFast(50));
  console.log('O(n!) permutations([1,2,3]):', permutations([1, 2, 3]));
}

if (isMainModule(module)) runExamples();
