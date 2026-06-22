/**
 * Hash Table — implementação didática com separate chaining.
 *
 * Operações esperadas (amortizadas com bom hash):
 *   set / get / delete ........ O(1)
 *   pior caso (muitas colisões) O(n)
 *
 * Em produção, prefira `Map` / `Set` nativos. Este arquivo serve para
 * entender o que acontece por baixo: hashing, buckets, colisões e resize.
 */

import { isMainModule } from './_utils';

type HashEntry<K, V> = { key: K; value: V };

const INITIAL_CAPACITY = 16;
const LOAD_FACTOR_THRESHOLD = 0.75;
const HASH_MULTIPLIER = 31;
const GROWTH_FACTOR = 2;

export class HashTable<K, V> {
  private buckets: Array<Array<HashEntry<K, V>>>;
  private capacity: number;
  private entryCount = 0;

  constructor(initialCapacity = INITIAL_CAPACITY) {
    this.capacity = initialCapacity;
    this.buckets = HashTable.createEmptyBuckets<K, V>(initialCapacity);
  }

  get size(): number {
    return this.entryCount;
  }

  set(key: K, value: V): void {
    const bucket = this.bucketFor(key);
    const existing = bucket.find(entry => entry.key === key);

    if (existing !== undefined) {
      existing.value = value;
      return;
    }

    bucket.push({ key, value });
    this.entryCount++;

    if (this.shouldGrow()) this.resize(this.capacity * GROWTH_FACTOR);
  }

  get(key: K): V | undefined {
    return this.bucketFor(key).find(entry => entry.key === key)?.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    const bucket = this.bucketFor(key);
    const index = bucket.findIndex(entry => entry.key === key);
    if (index === -1) return false;

    bucket.splice(index, 1);
    this.entryCount--;
    return true;
  }

  *entries(): IterableIterator<[K, V]> {
    for (const bucket of this.buckets) {
      for (const entry of bucket) yield [entry.key, entry.value];
    }
  }

  // ----- Helpers privados -----

  private bucketFor(key: K): Array<HashEntry<K, V>> {
    return this.buckets[this.hash(key)];
  }

  private hash(key: K): number {
    const stringKey = String(key);
    let hashCode = 0;
    for (let i = 0; i < stringKey.length; i++) {
      hashCode = (hashCode * HASH_MULTIPLIER + stringKey.charCodeAt(i)) | 0;
    }
    return Math.abs(hashCode) % this.capacity;
  }

  private shouldGrow(): boolean {
    return this.entryCount / this.capacity > LOAD_FACTOR_THRESHOLD;
  }

  private resize(newCapacity: number): void {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = HashTable.createEmptyBuckets<K, V>(newCapacity);
    this.entryCount = 0;

    for (const bucket of oldBuckets) {
      for (const entry of bucket) this.set(entry.key, entry.value);
    }
  }

  private static createEmptyBuckets<K, V>(capacity: number): Array<Array<HashEntry<K, V>>> {
    return Array.from({ length: capacity }, () => []);
  }
}

// ============================================================================
// Aplicações clássicas de Hash Table.
// ============================================================================

/** Anagrama por contagem de caracteres. O(n). */
export function isAnagram(first: string, second: string): boolean {
  if (first.length !== second.length) return false;

  const counts = new Map<string, number>();
  for (const char of first) counts.set(char, (counts.get(char) ?? 0) + 1);

  for (const char of second) {
    const remaining = (counts.get(char) ?? 0) - 1;
    if (remaining < 0) return false;
    counts.set(char, remaining);
  }
  return true;
}

/** Agrupa anagramas. O(n · k log k) com k = tamanho da palavra. */
export function groupAnagrams(words: string[]): string[][] {
  const groupsByCanonical = new Map<string, string[]>();

  for (const word of words) {
    const canonical = canonicalAnagramKey(word);
    const group = groupsByCanonical.get(canonical) ?? [];
    group.push(word);
    groupsByCanonical.set(canonical, group);
  }
  return [...groupsByCanonical.values()];
}

function canonicalAnagramKey(word: string): string {
  return [...word].sort().join('');
}

/** Primeiro caractere que não se repete. O(n). */
export function firstNonRepeating(text: string): string | null {
  const counts = new Map<string, number>();
  for (const char of text) counts.set(char, (counts.get(char) ?? 0) + 1);

  for (const char of text) {
    if (counts.get(char) === 1) return char;
  }
  return null;
}

/**
 * Conta subarrays contíguos cuja soma é exatamente `target`.
 * Prefix sum + hash map. O(n).
 */
export function countSubarraysWithSum(numbers: number[], target: number): number {
  const prefixCounts = new Map<number, number>([[0, 1]]);
  let prefixSum = 0;
  let matchCount = 0;

  for (const value of numbers) {
    prefixSum += value;
    matchCount += prefixCounts.get(prefixSum - target) ?? 0;
    prefixCounts.set(prefixSum, (prefixCounts.get(prefixSum) ?? 0) + 1);
  }
  return matchCount;
}

// ============================================================================

function runExamples(): void {
  const table = new HashTable<string, number>();
  table.set('a', 1);
  table.set('b', 2);
  table.set('a', 99);
  console.log('get a:', table.get('a')); // 99
  console.log('has b:', table.has('b'));
  console.log('size:', table.size);

  console.log('isAnagram listen/silent:', isAnagram('listen', 'silent'));
  console.log('groupAnagrams:', groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));
  console.log('firstNonRepeating:', firstNonRepeating('aabbcdd')); // c
  console.log('countSubarraysWithSum:', countSubarraysWithSum([1, 1, 1], 2)); // 2
}

if (isMainModule(module)) runExamples();
