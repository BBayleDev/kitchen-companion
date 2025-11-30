import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group h-full">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
          {recipe.image ? (
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-xl font-display group-hover:text-primary transition-colors line-clamp-1">
              {recipe.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {recipe.category}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {recipe.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
