export function formatearNumero(valor: number): string {
  return new Intl.NumberFormat('es-ES').format(valor);
}

export function formatearTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function calcularPorcentaje(actual: number, meta: number): number {
  if (meta <= 0) return 0;
  return Math.min(100, (actual / meta) * 100);
}
