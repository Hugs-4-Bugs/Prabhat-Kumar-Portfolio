export function selectedSuggestedSlotIndex(message: string, count: number): number | null {
  if (count < 1) return null;
  const normalized = message.trim().toLowerCase();
  const optionMatch = normalized.match(/(?:option|slot|time)\s*(\d+)/);
  if (optionMatch) {
    const index = Number(optionMatch[1]) - 1;
    return index >= 0 && index < count ? index : null;
  }
  if (/\b(first|one|1)\b/.test(normalized)) return 0;
  if (count > 1 && /\b(second|two|2)\b/.test(normalized)) return 1;
  if (count > 2 && /\b(third|three|3)\b/.test(normalized)) return 2;
  return null;
}
