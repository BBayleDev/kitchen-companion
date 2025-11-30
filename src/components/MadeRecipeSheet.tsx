import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CheckCircle2, Star } from 'lucide-react';
import { MadeEntryInput } from '@/types/recipe';
import { toast } from 'sonner';

interface MadeRecipeSheetProps {
  recipeId: string;
  recipeTitle: string;
  onSubmit: (entry: MadeEntryInput) => void;
}

export const MadeRecipeSheet = ({ recipeId, recipeTitle, onSubmit }: MadeRecipeSheetProps) => {
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState<number>(0);
  const [totalCost, setTotalCost] = useState('');
  const [actualCookTime, setActualCookTime] = useState('');
  const [numberOfParts, setNumberOfParts] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (grade === 0) {
      toast.error('Please select a rating');
      return;
    }

    const entry: MadeEntryInput = {
      recipeId,
      grade,
      totalCost: totalCost ? parseFloat(totalCost) : undefined,
      actualCookTime: actualCookTime ? parseInt(actualCookTime) : undefined,
      numberOfParts: numberOfParts ? parseInt(numberOfParts) : undefined,
      comment: comment.trim() || undefined,
    };

    onSubmit(entry);
    
    // Reset form
    setGrade(0);
    setTotalCost('');
    setActualCookTime('');
    setNumberOfParts('');
    setComment('');
    setOpen(false);
    
    toast.success('Recipe marked as made!');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="w-full md:w-auto">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          I Made This!
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl font-display">You made {recipeTitle}!</SheetTitle>
          <SheetDescription>
            Share your experience and rate this recipe
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setGrade(star)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= grade
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="space-y-2">
            <Label htmlFor="totalCost">Total Cost (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="totalCost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Actual Cook Time */}
          <div className="space-y-2">
            <Label htmlFor="actualCookTime">Actual Cooking Time (optional)</Label>
            <div className="relative">
              <Input
                id="actualCookTime"
                type="number"
                min="1"
                placeholder="Minutes"
                value={actualCookTime}
                onChange={(e) => setActualCookTime(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">min</span>
            </div>
          </div>

          {/* Number of Parts */}
          <div className="space-y-2">
            <Label htmlFor="numberOfParts">Number of Servings Made (optional)</Label>
            <Input
              id="numberOfParts"
              type="number"
              min="1"
              placeholder="Servings"
              value={numberOfParts}
              onChange={(e) => setNumberOfParts(e.target.value)}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Notes or Comments (optional)</Label>
            <Textarea
              id="comment"
              placeholder="What did you think? Any tips or modifications?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
