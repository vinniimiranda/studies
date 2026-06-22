# Algoritmos e Estruturas de Dados — TypeScript

Exemplos práticos focados em entrevistas estilo **HackerRank** e **Codility**.

## Índice

| Arquivo | Conteúdo |
|---|---|
| [`_utils.ts`](./_utils.ts) | Helpers compartilhados: `swap`, `midpoint`, comparadores, `isMainModule` |
| [`01-big-o-notation.ts`](./01-big-o-notation.ts) | Exemplos de O(1), O(log n), O(n), O(n log n), O(n²), O(2^n), O(n!) com armadilhas comuns |
| [`02-arrays.ts`](./02-arrays.ts) | Two pointers, sliding window (fixo e variável), prefix sum, Kadane, MissingInteger, TapeEquilibrium, CyclicRotation, Boyer-Moore |
| [`03-linked-list.ts`](./03-linked-list.ts) | Singly & Doubly LinkedList, reverse, Floyd cycle detection, middle, merge, removeNthFromEnd |
| [`04-stack-queue.ts`](./04-stack-queue.ts) | Stack, MinStack, Queue (two-stacks), Deque, MinHeap (priority queue), parênteses balanceados, Top-K |
| [`05-hash-table.ts`](./05-hash-table.ts) | HashTable com separate chaining + resize, anagrama, groupAnagrams, firstNonRepeating, subarrays com soma K |
| [`06-tree.ts`](./06-tree.ts) | BST (insert/contains/remove), traversals (pre/in/post/level), altura, validar BST, LCA, Trie |
| [`07-sorting.ts`](./07-sorting.ts) | Bubble, Selection, Insertion, Merge, Quick (com pivô aleatório), Heap, Counting |
| [`08-searching.ts`](./08-searching.ts) | Linear, Binary, lower/upper bound, first occurrence, rotated sorted, peak, isqrt, ship-within-days |
| [`09-hackerrank-codility.ts`](./09-hackerrank-codility.ts) | BinaryGap, OddOccurrencesInArray, FrogJmp, PermCheck, MissingInteger, PassingCars, CountDiv, SockMerchant, JumpingOnClouds, RepeatedString, HourglassSum, LeftRotation, MinimumBribes |

## Como executar

Cada arquivo é executável de forma independente.

```bash
# Instalar uma vez (Node + ts-node)
npm i -g ts-node typescript @types/node

# Rodar qualquer arquivo
ts-node 01-big-o-notation.ts
ts-node 07-sorting.ts
```

Ou compile tudo:

```bash
tsc --strict --target es2020 --module commonjs *.ts
node 01-big-o-notation.js
```

## Tabela de referência — Big O das estruturas

| Estrutura | Acesso | Busca | Inserção | Remoção |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* |
| Stack | O(n) | O(n) | O(1) | O(1) |
| Queue | O(n) | O(n) | O(1) | O(1) |
| Hash Table | — | O(1)† | O(1)† | O(1)† |
| BST balanceada | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | O(1) (topo) | O(n) | O(log n) | O(log n) |
| Trie | — | O(m) | O(m) | O(m) |

\* dado o ponteiro; † amortizado (pior caso O(n)); `m` = tamanho da chave.

## Tabela de referência — Big O dos sorts

| Algoritmo | Best | Avg | Worst | Espaço | Estável |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | sim |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | não |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | sim |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | sim |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | não |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | não |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | sim |

## Princípios de Clean Code aplicados

- **Nomes descritivos** em vez de letras isoladas: `low`/`high` em vez de `lo`/`hi`, `windowSum` em vez de `sum`.
- **Funções pequenas com responsabilidade única** — ex.: `partitionAroundRandomPivot`, `findMajorityCandidate`, `isLeftHalfSorted`, `sumHourglassAt`.
- **Constantes nomeadas** em vez de magic numbers: `NOT_FOUND`, `LOAD_FACTOR_THRESHOLD`, `SAFE_CLOUD`, `MAX_BRIBES_PER_PERSON`.
- **Early returns** para reduzir aninhamento.
- **Helpers extraídos** para [`_utils.ts`](./_utils.ts): `swap`, `midpoint`, comparadores reutilizáveis.
- **Demo isolada** em uma função `runExamples()` no fim do arquivo, executada via `isMainModule(module)` — o corpo do arquivo fica focado nos algoritmos.
- **JSDoc com complexidade** em cada função pública, sem repetir o que o código já diz.
- **`readonly` em campos imutáveis** das classes para sinalizar intenção.

## Dicas para entrevistas

- **Comece pela complexidade**: declare o Big O alvo antes de codar.
- **Two pointers** e **sliding window** resolvem ~30% dos problemas de array.
- **Prefix sum** transforma queries de soma de O(n) para O(1).
- **HashMap** troca tempo por memória — quase sempre vale.
- **Binary search by answer**: quando a resposta é monotônica, você pode buscar binariamente sobre ela.
- **Heap** é a estrutura para "Top-K", "Kth menor/maior" e merge de K listas.
- **DFS recursivo** estoura stack em árvores muito altas — converta para iterativo com `Stack`.
