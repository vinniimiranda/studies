/**
 * Utilitários compartilhados — pequenos, puros e bem nomeados.
 *
 * Princípio: eliminar duplicação trivial nos exemplos sem esconder
 * a intenção dos algoritmos.
 */

/** Troca dois elementos de um array in-place. */
export function swap<T>(array: T[], i: number, j: number): void {
  [array[i], array[j]] = [array[j], array[i]];
}

/** Calcula o índice do meio sem risco de overflow. */
export function midpoint(low: number, high: number): number {
  return low + ((high - low) >> 1);
}

/** Comparador numérico padrão (ascendente). */
export function compareNumbersAsc(a: number, b: number): number {
  return a - b;
}

/** Comparador numérico descendente — útil para "Top-K maiores". */
export function compareNumbersDesc(a: number, b: number): number {
  return b - a;
}

/** True quando o arquivo está sendo executado diretamente (não importado). */
export function isMainModule(moduleObj: NodeModule): boolean {
  return require.main === moduleObj;
}

/** Gera um inteiro aleatório no intervalo [low, high] (inclusivo). */
export function randomInt(low: number, high: number): number {
  return low + Math.floor(Math.random() * (high - low + 1));
}
