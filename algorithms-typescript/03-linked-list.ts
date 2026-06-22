/**
 * Linked List — Singly e Doubly.
 *
 * Vantagens vs Array:
 *   - Inserção/remoção no início em O(1).
 *   - Tamanho dinâmico sem realocação.
 * Desvantagens:
 *   - Acesso por índice em O(n).
 *   - Péssima localidade de cache.
 */

import { isMainModule } from './_utils';

// ============================================================================
// Singly Linked List
// ============================================================================

export class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private length = 0;

  get size(): number {
    return this.length;
  }

  /** Adiciona no final. O(1). */
  push(value: T): void {
    const node = new ListNode(value);
    if (this.tail === null) this.head = node;
    else this.tail.next = node;
    this.tail = node;
    this.length++;
  }

  /** Adiciona no início. O(1). */
  unshift(value: T): void {
    this.head = new ListNode(value, this.head);
    if (this.tail === null) this.tail = this.head;
    this.length++;
  }

  /** Remove a primeira ocorrência do valor. O(n). */
  remove(value: T): boolean {
    if (this.head === null) return false;

    if (this.head.value === value) {
      this.removeHead();
      return true;
    }

    const previous = this.findNodeBefore(value);
    if (previous === null) return false;

    this.removeAfter(previous);
    return true;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let node = this.head; node !== null; node = node.next) {
      result.push(node.value);
    }
    return result;
  }

  getHead(): ListNode<T> | null {
    return this.head;
  }

  // ----- Helpers privados: cada um faz uma única coisa. -----

  private removeHead(): void {
    this.head = this.head!.next;
    if (this.head === null) this.tail = null;
    this.length--;
  }

  private findNodeBefore(value: T): ListNode<T> | null {
    let previous = this.head;
    while (previous !== null && previous.next !== null && previous.next.value !== value) {
      previous = previous.next;
    }
    return previous !== null && previous.next !== null ? previous : null;
  }

  private removeAfter(previous: ListNode<T>): void {
    previous.next = previous.next!.next;
    if (previous.next === null) this.tail = previous;
    this.length--;
  }
}

// ============================================================================
// Algoritmos clássicos sobre Singly Linked List
// ============================================================================

/** Inverte uma lista in-place. O(n) tempo / O(1) memória. */
export function reverseList<T>(head: ListNode<T> | null): ListNode<T> | null {
  let previous: ListNode<T> | null = null;
  let current = head;

  while (current !== null) {
    const next: ListNode<T> | null = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}

/** Floyd's Tortoise & Hare — detecta ciclo. O(n) / O(1). */
export function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

/** Encontra o nó do meio (o segundo meio em listas de tamanho par). O(n) / O(1). */
export function findMiddleNode<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

/** Merge de duas listas ordenadas. O(n + m). */
export function mergeSortedLists(
  first: ListNode<number> | null,
  second: ListNode<number> | null,
): ListNode<number> | null {
  const sentinel = new ListNode<number>(0);
  let tail = sentinel;

  while (first !== null && second !== null) {
    if (first.value <= second.value) {
      tail.next = first;
      first = first.next;
    } else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }
  tail.next = first ?? second;
  return sentinel.next;
}

/** Remove o N-ésimo nó a partir do fim. Uma passada com two-pointer. O(n). */
export function removeNthFromEnd<T>(head: ListNode<T> | null, positionFromEnd: number): ListNode<T> | null {
  const sentinel = new ListNode<T>(undefined as unknown as T, head);
  let leading: ListNode<T> | null = sentinel;
  let trailing: ListNode<T> | null = sentinel;

  // Avança leading positionFromEnd + 1 passos à frente de trailing.
  for (let step = 0; step <= positionFromEnd; step++) leading = leading!.next;

  while (leading !== null) {
    trailing = trailing!.next;
    leading = leading.next;
  }
  trailing!.next = trailing!.next!.next;
  return sentinel.next;
}

// ============================================================================
// Doubly Linked List — útil para LRU Cache.
// ============================================================================

export class DoublyListNode<T> {
  previous: DoublyListNode<T> | null = null;
  next: DoublyListNode<T> | null = null;
  constructor(public value: T) {}
}

export class DoublyLinkedList<T> {
  head: DoublyListNode<T> | null = null;
  tail: DoublyListNode<T> | null = null;
  size = 0;

  pushBack(value: T): DoublyListNode<T> {
    const node = new DoublyListNode(value);
    node.previous = this.tail;
    if (this.tail !== null) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.size++;
    return node;
  }

  remove(node: DoublyListNode<T>): void {
    if (node.previous !== null) node.previous.next = node.next;
    else this.head = node.next;

    if (node.next !== null) node.next.previous = node.previous;
    else this.tail = node.previous;

    this.size--;
  }
}

// ============================================================================

function nodesToArray<T>(head: ListNode<T> | null): T[] {
  const result: T[] = [];
  for (let node = head; node !== null; node = node.next) result.push(node.value);
  return result;
}

function runExamples(): void {
  const list = new LinkedList<number>();
  [1, 2, 3, 4, 5].forEach(value => list.push(value));
  console.log('list:', list.toArray());

  const reversed = reverseList(list.getHead());
  console.log('reversed:', nodesToArray(reversed));
  console.log('middle:', findMiddleNode(reversed)?.value);
}

if (isMainModule(module)) runExamples();
