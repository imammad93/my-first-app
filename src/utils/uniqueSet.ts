/** Generates `count` distinct-by-key items, falling back to allowing repeats only if the
 * underlying generator's combination space is too small to fill the round. */
export function generateUniqueSet<Q>(
  generateOne: () => Q,
  keyOf: (q: Q) => string,
  count: number,
  maxAttempts = 400
): Q[] {
  const items: Q[] = [];
  const seenKeys = new Set<string>();

  for (let attempt = 0; attempt < maxAttempts && items.length < count; attempt++) {
    const candidate = generateOne();
    const key = keyOf(candidate);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      items.push(candidate);
    }
  }

  while (items.length < count) {
    items.push(generateOne());
  }

  return items;
}
