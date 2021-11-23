export function shuffle<T>(array: T[]) {
  return array.slice().sort(() => Math.random() - 0.5);
}
