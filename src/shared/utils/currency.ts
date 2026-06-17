export function formatBRL(value: number | string | null | undefined): string {
  const num = value == null ? null : Number(value);
  if (num == null || !Number.isFinite(num)) return 'R$ 0,00';
  const fixed = num.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${intFormatted},${decPart}`;
}
