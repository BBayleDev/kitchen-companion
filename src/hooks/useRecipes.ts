import { useState, useEffect } from 'react';
import { Recipe, RecipeInput } from '@/types/recipe';

const STORAGE_KEY = 'recipe-keeper-recipes';

// Sample recipes for initial load
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Margherita Pizza',
    description: 'Simple and delicious pizza with fresh mozzarella, tomatoes, and basil',
    category: 'Italian',
    cookTime: 25,
    servings: 4,
    ingredients: [
      '1 pizza dough',
      '200g fresh mozzarella',
      '400g crushed tomatoes',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Preheat oven to 475°F (245°C)',
      'Roll out pizza dough on a floured surface',
      'Spread crushed tomatoes evenly over dough',
      'Add torn mozzarella pieces',
      'Drizzle with olive oil and season with salt',
      'Bake for 12-15 minutes until crust is golden',
      'Top with fresh basil leaves before serving'
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    synced: true
  },
  {
    id: '2',
    title: 'Creamy Chicken Alfredo',
    description: 'Rich and creamy pasta dish with tender chicken',
    category: 'Italian',
    cookTime: 30,
    servings: 4,
    ingredients: [
      '400g fettuccine pasta',
      '500g chicken breast, sliced',
      '2 cups heavy cream',
      '1 cup parmesan cheese, grated',
      '4 cloves garlic, minced',
      '3 tbsp butter',
      'Salt, pepper, and parsley'
    ],
    instructions: [
      'Cook pasta according to package directions',
      'Season chicken with salt and pepper',
      'In a large pan, melt butter and cook chicken until golden',
      'Add garlic and cook for 1 minute',
      'Pour in heavy cream and bring to simmer',
      'Add parmesan cheese and stir until melted',
      'Toss cooked pasta in the sauce',
      'Garnish with parsley and serve hot'
    ],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    synced: true
  },
  {
    id: '3',
    title: 'Fresh Garden Salad',
    description: 'Crisp and refreshing salad with homemade vinaigrette',
    category: 'Salads',
    cookTime: 10,
    servings: 2,
    ingredients: [
      '4 cups mixed greens',
      '1 cucumber, sliced',
      '2 tomatoes, chopped',
      '1/2 red onion, thinly sliced',
      '1/4 cup olive oil',
      '2 tbsp balsamic vinegar',
      'Salt and pepper'
    ],
    instructions: [
      'Wash and dry all vegetables',
      'Combine greens, cucumber, tomatoes, and onion in a large bowl',
      'In a small bowl, whisk together olive oil and balsamic vinegar',
      'Season dressing with salt and pepper',
      'Drizzle dressing over salad just before serving',
      'Toss gently and serve immediately'
    ],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    synced: true
  }
];

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recipes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const recipesWithDates = parsed.map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt)
      }));
      setRecipes(recipesWithDates);
    } else {
      // First time - load sample recipes with synced flag
      const recipesWithSync = SAMPLE_RECIPES.map(r => ({ ...r, synced: true }));
      setRecipes(recipesWithSync);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipesWithSync));
    }
    setLoading(false);
  }, []);

  // Listen for storage events to refresh data when synced
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const recipesWithDates = parsed.map((recipe: any) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          updatedAt: new Date(recipe.updatedAt)
        }));
        setRecipes(recipesWithDates);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to localStorage whenever recipes change
  const saveRecipes = (updatedRecipes: Recipe[]) => {
    setRecipes(updatedRecipes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
  };

  const addRecipe = (recipeInput: RecipeInput) => {
    const newRecipe: Recipe = {
      ...recipeInput,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      synced: false
    };
    saveRecipes([newRecipe, ...recipes]);
    return newRecipe;
  };

  const updateRecipe = (id: string, recipeInput: RecipeInput) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === id
        ? { ...recipeInput, id, createdAt: recipe.createdAt, updatedAt: new Date(), synced: false }
        : recipe
    );
    saveRecipes(updatedRecipes);
  };

  const deleteRecipe = (id: string) => {
    saveRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const getRecipe = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  return {
    recipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe
  };
};
