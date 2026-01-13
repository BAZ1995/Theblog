import { Link } from 'react-router-dom';
import { Post } from '@/hooks/usePosts';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  layout?: 'grid' | 'list';
}

export function PostCard({ post, layout = 'grid' }: PostCardProps) {
  const isGrid = layout === 'grid';

  return (
    <Link
      to={`/post/${post.slug}`}
      className={cn(
        "group block bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300",
        isGrid ? "flex flex-col" : "flex flex-col md:flex-row"
      )}
    >
      {/* Image */}
      <div 
        className={cn(
          "relative overflow-hidden bg-muted",
          isGrid ? "aspect-[16/10]" : "md:w-72 md:shrink-0 aspect-[16/10] md:aspect-auto"
        )}
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20">
              {post.category === 'tech' ? '💻' : '📷'}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium backdrop-blur-sm",
              post.category === 'tech' 
                ? "bg-tech-light/90 text-tech border-tech/30" 
                : "bg-photography-light/90 text-photography border-photography/30"
            )}
          >
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex flex-col flex-1 p-5", !isGrid && "md:py-6")}>
        <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>
        
        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {post.profiles?.username || 'Anonymous'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(post.created_at), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </Link>
  );
}
