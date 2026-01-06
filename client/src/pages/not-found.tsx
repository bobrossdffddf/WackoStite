import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4 font-mono">404: MODULE_NOT_FOUND</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The requested resource could not be located in the current build. It may have been deprecated or moved.
        </p>
        <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition-colors">
          Return to Root
        </Link>
      </div>
    </Layout>
  );
}
