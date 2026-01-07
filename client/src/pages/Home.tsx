import { Layout } from "@/components/Layout";
import { GlitchText } from "@/components/GlitchText";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { TerminalAnimation } from "@/components/TerminalAnimation";
import {
  ArrowRight,
  Server,
  Terminal,
  Shield,
  Cpu,
  Activity,
  Database,
  Cloud,
  Code2,
  Container
} from "lucide-react";

export default function Home() {
  const skills = [
    { name: "Node.js", icon: Server },
    { name: "CMD", icon: Code2 },
    { name: "Docker", icon: Container },
    { name: "Linux", icon: Terminal },
    { name: "Esp32", icon: Cpu },
    { name: "Self-Hosting", icon: Cloud },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="mb-20">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-mono font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
            SYSTEM_READY
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome <GlitchText text="User" className="text-primary text-glow" />
            <br /> to my page.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            I'm Wacko. I do my best to learn new things. I dont know how to code
            but I love hardware and software. I vibecode when I need to and just
            try to make cool things. I like physical pen testing and am studying
            cyber security. Please DM me with any questions.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-semibold transition-transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded font-semibold border border-border hover:bg-secondary/80 transition-colors"
            >
              Read Logs
            </Link>
          </div>
        </section>

        {/* About Section - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-secondary/30 border border-border/50 rounded-lg p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Terminal className="text-primary" />
                Philosophy
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    Your data matters to you. In a zombie apocalypse data centers
                    wont care about your data{" "}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span>
                    It doesnt matter how you do it as long as you do it. If it
                    doesnt make money or take jobs just vibecode it.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">▹</span>
                  <span> Ask my political opions.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-secondary/30 border border-border/50 rounded-lg p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity className="text-primary" />
                Current Status
              </h2>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-border/30 pb-2">
                  <span className="text-muted-foreground ml-[9px] mr-[9px]">
                    Focus{" "}
                  </span>
                  <span className="text-foreground">
                    Just getting it working lol
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border/30 pb-2">
                  <span className="text-muted-foreground ml-[10px] mr-[10px]">
                    Learning
                  </span>
                  <span className="text-foreground">
                    Everything I can im basically a dud :sob:
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="text-green-400">CST 12-9PM</span>
                </div>
                <div className="pt-4">
                  <a 
                    href="https://discord.com/users/717462002235965492" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#5865F2] text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#4752C4] transition-colors w-full justify-center"
                  >
                    Connect on Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-8 font-mono">
            ~/Trying to learn i guess
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-secondary/20 border border-border/50 rounded hover:border-primary/50 hover:bg-secondary/40 transition-all group"
              >
                <skill.icon className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-mono text-sm font-medium">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </Layout>
  );
}
