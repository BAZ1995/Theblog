import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Edit, Eye, EyeOff, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Post, useDeletePost } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';
import { SiteMetrics } from '@/components/SiteMetrics';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const deletePost = useDeletePost();

  useEffect(() => {
    // Only redirect after loading is complete AND we've confirmed no admin access
    if (!loading && !user) {
      navigate('/auth');
    }
    // Only check admin role if user exists and loading is complete
    if (!loading && user && !isAdmin) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
    enabled: !!user && isAdmin,
  });

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Button asChild>
            <Link to="/admin/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Site Metrics */}
        <div className="mb-10">
          <SiteMetrics />
        </div>

        <h2 className="font-display text-xl font-semibold mb-4">Your Posts</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
            <Button asChild>
              <Link to="/admin/new">Create your first post</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  {/* Cover thumbnail */}
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                        {post.category === 'tech' ? '💻' : post.category === 'cars' ? '🚗' : '📷'}
                      </div>
                    )}
                  </div>

                  {/* Post info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs shrink-0",
                          post.category === 'tech' && "bg-tech-light text-tech border-tech/30",
                          post.category === 'photography' && "bg-photography-light text-photography border-photography/30",
                          post.category === 'cars' && "bg-cars-light text-cars border-cars/30"
                        )}
                      >
                        {post.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {post.published ? (
                          <><Eye className="h-3.5 w-3.5" /> Published</>
                        ) : (
                          <><EyeOff className="h-3.5 w-3.5" /> Draft</>
                        )}
                      </span>
                      <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/admin/edit/${post.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{post.title}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this post and all its comments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deletePost.mutate(post.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
