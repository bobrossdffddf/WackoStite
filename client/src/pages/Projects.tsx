import { Layout } from "@/components/Layout";
import { useProjects } from "@/hooks/use-content";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Loader2, Circle } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading, isError } = useProjects();

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
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Projects</h2>
          <p className="text-muted-foreground">System failed to retrieve project data.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Experiments & Builds</h1>
        <p className="text-muted-foreground text-lg">
          Some things ive done
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects?.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-secondary/20 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors overflow-hidden"
          >
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2 text-xs font-mono border border-border/50 bg-background/50 px-2 py-1 rounded">
                <Circle className={`w-2 h-2 fill-current ${
                  project.status === "In progress" ? "text-yellow-500" :
                  project.status === "Actively experimenting" ? "text-primary" :
                  project.status === "Done" ? "text-green-500" :
                  "text-muted-foreground"
                }`} />
                {project.status}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h2>
            
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 text-xs font-mono bg-primary/5 text-primary border border-primary/20 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.link && project.link !== "#" ? (
              <a 
                href={project.link}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </a>
            ) : (
              <div className="text-sm font-medium text-muted-foreground italic">
                Development in progress...
              </div>
            )}
            
            {/* Decoration */}
            <GitBranch className="absolute bottom-4 right-4 w-24 h-24 text-primary/5 -rotate-12 pointer-events-none" />
          </motion.div>
        ))}

        {projects?.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No projects indexed yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
