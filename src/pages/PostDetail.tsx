import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePost } from '@/hooks/usePosts';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/Header';
import { CommentSection } from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Edit, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { data: post, isLoading } = usePost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="aspect-[2/1] bg-muted rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = isAdmin && user?.id === post.author_id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container max-w-4xl py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge 
              variant="outline" 
              className={cn(
                post.category === 'tech' 
                  ? "bg-tech-light text-tech border-tech/30" 
                  : "bg-photography-light text-photography border-photography/30"
              )}
            >
              {post.category}
            </Badge>
            {canEdit && (
              <Button asChild variant="outline" size="sm">
                <Link to={`/admin/edit/${post.slug}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.profiles?.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.profiles?.username || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="aspect-[2/1] rounded-xl overflow-hidden mb-10">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-accent prose-strong:text-foreground">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Comments */}
        <CommentSection postId={post.id} />
      </article>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TheBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
