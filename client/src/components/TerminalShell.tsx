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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
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
    if (cmd.trim()) {
      setCommandHistory(prev => [cmd, ...prev]);
    }
    setHistoryPointer(-1);
    setHistory(prev => [...prev, { type: "command", content: cmd }]);

    const args = cleanCmd.split(" ");
    const baseCmd = args[0];
    const subArg = args[1];

    switch (baseCmd) {
      case "/help":
        setHistory(prev => [...prev, { 
          type: "output", 
          content: "/web - Open website normally\n/blog - List blog posts\n/projects - List projects\n/join - Create or join a room\n/contact - Get contact info\n/clear - Clear terminal" 
        }]);
        break;
      case "/web":
        setHistory(prev => [...prev, { type: "output", content: "Switching to GUI mode..." }]);
        setTimeout(onWeb, 500);
        break;
      case "/blog":
        if (!posts || posts.length === 0) {
          setHistory(prev => [...prev, { type: "output", content: "No blog posts found." }]);
        } else if (subArg) {
          // Handle /blog [slug] or /blog [letter]
          let post = posts.find(p => p.slug === subArg);
          
          // If not found by slug, check by letter
          if (!post && subArg.length === 1 && subArg >= 'a' && subArg <= 'z') {
            const index = subArg.charCodeAt(0) - 'a'.charCodeAt(0);
            if (index >= 0 && index < posts.length) {
              post = posts[index];
            }
          }

          if (post) {
            setHistory(prev => [...prev, { type: "output", content: `Navigating to: ${post.title}...` }]);
            setTimeout(() => setLocation(`/blog/${post!.slug}`), 500);
          } else {
            setHistory(prev => [...prev, { type: "output", content: `Error: Post '${subArg}' not found.` }]);
          }
        } else {
          setHistory(prev => [...prev, { 
            type: "output", 
            content: (
              <div className="space-y-1">
                <p>Available Blog Posts:</p>
                {posts.map((post, idx) => (
                  <div key={post.slug} className="pl-4">
                    <span className="text-primary">{String.fromCharCode(97 + idx)})</span> {post.title}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">Type /blog [letter] or /blog [slug] to read.</p>
              </div>
            )
          }]);
        }
        break;
      case "/projects":
        if (!projects || projects.length === 0) {
          setHistory(prev => [...prev, { type: "output", content: "No projects found." }]);
        } else if (subArg) {
          // Handle /projects [letter]
          if (subArg.length === 1 && subArg >= 'a' && subArg <= 'z') {
            const index = subArg.charCodeAt(0) - 'a'.charCodeAt(0);
            if (index >= 0 && index < projects.length) {
              const p = projects[index];
              setHistory(prev => [...prev, { type: "output", content: `Project: ${p.title}\nStatus: ${p.status}\nDescription: ${p.description}` }]);
            } else {
              setHistory(prev => [...prev, { type: "output", content: `Error: Project '${subArg}' not found.` }]);
            }
          }
        } else {
          setHistory(prev => [...prev, { 
            type: "output", 
            content: (
              <div className="space-y-1">
                <p>Current Projects:</p>
                {projects.map((p, idx) => (
                  <div key={p.id} className="pl-4">
                    <span className="text-primary">{String.fromCharCode(97 + idx)})</span> {p.title} - {p.status}
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
      case "/join":
        setHistory(prev => [...prev, { type: "output", content: "Navigating to join page..." }]);
        setTimeout(() => {
          onWeb();
          setLocation("/join");
        }, 500);
        break;
      case "/clear":
        setHistory([]);
        break;
      default:
        setHistory(prev => [...prev, { type: "output", content: `Command not found: ${cmd}` }]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyPointer < commandHistory.length - 1) {
        const newPointer = historyPointer + 1;
        setHistoryPointer(newPointer);
        setInput(commandHistory[newPointer]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer > 0) {
        const newPointer = historyPointer - 1;
        setHistoryPointer(newPointer);
        setInput(commandHistory[newPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInput("");
      }
    }
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
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
}
