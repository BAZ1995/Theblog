import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { PostList } from '@/components/PostList';
import { LayoutToggle } from '@/components/LayoutToggle';
import { CategoryFilter } from '@/components/CategoryFilter';
import { usePosts } from '@/hooks/usePosts';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const categoryParam = searchParams.get('category') || 'all';
  
  const { data: posts = [], isLoading } = usePosts(categoryParam);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-secondary via-background to-secondary/30">
        <div className="container py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in">
            Tech & Photography
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-slide-up">
            Exploring the intersection of technology and visual storytelling. 
            Insights, tutorials, and creative inspiration.
          </p>
        </div>
      </section>

      {/* Posts Section */}
      <main className="container py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <CategoryFilter 
            category={categoryParam} 
            onCategoryChange={handleCategoryChange} 
          />
          <LayoutToggle layout={layout} onLayoutChange={setLayout} />
        </div>

        <PostList posts={posts} layout={layout} loading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TheBlog. All rights reserved.</p>
          <a href="/auth" className="hover:text-foreground transition-colors">
            Admin Login
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
