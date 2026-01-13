import { Post } from '@/hooks/usePosts';
import { PostCard } from './PostCard';
import { cn } from '@/lib/utils';

interface PostListProps {
  posts: Post[];
  layout?: 'grid' | 'list';
  loading?: boolean;
}

export function PostList({ posts, layout = 'grid', loading }: PostListProps) {
  if (loading) {
    return (
      <div className={cn(
        layout === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col gap-6"
      )}>
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "bg-card rounded-lg border border-border overflow-hidden animate-pulse",
              layout === 'grid' ? "" : "flex flex-col md:flex-row"
            )}
          >
            <div className={cn(
              "bg-muted",
              layout === 'grid' ? "aspect-[16/10]" : "md:w-72 aspect-[16/10] md:aspect-auto md:h-48"
            )} />
            <div className="p-5 flex-1">
              <div className="h-6 bg-muted rounded w-3/4 mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No posts found.</p>
        <p className="text-muted-foreground text-sm mt-2">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className={cn(
      layout === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "flex flex-col gap-6"
    )}>
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PostCard post={post} layout={layout} />
        </div>
      ))}
    </div>
  );
}
