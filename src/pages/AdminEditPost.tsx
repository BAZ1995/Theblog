import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { usePost } from '@/hooks/usePosts';
import { Header } from '@/components/Header';
import { PostEditor } from '@/components/PostEditor';

export default function AdminEditPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: post, isLoading: postLoading } = usePost(slug || '');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!postLoading && !post) {
      navigate('/admin');
    }
  }, [post, postLoading, navigate]);

  if (loading || postLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-10">
        <h1 className="font-display text-3xl font-bold mb-8">Edit Post</h1>
        <PostEditor post={post} />
      </main>
    </div>
  );
}
