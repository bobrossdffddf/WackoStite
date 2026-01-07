import { Layout } from "@/components/Layout";
import { useBlogPosts } from "@/hooks/use-content";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowRight } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading, isError } = useBlogPosts();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Logs</h2>
          <p className="text-muted-foreground">Failed to retrieve blog entries.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Engineering Logs</h1>
        <p className="text-muted-foreground text-lg">
          Documentation of problems encountered and solutions discovered.
        </p>
      </div>

      <div className="space-y-8">
        {posts?.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative pl-8 border-l-2 border-border hover:border-primary transition-colors"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors" />

            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-2">
              <Link href={`/blog/${post.slug}`}>
                <a className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </a>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                <Calendar className="w-3 h-3" />
                {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Draft'}
              </div>
            </div>

            <p className="text-muted-foreground mb-4 max-w-3xl">
              {post.excerpt}
            </p>

            <Link href={`/blog/${post.slug}`}>
              <a className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read log entry <ArrowRight className="w-3 h-3" />
              </a>
            </Link>
          </motion.article>
        ))}

        {posts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No logs found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
