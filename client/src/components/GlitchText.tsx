import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function GlitchText({ text, className }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const scramble = () => {
      let iteration = 0;
      clearInterval(interval);
      
      interval = setInterval(() => {
        setDisplayText((prev) => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    };

    // Scramble on mount
    scramble();

    // Occasional random glitch
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) scramble(); 
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [text]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
    </motion.span>
  );
}
