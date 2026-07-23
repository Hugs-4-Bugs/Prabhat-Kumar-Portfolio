/**
 * QuantumAI Capability Registry
 *
 * Data-driven configuration. To add a capability in a future phase,
 * append a new CapabilityItem to the relevant category — the UI
 * renders automatically with no JSX changes required.
 *
 * status:
 *   "available" — fully functional today
 *   "coming"    — reserved for future phases (not shown in Phase 1)
 */

export interface CapabilityItem {
  id: string;
  label: string;
  description: string;
  status: "available" | "coming";
}

export interface CapabilityCategory {
  id: string;
  title: string;
  icon: string; // emoji or short symbol — keeps this file framework-agnostic
  items: CapabilityItem[];
}

export type CapabilityRegistry = CapabilityCategory[];

// ── Phase 1: only "available" capabilities are rendered ──────────────────────
export const CAPABILITY_REGISTRY: CapabilityRegistry = [
  {
    id: "about-prabhat",
    title: "About Prabhat",
    icon: "👤",
    items: [
      {
        id: "professional-background",
        label: "Professional Background",
        description: "Current role, company, responsibilities, and career highlights.",
        status: "available",
      },
      {
        id: "work-experience",
        label: "Work Experience",
        description: "Full employment history including internships and remote roles.",
        status: "available",
      },
      {
        id: "skills",
        label: "Skills & Expertise",
        description: "Technical stack, languages, frameworks, cloud, and AI expertise.",
        status: "available",
      },
      {
        id: "education",
        label: "Education",
        description: "Degree, university, CGPA, and academic background.",
        status: "available",
      },
      {
        id: "projects",
        label: "Projects",
        description: "21+ projects across trading, AI, web, and enterprise systems.",
        status: "available",
      },
      {
        id: "entrepreneurship",
        label: "Entrepreneurship",
        description: "QuantumFusion Solutions, AcquisitionOS, CodeGuard AI, and more.",
        status: "available",
      },
      {
        id: "contact",
        label: "Contact Information",
        description: "Email, location, and how to reach Prabhat directly.",
        status: "available",
      },
      {
        id: "social",
        label: "Social Profiles",
        description: "GitHub, LinkedIn, Twitter, YouTube, and community presence.",
        status: "available",
      },
    ],
  },
  {
    id: "quantumai",
    title: "QuantumAI",
    icon: "✦",
    items: [
      {
        id: "text-conversation",
        label: "Text Conversation",
        description: "Ask anything about Prabhat's skills, projects, and experience.",
        status: "available",
      },
      {
        id: "voice-conversation",
        label: "Voice Conversation",
        description: "Hands-free voice session with ElevenLabs TTS and speech recognition.",
        status: "available",
      },
      {
        id: "multilingual",
        label: "Multi-language Support",
        description: "Responds in the language you speak — English, Hindi, Spanish, and more.",
        status: "available",
      },
      {
        id: "context-followup",
        label: "Context-aware Follow-ups",
        description: "Remembers the conversation and answers follow-up questions accurately.",
        status: "available",
      },
      {
        id: "explain-projects",
        label: "Explain Projects",
        description: "Detailed walkthrough of any project — stack, purpose, and impact.",
        status: "available",
      },
      {
        id: "explain-technologies",
        label: "Explain Technologies",
        description: "Explains any technology Prabhat works with and how he uses it.",
        status: "available",
      },
      {
        id: "career-journey",
        label: "Career Journey",
        description: "Story of how Prabhat grew from student to developer to founder.",
        status: "available",
      },
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge",
    icon: "📚",
    items: [
      {
        id: "resume-info",
        label: "Resume Information",
        description: "All information from Prabhat's professional resume.",
        status: "available",
      },
      {
        id: "technical-expertise",
        label: "Technical Expertise",
        description: "Deep knowledge of Java, Spring Boot, AWS, microservices, and AI.",
        status: "available",
      },
      {
        id: "product-info",
        label: "Product Information",
        description: "Details about CodeGuard AI, AcquisitionOS, trading bots, and more.",
        status: "available",
      },
      {
        id: "founder-vision",
        label: "Founder Vision",
        description: "Prabhat's mission, philosophy, and what he's building toward.",
        status: "available",
      },
    ],
  },
];
