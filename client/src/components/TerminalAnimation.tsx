import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TerminalAnimation({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const terminalLines = [
    "booting wacko-os v1.0.0...",
    "loading system modules...",
    "connecting to home server [192.168.1.100]...",
    "establishing secure tunnel...",
    "fetching project database...",
    "syncing blog posts...",
    "starting services: [docker] [nginx] [node]...",
    "welcome, visitor.",
    "access granted."
  ];

  useEffect(() => {
    if (currentIndex < terminalLines.length) {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, terminalLines[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, Math.random() * 300 + 200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono p-4">
      <div className="max-w-2xl w-full">
        <div className="text-primary space-y-2">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="mr-2">$</span>
              {line}
            </motion.div>
          ))}
          {currentIndex < terminalLines.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-primary ml-1 align-middle"
            />
          )}
        </div>
      </div>
    </div>
  );
}
