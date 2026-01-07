import { useState, useEffect, useRef } from "react";
import { useProjects, useBlogPosts } from "@/hooks/use-content";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface HistoryItem {
  type: "command" | "output";
  content: string | React.ReactNode;
}

export function TerminalShell({ onWeb }: { onWeb: () => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "output", content: "Wacko-OS v1.0.0 (tty1)" },
    { type: "output", content: "Type /help for a list of available commands." },
  ]);
  const { data: projects } = useProjects();
  const { data: posts } = useBlogPosts();
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    setHistory(prev => [...prev, { type: "command", content: cmd }]);

    switch (cleanCmd) {
      case "/help":
        setHistory(prev => [...prev, { 
          type: "output", 
          content: "/web - Open website normally\n/blog - List blog posts\n/projects - List projects\n/contact - Get contact info\n/clear - Clear terminal" 
        }]);
        break;
      case "/web":
        setHistory(prev => [...prev, { type: "output", content: "Switching to GUI mode..." }]);
        setTimeout(onWeb, 500);
        break;
      case "/blog":
        if (!posts || posts.length === 0) {
          setHistory(prev => [...prev, { type: "output", content: "No blog posts found." }]);
        } else {
          setHistory(prev => [...prev, { 
            type: "output", 
            content: (
              <div className="space-y-1">
                <p>Available Blog Posts:</p>
                {posts.map(post => (
                  <div key={post.slug} className="pl-4">
                    <span className="text-primary">-</span> {post.title} (slug: {post.slug})
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Type /blog [slug] to read a post.</p>
              </div>
            )
          }]);
        }
        break;
      case "/projects":
        if (!projects || projects.length === 0) {
          setHistory(prev => [...prev, { type: "output", content: "No projects found." }]);
        } else {
          setHistory(prev => [...prev, { 
            type: "output", 
            content: (
              <div className="space-y-1">
                <p>Current Projects:</p>
                {projects.map(p => (
                  <div key={p.id} className="pl-4">
                    <span className="text-primary">#</span> {p.title} - {p.status}
                  </div>
                ))}
              </div>
            )
          }]);
        }
        break;
      case "/contact":
        setHistory(prev => [...prev, { 
          type: "output", 
          content: (
            <div className="space-y-2">
              <p>Discord: Justawacko_</p>
              <a 
                href="https://discord.com/users/717462002235965492" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#5865F2] text-white px-4 py-1 rounded text-xs hover:bg-[#4752C4] transition-colors"
              >
                Open Discord Profile
              </a>
            </div>
          )
        }]);
        break;
      case "/clear":
        setHistory([]);
        break;
      default:
        if (cleanCmd.startsWith("/blog ")) {
          const slug = cleanCmd.split(" ")[1];
          const post = posts?.find(p => p.slug === slug);
          if (post) {
            setHistory(prev => [...prev, { type: "output", content: `Navigating to: ${post.title}...` }]);
            setTimeout(() => setLocation(`/blog/${slug}`), 500);
          } else {
            setHistory(prev => [...prev, { type: "output", content: `Error: Post '${slug}' not found.` }]);
          }
        } else {
          setHistory(prev => [...prev, { type: "output", content: `Command not found: ${cmd}` }]);
        }
    }
    setInput("");
  };

  return (
    <div className="fixed inset-0 bg-black text-primary font-mono p-4 z-50 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 mb-4">
        {history.map((item, i) => (
          <div key={i} className={item.type === "command" ? "text-white" : "text-primary whitespace-pre-wrap"}>
            {item.type === "command" && <span className="mr-2">$</span>}
            {item.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-primary/20 pt-4">
        <span>$</span>
        <input
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommand(input)}
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
}
