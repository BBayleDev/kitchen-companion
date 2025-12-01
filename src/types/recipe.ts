export interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  cookTime: number; // in minutes
  servings: number;
  ingredients: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
  synced: boolean;
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'synced'>;

export interface MadeEntry {
  id: string;
  recipeId: string;
  totalCost?: number;
  actualCookTime?: number;
  numberOfParts?: number;
  grade: number; // 1-5 rating
  comment?: string;
  createdAt: Date;
  synced: boolean;
}

export type MadeEntryInput = Omit<MadeEntry, 'id' | 'createdAt' | 'synced'>;
