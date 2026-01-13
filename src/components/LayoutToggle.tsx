import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutToggleProps {
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
}

export function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLayoutChange('grid')}
        className={cn(
          "h-8 px-3",
          layout === 'grid' 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutGrid className="h-4 w-4 mr-1.5" />
        Grid
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLayoutChange('list')}
        className={cn(
          "h-8 px-3",
          layout === 'list' 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutList className="h-4 w-4 mr-1.5" />
        List
      </Button>
    </div>
  );
}
