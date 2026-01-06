import { Navigation } from "./Navigation";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <div className="scanlines" />
      <Navigation />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-24 pb-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground font-mono">
          <p>
            System status: <span className="text-primary">ONLINE</span>
          </p>
          <p>
            &copy; {new Date().getFullYear()} Wacko. Built with strict types.
          </p>
        </div>
      </footer>
    </div>
  );
}
