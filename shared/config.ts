/**
 * SITE CONTENT CONFIGURATION
 *
 * Edit this file to change the content of your website.
 * No need to touch the complex code!
 */

export const siteConfig = {
  identity: {
    name: "Wacko",
    description: "I build, run, and test projects on my own server.",
  },

  // Facts about you
  verifiedFacts: [
    "I build, run, and test projects on my own server",
    "I actively work with Node.js, TypeScript, and React",
    "I self-host services and applications",
    "I experiment with Web apps, Discord bots, and Docker-based setups",
    "I prefer hands-on building and troubleshooting over theory",
  ],

  // List your skills (Icons are handled automatically)
  skills: [
    "JavaScript / TypeScript",
    "React frontends",
    "Node.js backends",
    "Running services on Linux servers",
    "Debugging broken or misconfigured systems",
    "Deploying and rebuilding projects repeatedly until they work",
  ],

  // Things you enjoy
  interests: [
    "Self-hosting services instead of relying on third-party platforms",
    "Servers & infrastructure (VPS, Proxmox, Linux environments)",
    "Docker & containerized apps",
    "Web app deployment workflows",
    "Automation and scripts that reduce manual work",
    "Discord bots and integrations",
    "Cloudflare tunnels & DNS",
    "Performance, stability, and uptime",
    "Learning by breaking and fixing things",
    "Minimal, functional UI over flashy design",
  ],

  // Your Projects
  // Status options: "In progress", "Actively experimenting", "More details soon"
  projects: [
    {
      title: "Home Server Infrastructure",
      description:
        "Frankensteined an old pc into a Proxmox server to run peoples apps DM if ur interested",
      tags: ["Docker", "Proxmox", "Linux"],
      status: "In progress",
      link: "#",
    },
    {
      title: "Custom Discord Bot",
      description:
        "Made a ton of bots for servers paid or free and whatnot and ran on a RPI02W",
      tags: ["Node.js", "Vibecoding", "Discord.js"],
      status: "Actively experimenting",
      link: "#",
    },
    {
      title: "Self-Hosted Cloud Storage",
      description:
        "Setting up a private Nextcloud instance to replace Google Drive, focusing on privacy and data sovereignty.",
      tags: ["Nextcloud", "Docker"],
      status: "More details soon",
      link: "#",
    },
  ],

  // Your Blog Posts
  blogPosts: [
    {
      title: "Why I Self-Host Everything",
      slug: "why-i-self-host",
      excerpt: "Ownership of data is more important than convenience.",
      content:
        "Ownership of data is more important than convenience. In this post, I explore the trade-offs between using SaaS products and hosting your own alternatives. It's not just about privacy; it's about learning how things work under the hood.",
    },
    {
      title: "My Docker Workflow",
      slug: "my-docker-workflow",
      excerpt: "Streamlining deployments with docker-compose and bash scripts.",
      content:
        "I used to deploy everything manually. Then I discovered Docker. Here is how I structure my docker-compose files and use simple bash scripts to automate updates and backups.",
    },
    {
      title: "Recovering from a Failed Deploy",
      slug: "recovering-failed-deploy",
      excerpt: "Lessons learned when production went down at 3 AM.",
      content:
        "It happens to everyone. You push a change, and suddenly nothing works. This is the story of how I broke my reverse proxy and the steps I took to troubleshoot and fix it.",
    },
  ],
};
