export function range(count: number): number[] {
  return Array.from(new Array(count).keys());
}
export function rangeFT(from: number, to: number): number[] {
  if (from === to) {
    return [from];
  }
  const max = Math.max(from, to);
  const min = Math.min(from, to);
  const isInc = from < to;
  const count = max - min;
  return range(count).map((i) => (isInc ? min + i : max - i - 1));
}
