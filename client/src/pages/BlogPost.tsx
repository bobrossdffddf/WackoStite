import { Layout } from "@/components/Layout";
import { useBlogPost } from "@/hooks/use-content";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading, isError } = useBlogPost(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isError || !post) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-3xl font-bold mb-4">404: Log Not Found</h2>
          <p className="text-muted-foreground mb-8">The requested entry does not exist in the database.</p>
          <Link href="/blog" className="text-primary hover:underline">
            Return to Logs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Logs
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-sm font-mono text-primary mb-4">
            <Calendar className="w-4 h-4" />
            {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Draft'}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
        </motion.div>
      </div>

      <motion.article 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-foreground prose-headings:font-bold prose-headings:font-mono
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-primary
          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        "
      >
        {/* Simple rendering of content - in a real app use markdown parser */}
        {post.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </motion.article>
    </Layout>
  );
}
