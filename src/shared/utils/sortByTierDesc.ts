type TierSortable = {
    tier?: number | null;
  };
  
export function sortByTierDesc<T extends TierSortable>(array: T[]): T[] {
    return [...array].sort((a, b) => (b.tier ?? 0) - (a.tier ?? 0));
  }
  