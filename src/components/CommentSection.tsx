import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user, isAdmin } = useAuth();
  const { data: comments = [], isLoading } = useComments(postId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await createComment.mutateAsync({
      postId,
      content: newComment.trim(),
      userId: user?.id || null,
      guestName: !user ? guestName.trim() || 'Anonymous' : undefined,
    });
    setNewComment('');
    setGuestName('');
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment.mutateAsync({ id: commentId, postId });
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form - Open to everyone */}
      <form onSubmit={handleSubmit} className="mb-8">
        {!user && (
          <Input
            placeholder="Your name (optional)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="mb-3"
          />
        )}
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3 min-h-24 resize-none"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim() || createComment.isPending}
        >
          {createComment.isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.profiles?.username || 'Anonymous'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
              {(user?.id === comment.user_id || isAdmin) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deleteComment.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
