import { Link, useLocation } from "wouter";
import { Terminal, Code2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "~/home", icon: Terminal },
    { href: "/projects", label: "~/projects", icon: Code2 },
    { href: "/blog", label: "~/blog", icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-mono font-bold text-lg text-primary tracking-tighter">
          wacko<span className="text-muted-foreground">.dev</span>
        </div>

        <div className="flex gap-1 sm:gap-6">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative group">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono transition-colors",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
