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
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
