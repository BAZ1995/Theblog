import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function SiteMetrics() {
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 7);
  const thirtyDaysAgo = subDays(today, 30);

  // Fetch total page views
  const { data: totalViews = 0 } = useQuery({
    queryKey: ['metrics-total-views'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch views in last 7 days
  const { data: weeklyViews = 0 } = useQuery({
    queryKey: ['metrics-weekly-views'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch views today
  const { data: todayViews = 0 } = useQuery({
    queryKey: ['metrics-today-views'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total posts
  const { data: totalPosts = 0 } = useQuery({
    queryKey: ['metrics-total-posts'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total comments
  const { data: totalComments = 0 } = useQuery({
    queryKey: ['metrics-total-comments'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch top pages
  const { data: topPages = [] } = useQuery({
    queryKey: ['metrics-top-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('path')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      
      // Count occurrences of each path
      const pathCounts: Record<string, number> = {};
      data?.forEach((view) => {
        pathCounts[view.path] = (pathCounts[view.path] || 0) + 1;
      });
      
      // Sort by count and get top 5
      return Object.entries(pathCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Site Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Today's Views"
            value={todayViews}
            subtitle={format(new Date(), 'MMM d, yyyy')}
            icon={<Eye />}
          />
          <MetricCard
            title="Weekly Views"
            value={weeklyViews}
            subtitle="Last 7 days"
            icon={<TrendingUp />}
          />
          <MetricCard
            title="Published Posts"
            value={totalPosts}
            subtitle="Total articles"
            icon={<FileText />}
          />
          <MetricCard
            title="Comments"
            value={totalComments}
            subtitle="Total engagement"
            icon={<MessageSquare />}
          />
        </div>
      </div>

      {topPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Pages (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPages.map(({ path, count }) => (
                <div key={path} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[200px]">
                    {path === '/' ? 'Home' : path}
                  </span>
                  <span className="font-medium">{count} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Total all-time views: {totalViews.toLocaleString()}
      </p>
    </div>
  );
}
