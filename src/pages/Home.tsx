import { useState, useMemo } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/RecipeCard';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import UserMenu from '@/components/UserMenu';

const Home = () => {
  const { recipes, loading } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
  }, [recipes, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-display text-primary">Recipe Keeper</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/recipe/new">
                <Button className="shadow-lg hover:shadow-xl transition-shadow">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Recipe
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Recipe Collection
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Discover, save, and organize your favorite recipes
          </p>
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, ingredient, or category..."
          />
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-2xl font-display mb-2">
              {searchQuery ? 'No recipes found' : 'No recipes yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Start building your collection by adding your first recipe'}
            </p>
            {!searchQuery && (
              <Link to="/recipe/new">
                <Button size="lg" className="shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Recipe
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              {searchQuery && ' found'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
