import { Button } from '@/components/ui/button';
import { Camera, Car, Code2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ category, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', label: 'All Posts', icon: Layers },
    { id: 'tech', label: 'Tech', icon: Code2 },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'cars', label: 'Cars', icon: Car },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={category === id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(id)}
          className={cn(
            "transition-all",
            category === id && id === 'tech' && "bg-tech hover:bg-tech/90",
            category === id && id === 'photography' && "bg-photography hover:bg-photography/90 text-foreground",
            category === id && id === 'cars' && "bg-cars hover:bg-cars/90"
          )}
        >
          <Icon className="h-4 w-4 mr-1.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
