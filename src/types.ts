export interface Category {
  name: string;
  displayName: string;
  options: string[];
  allOptionsAdded: boolean;
  selectedIndex: number | null;
  crossedOptions: Set<number>; // Track which options are crossed out
}

export interface GameState {
  phase: 'setup' | 'playing' | 'results';
  selectedCategory: string | null;
  currentInput: string;
  mashLetters: Array<{ letter: string; crossed: boolean; selected: boolean }>;
  categories: Record<string, Category>;
  magicNumber: number;
  animationRunning: boolean;
  currentAnimationIndex: number;
  allItems: Array<{
    type: 'mash' | 'category';
    categoryKey?: string;
    index: number;
    crossed: boolean;
  }>;
}
