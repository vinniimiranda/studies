/**
 * Stack, Queue, Deque e Priority Queue (Min-Heap).
 *
 *   Stack (LIFO):   push / pop / peek em O(1)
 *   Queue (FIFO):   enqueue em O(1); dequeue em O(1) amortizado
 *   Deque:          push/pop em ambas pontas em O(1)
 *   PriorityQueue:  push/pop em O(log n)
 *
 * Aplicações típicas:
 *   - Stack: parênteses balanceados, undo/redo, DFS iterativo.
 *   - Queue: BFS, simulações, buffers.
 *   - PriorityQueue: Dijkstra, scheduling, Top-K, merge K listas.
 */

import { compareNumbersAsc, compareNumbersDesc, isMainModule, swap } from './_utils';

type Comparator<T> = (a: T, b: T) => number;

// ============================================================================
// Stack — encapsula array.
// ============================================================================

export class Stack<T> {
  private readonly items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// ----------------------------------------------------------------------------
// HackerRank — "Balanced Brackets". Aplicação clássica de Stack.
// ----------------------------------------------------------------------------

const MATCHING_OPEN_BRACKET: Readonly<Record<string, string>> = {
  ')': '(',
  ']': '[',
  '}': '{',
};

function isOpenBracket(char: string): boolean {
  return char === '(' || char === '[' || char === '{';
}

function isCloseBracket(char: string): boolean {
  return char in MATCHING_OPEN_BRACKET;
}

export function isBalanced(brackets: string): boolean {
  const stack: string[] = [];

  for (const char of brackets) {
    if (isOpenBracket(char)) {
      stack.push(char);
    } else if (isCloseBracket(char)) {
      if (stack.pop() !== MATCHING_OPEN_BRACKET[char]) return false;
    }
  }
  return stack.length === 0;
}

// ----------------------------------------------------------------------------
// MinStack — retorna o mínimo em O(1).
// ----------------------------------------------------------------------------

export class MinStack {
  private readonly values: number[] = [];
  private readonly mins: number[] = [];

  push(value: number): void {
    this.values.push(value);
    const previousMin = this.mins[this.mins.length - 1];
    const newMin = this.mins.length === 0 ? value : Math.min(value, previousMin);
    this.mins.push(newMin);
  }

  pop(): number | undefined {
    this.mins.pop();
    return this.values.pop();
  }

  top(): number | undefined {
    return this.values[this.values.length - 1];
  }

  getMin(): number | undefined {
    return this.mins[this.mins.length - 1];
  }
}

// ============================================================================
// Queue eficiente — dois stacks (O(1) amortizado por operação).
// ============================================================================

export class Queue<T> {
  private readonly inbox: T[] = [];
  private readonly outbox: T[] = [];

  enqueue(value: T): void {
    this.inbox.push(value);
  }

  dequeue(): T | undefined {
    if (this.outbox.length === 0) this.drainInboxToOutbox();
    return this.outbox.pop();
  }

  peek(): T | undefined {
    if (this.outbox.length > 0) return this.outbox[this.outbox.length - 1];
    return this.inbox[0];
  }

  get size(): number {
    return this.inbox.length + this.outbox.length;
  }

  private drainInboxToOutbox(): void {
    while (this.inbox.length > 0) this.outbox.push(this.inbox.pop()!);
  }
}

// ============================================================================
// Deque — usando array nativo (push/pop em O(1), unshift/shift em O(n)).
// ============================================================================

export class Deque<T> {
  private readonly items: T[] = [];

  pushFront(value: T): void {
    this.items.unshift(value);
  }
  pushBack(value: T): void {
    this.items.push(value);
  }
  popFront(): T | undefined {
    return this.items.shift();
  }
  popBack(): T | undefined {
    return this.items.pop();
  }
  get size(): number {
    return this.items.length;
  }
}

// ============================================================================
// Min-Heap (Priority Queue) — backed por array.
// ============================================================================

export class MinHeap<T> {
  private readonly data: T[] = [];

  constructor(private readonly compare: Comparator<T> = compareNumbersAsc as unknown as Comparator<T>) {}

  get size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(value: T): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;

    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  // ----- Helpers internos -----

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = MinHeap.parentOf(index);
      if (this.compare(this.data[index], this.data[parentIndex]) >= 0) return;
      swap(this.data, index, parentIndex);
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const smallest = this.smallestAmong(index, MinHeap.leftChildOf(index), MinHeap.rightChildOf(index));
      if (smallest === index) return;
      swap(this.data, index, smallest);
      index = smallest;
    }
  }

  private smallestAmong(parent: number, left: number, right: number): number {
    let smallest = parent;
    if (left < this.data.length && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
    if (right < this.data.length && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
    return smallest;
  }

  private static parentOf(index: number): number {
    return (index - 1) >> 1;
  }
  private static leftChildOf(index: number): number {
    return index * 2 + 1;
  }
  private static rightChildOf(index: number): number {
    return index * 2 + 2;
  }
}

// ----------------------------------------------------------------------------
// Top-K menores — heap de tamanho K com comparador invertido. O(n log k).
// ----------------------------------------------------------------------------

export function topKSmallest(numbers: number[], k: number): number[] {
  const maxHeapOfSizeK = new MinHeap<number>(compareNumbersDesc);

  for (const value of numbers) {
    maxHeapOfSizeK.push(value);
    if (maxHeapOfSizeK.size > k) maxHeapOfSizeK.pop();
  }

  const result: number[] = [];
  while (maxHeapOfSizeK.size > 0) result.unshift(maxHeapOfSizeK.pop()!);
  return result;
}

// ============================================================================

function runExamples(): void {
  console.log('isBalanced "{[()]}":', isBalanced('{[()]}'));
  console.log('isBalanced "{[(])}":', isBalanced('{[(])}'));

  const minStack = new MinStack();
  [3, 5, 2, 1, 4].forEach(value => minStack.push(value));
  console.log('MinStack getMin:', minStack.getMin()); // 1

  const queue = new Queue<number>();
  [1, 2, 3].forEach(value => queue.enqueue(value));
  console.log('Queue dequeue x3:', queue.dequeue(), queue.dequeue(), queue.dequeue());

  console.log('topKSmallest:', topKSmallest([7, 1, 8, 3, 4, 9, 2], 3)); // [1,2,3]
}

if (isMainModule(module)) runExamples();
