/**
 * Árvores — Binary Search Tree, Traversals e Trie.
 *
 * BST balanceada:
 *   insert / search / delete em O(log n)
 *   degenerada (chain): O(n) — em produção use AVL ou Red-Black.
 *
 * Traversals (DFS):
 *   preOrder  : raiz, esq, dir
 *   inOrder   : esq, raiz, dir   (em BST → ordenado)
 *   postOrder : esq, dir, raiz
 * BFS (level-order): usa fila.
 */

import { compareNumbersAsc, isMainModule } from './_utils';

type Comparator<T> = (a: T, b: T) => number;

// ============================================================================
// Binary Search Tree
// ============================================================================

export class TreeNode<T> {
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(public value: T) {}
}

export class BinarySearchTree<T> {
  root: TreeNode<T> | null = null;

  constructor(private readonly compare: Comparator<T> = compareNumbersAsc as unknown as Comparator<T>) {}

  /** Inserção iterativa. O(h). */
  insert(value: T): void {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      const isLess = this.compare(value, current.value) < 0;
      const childSide: 'left' | 'right' = isLess ? 'left' : 'right';

      if (current[childSide] === null) {
        current[childSide] = newNode;
        return;
      }
      current = current[childSide]!;
    }
  }

  /** Busca iterativa. O(h). */
  contains(value: T): boolean {
    let current = this.root;
    while (current !== null) {
      const comparison = this.compare(value, current.value);
      if (comparison === 0) return true;
      current = comparison < 0 ? current.left : current.right;
    }
    return false;
  }

  /** Remoção recursiva. O(h). */
  remove(value: T): void {
    this.root = this.removeFromSubtree(this.root, value);
  }

  // ----- Remoção: três casos isolados em métodos próprios. -----

  private removeFromSubtree(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (node === null) return null;

    const comparison = this.compare(value, node.value);
    if (comparison < 0) {
      node.left = this.removeFromSubtree(node.left, value);
      return node;
    }
    if (comparison > 0) {
      node.right = this.removeFromSubtree(node.right, value);
      return node;
    }
    return this.removeMatchingNode(node);
  }

  private removeMatchingNode(node: TreeNode<T>): TreeNode<T> | null {
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    const successor = this.findMinNode(node.right);
    node.value = successor.value;
    node.right = this.removeFromSubtree(node.right, successor.value);
    return node;
  }

  private findMinNode(node: TreeNode<T>): TreeNode<T> {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }
}

// ============================================================================
// Traversals
// ============================================================================

export function inOrder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  function visit(node: TreeNode<T> | null): void {
    if (node === null) return;
    visit(node.left);
    result.push(node.value);
    visit(node.right);
  }
  visit(root);
  return result;
}

export function preOrder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  function visit(node: TreeNode<T> | null): void {
    if (node === null) return;
    result.push(node.value);
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return result;
}

export function postOrder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  function visit(node: TreeNode<T> | null): void {
    if (node === null) return;
    visit(node.left);
    visit(node.right);
    result.push(node.value);
  }
  visit(root);
  return result;
}

/** BFS — level order. */
export function levelOrder<T>(root: TreeNode<T> | null): T[][] {
  if (root === null) return [];

  const levels: T[][] = [];
  let currentLevel: TreeNode<T>[] = [root];

  while (currentLevel.length > 0) {
    levels.push(currentLevel.map(node => node.value));
    currentLevel = childrenOf(currentLevel);
  }
  return levels;
}

function childrenOf<T>(nodes: TreeNode<T>[]): TreeNode<T>[] {
  const result: TreeNode<T>[] = [];
  for (const node of nodes) {
    if (node.left !== null) result.push(node.left);
    if (node.right !== null) result.push(node.right);
  }
  return result;
}

/** Altura da árvore. O(n). */
export function height<T>(node: TreeNode<T> | null): number {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

/** Valida que cada valor está dentro do intervalo permitido pela BST. O(n). */
export function isValidBST(root: TreeNode<number> | null): boolean {
  function isWithinBounds(node: TreeNode<number> | null, min: number, max: number): boolean {
    if (node === null) return true;
    if (node.value <= min || node.value >= max) return false;
    return isWithinBounds(node.left, min, node.value) && isWithinBounds(node.right, node.value, max);
  }
  return isWithinBounds(root, -Infinity, Infinity);
}

/** Lowest Common Ancestor em BST. O(h). */
export function lowestCommonAncestorBST(
  root: TreeNode<number> | null,
  first: number,
  second: number,
): TreeNode<number> | null {
  let current = root;
  while (current !== null) {
    if (first < current.value && second < current.value) current = current.left;
    else if (first > current.value && second > current.value) current = current.right;
    else return current;
  }
  return null;
}

// ============================================================================
// Trie (prefix tree) — autocomplete e dicionários.
// insert / search / startsWith em O(m), com m = tamanho da palavra.
// ============================================================================

class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isWordEnd = false;
}

export class Trie {
  private readonly root = new TrieNode();

  insert(word: string): void {
    let current = this.root;
    for (const char of word) {
      let next = current.children.get(char);
      if (next === undefined) {
        next = new TrieNode();
        current.children.set(char, next);
      }
      current = next;
    }
    current.isWordEnd = true;
  }

  search(word: string): boolean {
    const node = this.traverse(word);
    return node !== null && node.isWordEnd;
  }

  startsWith(prefix: string): boolean {
    return this.traverse(prefix) !== null;
  }

  private traverse(path: string): TrieNode | null {
    let current = this.root;
    for (const char of path) {
      const next = current.children.get(char);
      if (next === undefined) return null;
      current = next;
    }
    return current;
  }
}

// ============================================================================

function runExamples(): void {
  const tree = new BinarySearchTree<number>();
  [5, 3, 7, 1, 4, 6, 8].forEach(value => tree.insert(value));

  console.log('inOrder:', inOrder(tree.root)); // 1 3 4 5 6 7 8
  console.log('preOrder:', preOrder(tree.root));
  console.log('levelOrder:', levelOrder(tree.root));
  console.log('height:', height(tree.root));
  console.log('isValidBST:', isValidBST(tree.root));
  console.log('LCA(1, 4):', lowestCommonAncestorBST(tree.root, 1, 4)?.value); // 3

  const trie = new Trie();
  ['apple', 'app', 'apex'].forEach(word => trie.insert(word));
  console.log('search apple:', trie.search('apple'));
  console.log('search app:', trie.search('app'));
  console.log('startsWith ap:', trie.startsWith('ap'));
  console.log('search ban:', trie.search('ban'));
}

if (isMainModule(module)) runExamples();
