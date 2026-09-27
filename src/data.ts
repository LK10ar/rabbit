import type { NavigationItem, Project, ExpertiseItem } from "./types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "projects", label: "Projects", scrollRatio: 0.25 },
  { id: "expertise", label: "Expertise", scrollRatio: 0.5 },
  { id: "about", label: "About", scrollRatio: 0.95 },
  { id: "contact", label: "Manifesto", scrollRatio: 3.5 },
];

// Kept for parity — unused on this single-screen page.
export const PROJECTS_DATA: Project[] = [
  {
    title: "Automated Growth Engine",
    category: "Automation",
    description: "End-to-end workflow automation for lean teams.",
    tags: ["Automation", "Ops"],
  },
  {
    title: "Signal Layer",
    category: "Product",
    description: "Real-time analytics dashboard for founders.",
    tags: ["Product", "Analytics"],
  },
];

// Kept for parity — unused on this single-screen page.
export const EXPERTISE_DATA: ExpertiseItem[] = [
  { title: "Product Design", percentage: 92, description: "High-end interface systems." },
  { title: "Automation", percentage: 88, description: "Workflow and pipeline engineering." },
  { title: "Growth", percentage: 81, description: "Scalable acquisition loops." },
];
