import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeInput } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const RecipeForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe, addRecipe, updateRecipe } = useRecipes();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<RecipeInput>({
    title: '',
    description: '',
    image: '',
    category: '',
    cookTime: 30,
    servings: 4,
    ingredients: [''],
    instructions: ['']
  });

  useEffect(() => {
    if (isEditing && id) {
      const recipe = getRecipe(id);
      if (recipe) {
        setFormData({
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          category: recipe.category,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        });
      }
    }
  }, [id, isEditing, getRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim() !== ''),
      instructions: formData.instructions.filter(i => i.trim() !== '')
    };

    if (cleanedData.ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    if (cleanedData.instructions.length === 0) {
      toast.error('Please add at least one instruction');
      return;
    }

    if (isEditing && id) {
      updateRecipe(id, cleanedData);
      toast.success('Recipe updated successfully!');
      navigate(`/recipe/${id}`);
    } else {
      const newRecipe = addRecipe(cleanedData);
      toast.success('Recipe added successfully!');
      navigate(`/recipe/${newRecipe.id}`);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Link to={isEditing ? `/recipe/${id}` : '/'}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display mb-8">
          {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Recipe Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Classic Margherita Pizza"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A brief description of your recipe"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Italian, Dessert, Breakfast"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cookTime">Cook Time (minutes) *</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    min="1"
                    value={formData.cookTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Servings *</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-display">Ingredients</CardTitle>
                <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {formData.ingredients.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        variant="ghost"
                        size="icon"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-display">Instructions</CardTitle>
                <Button type="button" onClick={addInstruction} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                      {index + 1}
                    </div>
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      rows={2}
                    />
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        variant="ghost"
                        size="icon"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1 shadow-lg">
              {isEditing ? 'Update Recipe' : 'Add Recipe'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate(isEditing ? `/recipe/${id}` : '/')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RecipeForm;
