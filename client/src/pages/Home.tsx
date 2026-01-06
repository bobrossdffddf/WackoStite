import { Layout } from "@/components/Layout";
import { GlitchText } from "@/components/GlitchText";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Server, Terminal, Shield, Cpu, Activity, Database, Cloud } from "lucide-react";

export default function Home() {
  const skills = [
    { name: "Node.js", icon: Server },
    { name: "TypeScript", icon: Code2 },
    { name: "Docker", icon: Container },
    { name: "Linux", icon: Terminal },
    { name: "React", icon: Cpu },
    { name: "Self-Hosting", icon: Cloud },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-20">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-mono font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
          SYSTEM_READY
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          I build <GlitchText text="digital infrastructure" className="text-primary text-glow" /> 
          <br /> and break things.
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          I'm Wacko. I build, run, and test on my own bare metal. 
          Specializing in backend systems, self-hosted services, and experimental web apps.
          If it runs on Linux, I'll probably try to optimize it.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-semibold transition-transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]">
            View Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link href="/blog" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded font-semibold border border-border hover:bg-secondary/80 transition-colors">
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
                <span>Self-host everything possible. Data ownership matters.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">▹</span>
                <span>Simple, robust code over complex abstractions.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">▹</span>
                <span>Build to learn. Fail fast. Fix faster.</span>
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
                <span className="text-muted-foreground">Focus</span>
                <span className="text-foreground">Performance Optimization</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-muted-foreground">Learning</span>
                <span className="text-foreground">Rust / Low-level Systems</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-muted-foreground">Availability</span>
                <span className="text-green-400">Limited (Building)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-8 font-mono">~/stack</h2>
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
              <span className="font-mono text-sm font-medium">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

// Icons needed for skills array above
import { Code2, Container } from "lucide-react";
