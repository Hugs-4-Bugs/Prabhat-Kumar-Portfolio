/**
 * quantum-ai-knowledge.ts
 * Grounded, structured facts for QuantumAI — Prabhat Kumar's portfolio assistant.
 * Every claim the bot makes must trace back to a field in this file.
 * No invented credentials, no filler adjectives without backing facts.
 */
export const quantumAiKnowledge = {
  identity: {
    name: "Prabhat Kumar",
    location: "Bengaluru, India",
    tagline: "Java/Spring Boot developer and founder building AI-powered SaaS products",
    background:
      "Started in customer support/technical support (Startek/Acer) before transitioning into software development.",
  },

  currentRole: {
    title: "SDE — Java Software Developer",
    company: "Netcore Cloud",
    since: "January 2023",
    status: "current, full-time",
    skills: ["Java", "Spring Boot", "Hibernate", "Microservices", "REST APIs", "MySQL", "AWS"],
  },

  venture: {
    name: "QuantumFusion Solutions",
    type: "AI automation and SaaS agency (founder-operated, alongside full-time role)",
    location: "Bangalore",
    targetVerticals: ["restaurant tech", "real estate", "healthcare", "e-commerce", "fintech", "EdTech"],
    targetMarkets: ["UAE", "India", "USA", "UK"],
    stage:
      "Pursuing first paying clients via Contra freelancing and direct outreach; active Dubai prospect outreach (medical clinics, real estate agencies, hospitality).",
    longTermVision:
      "Multi-agent AI 'company operating system' — Claude as CEO agent (Anthropic API) orchestrating local Ollama models via CrewAI, shared memory via mem0, with departments for Dev, DevOps, Security, PM, CFO, COO, Trading, Marketing, Research, HR, and Legal. Currently in early/planning phase, not yet built.",
  },

  stack: {
    languages: ["Java", "TypeScript", "Python", "Dart"],
    backend: ["Spring Boot", "Spring Security", "Spring AI", "Hibernate", "Microservices", "REST APIs", "FastAPI", "WebFlux"],
    frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Firebase Firestore", "Redis"],
    cloud_infra: ["AWS", "Google Cloud Run", "Vercel", "Docker", "CI/CD", "GitHub Actions"],
    ai_ml: ["Claude API (Anthropic)", "Spring AI", "Ollama (local LLMs)", "Gemini API", "OpenAI API", "CrewAI", "mem0"],
    payments: ["Stripe", "Razorpay"],
    messaging_comms: ["SendGrid", "Twilio", "WhatsApp Business API", "FCM (push notifications)"],
    mobile: ["Android (Flutter)", "Android sensor APIs (TYPE_STEP_COUNTER)"],
    tools: ["Git", "IntelliJ IDEA (plugin development, Gradle)", "Zerodha Kite Connect", "Binance API", "Google Custom Search API"],
  },

  projects: [
    {
      name: "CodeGuard AI",
      what: "VS Code extension that detects expensive AWS infrastructure patterns in Terraform files in real time",
      proof:
        "Published on the VS Code Marketplace with live installs. Semi-finalist in the AWS 10,000 AIdeas Competition. Submitted with a YouTube demo, an AWS Builder Center article, and structured screenshots.",
      skills: ["TypeScript", "AWS", "Terraform", "static analysis", "developer tooling"],
      status: "published, live",
    },
    {
      name: "SystemFoundry",
      what: "Visual AI-powered system architecture SaaS — helps plan API boundaries, trade-offs, diagrams, and engineering roadmaps",
      proof:
        "Functional product: Vercel frontend + Google Cloud Run backend + Firebase Firestore + Stripe. Built payment idempotency, real-time credit tracking, Stripe webhook recovery, and a three-tier admin hierarchy. Live at systemfoundry.vercel.app.",
      skills: ["system design", "backend architecture", "API design", "Stripe billing", "Firebase"],
      status: "functional, deployed",
    },
    {
      name: "AcquisitionOS",
      what: "Lead acquisition and sales pipeline management SaaS",
      proof:
        "Built with Google OAuth, magic link/OTP auth, a lead-discovery pipeline using Google Custom Search API, meeting intelligence, and a feedback intelligence system. Live at acquisition.space-z.ai. Internally identified as the strongest near-term revenue signal in the product portfolio.",
      skills: ["AI workflows", "automation", "auth systems", "sales tooling", "product engineering"],
      status: "built, targeting first revenue",
    },
    {
      name: "NutriAI",
      what: "Android/Flutter AI nutrition app for Indian users",
      proof:
        "Spring Boot backend, Claude API integration, Firebase Auth, Stripe billing. Real step counting via Android's native step sensor, FCM deep links, family sub-accounts, SendGrid weekly summaries, and a points-based rewards system (100 points = ₹1 discount).",
      skills: ["Flutter/Android", "Spring Boot", "Claude API", "mobile sensors", "Firebase", "Stripe"],
      status: "fully specified, partially built",
    },
    {
      name: "Automated Trading Bot",
      what: "AI-assisted trading system for Indian markets (NIFTY 50, BANK NIFTY, Gold, Silver, Crude Oil, crypto)",
      proof:
        "FastAPI backend + Next.js dashboard, Claude AI analysis engine, paper trading execution, Zerodha Kite Connect and Binance integrations, 13 notification event types across Telegram and WhatsApp. Single-file architecture serving the dashboard directly.",
      skills: ["Python/FastAPI", "trading systems", "Claude API", "real-time data", "brokerage API integration"],
      status: "built, paper-trading stage",
    },
    {
      name: "PrabhatAI (IntelliJ IDEA Plugin)",
      what: "AI coding assistant plugin for IntelliJ IDEA",
      proof:
        "ChatGPT-style dark UI with per-message avatars, code block copy buttons, and animated thinking indicators. Integrates Gemini, OpenAI, and mock providers. Built with Gradle, targeting IntelliJ IC-233.14808.21, Java 17, plugin version 1.17.2, using the gemini-2.5-flash endpoint.",
      skills: ["Java", "IntelliJ Platform SDK", "Gradle", "AI API integration", "plugin development"],
      status: "built",
    },
    {
      name: "HRMS SaaS Portal",
      what: "Internal HR management system for QuantumFusion Solutions",
      proof:
        "Architected in detail: Java 21, Spring Boot 3.2, PostgreSQL (schema-per-module), Redis, Next.js 14, 24 modules across 7 domains, Karnataka payroll compliance (PF 12%, ESI, Professional Tax). Spring AI integration planned via a feature-flagged, isolated AI module.",
      skills: ["Java 21", "Spring Boot", "payroll/compliance systems", "Redis", "Next.js", "system architecture"],
      status: "architected in detail, build in progress",
    },
    {
      name: "Multi-Agent AI Company OS (QuantumFusion internal)",
      what: "CrewAI-orchestrated multi-agent system with Claude as a CEO agent plus local Ollama models",
      proof:
        "Planned architecture: Claude (Anthropic API) as CEO agent, local models (qwen2.5-coder:1.5b, llama3.2:3b, llama3.2:1b) running on Mac M1 8GB via Ollama, mem0 for shared memory, PostgreSQL + FastAPI backend, Next.js dashboard. Four-phase build plan (local foundation → dashboard → cloud SaaS + payments → self-improvement layer).",
      skills: ["multi-agent orchestration", "CrewAI", "local LLM deployment", "system design"],
      status: "planning stage, Phase 1 not started",
    },
    {
      name: "prabhat.online (this portfolio site)",
      what: "Personal portfolio site featuring QuantumAI, the assistant currently answering your question",
      proof:
        "Ongoing development includes GSAP/Framer Motion enhancements, live GitHub data sections, and this floating QuantumAI assistant widget.",
      skills: ["Next.js", "frontend design", "AI product integration"],
      status: "actively maintained",
    },
  ],

  clientWork: [
    {
      context: "Maa-Aarogyam Health Centre (Sasaram, Bihar) — scoped client project",
      what: "Java Spring Boot microservices backend on AWS, three-phase delivery plan",
      note: "Quoted at ₹1,75,000 with 30/40/30 milestone-based payment structure.",
    },
    {
      context: "High Touch Executive Search (freelance advisory, via cousin Madhav)",
      what: "Document/proposal review support for an AIOS/SearchOS SaaS pitch series",
      note:
        "Rebuilt a 45-page PDF proposal from scratch (Python/WeasyPrint), fixed DOCX contract issues, caught arithmetic errors in pricing tables across four documents. Background advisory role, no direct client-facing visibility.",
    },
  ],

  achievements: [
    "AWS 10,000 AIdeas Competition — semi-finalist (CodeGuard AI)",
    "Published, installed VS Code Marketplace extension (CodeGuard AI)",
  ],

  siteInfo: {
    domain: "prabhat.online",
    assistantName: "QuantumAI",
    assistantPurpose:
      "Answers visitor questions about Prabhat's background, skills, and projects, and helps schedule meetings with him.",
    schedulingProcess:
      "Collects purpose, preferred date/time, and contact info via a meeting form; requires a validated full name (first and last) before submission.",
  },

  outOfScopeTopics: [
    "coding help unrelated to Prabhat's own projects",
    "general knowledge questions unrelated to Prabhat or this site",
    "topics with no connection to Prabhat's background, work, or this portfolio",
  ],
} as const;

// ---------------------------------------------------------------------------
// Derived lookup structures
// ---------------------------------------------------------------------------

const ALL_SKILLS = Array.from(
  new Set(
    Object.values(quantumAiKnowledge.stack).flat().map((s) => s.toLowerCase())
  )
);

const ALL_PROJECT_SKILLS = Array.from(
  new Set(quantumAiKnowledge.projects.flatMap((p) => p.skills.map((s) => s.toLowerCase())))
);

const KNOWN = Array.from(new Set([...ALL_SKILLS, ...ALL_PROJECT_SKILLS]));

const TECH_PATTERNS = [
  "java", "spring boot", "spring", "spring security", "hibernate", "microservices",
  "rest api", "postgresql", "mysql", "mongodb", "firebase", "redis",
  "next.js", "react", "typescript", "javascript", "python", "fastapi",
  "aws", "google cloud", "gcp", "docker", "kubernetes", "kafka", "ci/cd",
  "golang", "node.js", "flutter", "android", "ios", "claude api", "openai",
  "gemini", "crewai", "ollama", "stripe", "razorpay", "sendgrid", "twilio",
  "webflux", "terraform",
];

// ---------------------------------------------------------------------------
// Intent detectors
// ---------------------------------------------------------------------------

export function isFitQuestion(message: string): boolean {
  return /\b(good fit|fit for|qualified|qualify|match(?:es)?|suitable|experience.*(?:role|requirement)|role.*(?:experience|skills?|fit)|does he have|is he good|can he do|would he be able)\b/i.test(
    message
  );
}

export function isProjectQuestion(message: string): boolean {
  const names = quantumAiKnowledge.projects.map((p) => p.name.toLowerCase());
  const text = message.toLowerCase();
  return (
    names.some((n) => text.includes(n)) ||
    /^projects?\??$/i.test(message.trim()) ||
    /\b(project|built|built by|tell me about|what (is|are)|show me).*(app|saas|tool|extension|bot|plugin|platform)\b/i.test(
      message
    )
  );
}

export function isSiteQuestion(message: string): boolean {
  return /\b(who are you|what are you|this site|this website|prabhat\.online|quantumai|this assistant|this bot|who (built|made) you|how (do|does) (you|this) work)\b/i.test(
    message
  );
}

export function isVentureQuestion(message: string): boolean {
  return /\b(quantumfusion|your agency|your company|your startup|freelance|contra|dubai|clients?)\b/i.test(
    message
  );
}

export function isSkillQuestion(message: string): boolean {
  return /\b(skills?|tech(?:nology)? stack|speciali[sz](?:e|es|ed|ing)|strengths?|what (?:can|does) (?:he|prabhat) (?:do|know)|areas? of expertise)\b/i.test(
    message
  );
}

export function isOutOfScope(message: string): boolean {
  const text = message.toLowerCase();
  const hasSelfReference = /\b(prabhat|he|his|him|this (site|project|company|app)|quantum(ai|fusion))\b/i.test(text);
  if (hasSelfReference) return false;
  // Broad heuristic: no reference to Prabhat/site/projects at all AND looks like an
  // unrelated general-knowledge/task request.
  return /\b(write me|explain|what is the capital|solve|translate|homework|essay|poem|recipe|weather|joke)\b/i.test(text);
}

// ---------------------------------------------------------------------------
// Answer generators — every branch cites a specific fact, never a vibe.
// ---------------------------------------------------------------------------

export function evaluateFitQuestion(message: string): string | null {
  if (!isFitQuestion(message)) return null;
  const text = message.toLowerCase();
  const requestedYears = Number(text.match(/(\d+)\s*\+?\s*years?/)?.[1] ?? 0);
  const requestedTech = TECH_PATTERNS.filter((tech) => text.includes(tech));
  const unknownTech = requestedTech.filter(
    (tech) => !KNOWN.some((known) => known.includes(tech) || tech.includes(known))
  );
  const javaBackend = /\b(java|backend|spring boot|microservices)\b/.test(text);
  const yearsCovered = !requestedYears || requestedYears <= 3;

  if (unknownTech.length > 0) {
    return `I don't have confirmed portfolio information for ${unknownTech.join(", ")}. For everything else in the role: Prabhat has been a Java Software Developer at Netcore Cloud since January 2023, working with Spring Boot, microservices, REST APIs, MySQL, and AWS. I can flag the unconfirmed requirement for him to answer directly.`;
  }
  if (javaBackend && yearsCovered) {
    return `Strong fit. Prabhat has worked as a Java Software Developer at Netcore Cloud since January 2023, using Spring Boot, microservices, REST APIs, MySQL, and AWS. He's also shipped backend and AI-integration work outside his day job — including a Spring Boot/Ollama WebFlux streaming AI integration and a Spring Boot-based SaaS product (SystemFoundry) — which directly supports a Java backend profile.`;
  }
  if (javaBackend) {
    return `Partial fit based on documented experience. Prabhat has been working with Java and Spring Boot at Netcore Cloud since January 2023, with relevant backend project work beyond that role. I can't independently confirm he meets a ${requestedYears}+ year requirement beyond that timeline — that's worth confirming with him directly.`;
  }
  return `I can confirm Prabhat's experience across ${quantumAiKnowledge.stack.backend.slice(0, 5).join(", ")}, and more. Share the role's required stack or years of experience and I'll compare it directly against his documented work.`;
}

export function answerProjectQuestion(message: string): string | null {
  const text = message.toLowerCase();
  const match = quantumAiKnowledge.projects.find((p) => text.includes(p.name.toLowerCase()));
  if (match) {
    return `${match.name}: ${match.what}. ${match.proof} Status: ${match.status}.`;
  }
  if (isProjectQuestion(message)) {
    const list = quantumAiKnowledge.projects
      .slice(0, 4)
      .map((p) => `${p.name} (${p.what})`)
      .join("; ");
    return `Prabhat has built several products, including ${list}. Ask about any one by name for details.`;
  }
  return null;
}

export function answerVentureQuestion(message: string): string | null {
  if (!isVentureQuestion(message)) return null;
  const v = quantumAiKnowledge.venture;
  return `${v.name} is Prabhat's AI automation and SaaS agency, based in ${v.location}, targeting ${v.targetVerticals.join(", ")} across ${v.targetMarkets.join(", ")}. ${v.stage}`;
}

export function answerSkillQuestion(message: string): string | null {
  if (!isSkillQuestion(message)) return null;
  const text = message.toLowerCase();
  const { stack } = quantumAiKnowledge;

  if (/\b(frontend|front-end|ui|react|next)\b/.test(text)) {
    return `His documented frontend stack includes ${stack.frontend.join(", ")}.`;
  }
  if (/\b(ai|llm|machine learning|automation)\b/.test(text)) {
    return `His documented AI and automation work includes ${stack.ai_ml.join(", ")}, with projects using AI APIs and local LLM tooling.`;
  }
  if (/\b(cloud|devops|infra|deployment)\b/.test(text)) {
    return `His documented cloud and infrastructure stack includes ${stack.cloud_infra.join(", ")}.`;
  }
  if (/\b(database|data|sql)\b/.test(text)) {
    return `His documented data stack includes ${stack.databases.join(", ")}.`;
  }
  if (/\b(back.?end|java|api|server|microservice)\b/.test(text)) {
    return `His documented backend stack includes ${stack.backend.join(", ")}.`;
  }

  return `Prabhat's documented strengths span Java and Spring Boot backend engineering, React/Next.js frontend work, cloud deployment, AI integrations, and product architecture. His core tools include ${stack.languages.join(", ")}, ${stack.backend.slice(0, 4).join(", ")}, and ${stack.frontend.slice(0, 3).join(", ")}.`;
}

export function answerSiteQuestion(message: string): string | null {
  if (!isSiteQuestion(message)) return null;
  const s = quantumAiKnowledge.siteInfo;
  if (/\bwho are you|what are you\b/i.test(message)) {
    return `I'm ${s.assistantName}, Prabhat Kumar's portfolio assistant. I can answer questions about his experience, skills, and projects, or help prepare a meeting request.`;
  }
  return `This is ${s.assistantName}, running on Prabhat's portfolio site (${s.domain}). ${s.assistantPurpose}`;
}

export function handleOutOfScope(message: string): string | null {
  if (!isOutOfScope(message)) return null;
  return `That's outside what I'm set up to help with here — I'm focused on Prabhat's background, skills, and projects, plus scheduling time with him. Happy to answer anything along those lines.`;
}
// ---- new detectors ----

function isBackgroundQuestion(message: string): boolean {
  return /\b(who is|about him|his background|his experience|work experience|work history|professional experience|netcore|how many years|where is he|based in|current role|what does he do|full[- ]time|open to|available for|freelance|hire him)\b/i.test(message);
}

function answerBackgroundQuestion(message: string): string | null {
  if (!isBackgroundQuestion(message)) return null;
  const text = message.toLowerCase();
  const { identity, currentRole } = quantumAiKnowledge;

  if (/how many years|experience level/.test(text)) {
    return `Prabhat has been a professional software developer since January 2023 (Java/Spring Boot at Netcore Cloud), with earlier background in technical support before the transition. If you need a precise years-of-experience number for a specific requirement, tell me the cutoff and I'll compare it directly.`;
  }
  if (/where is he|based in|location/.test(text)) {
    return `${identity.location}.`;
  }
  if (/full[- ]time|open to|available for|freelance|hire him/.test(text)) {
    return `He's currently full-time at ${currentRole.company}, and separately runs ${quantumAiKnowledge.venture.name} on the side taking on select freelance/agency work. I don't have confirmed details on availability terms for a specific offer — that's worth asking him directly, and I can flag it.`;
  }
  if (/netcore|work experience|work history|professional experience|work experience/.test(text)) {
    return `Prabhat has been a Java Software Developer at Netcore Cloud since January 2023. His documented work there includes Java, Spring Boot, Hibernate, microservices, REST APIs, MySQL, and AWS; before that, he completed a Java Software Engineer internship at CodeSpeedy Technology.`;
  }
  return `${identity.tagline}. Currently ${currentRole.title} at ${currentRole.company} (since ${currentRole.since}), based in ${identity.location}.`;
}

function isBareTechQuestion(message: string): { tech: string } | null {
  const KNOWN_TECH_QUERY = /\b(does he know|has he used|experience with|worked with|familiar with)\s+([a-z0-9.+#/\- ]{2,30})/i;
  const m = message.match(KNOWN_TECH_QUERY);
  if (!m) return null;
  return { tech: m[2].trim() };
}

function answerBareTechQuestion(message: string): string | null {
  const hit = isBareTechQuestion(message);
  if (!hit) return null;
  const tech = hit.tech.toLowerCase();
  const allSkills = Object.values(quantumAiKnowledge.stack).flat().map(s => s.toLowerCase());
  const found = allSkills.some(s => s.includes(tech) || tech.includes(s));
  if (found) {
    return `Yes — ${hit.tech} is part of his documented stack.`;
  }
  return `I don't have confirmed portfolio evidence of ${hit.tech}. I won't guess on that — happy to flag it for Prabhat to answer directly if it matters for your evaluation.`;
}

function isGreeting(message: string): boolean {
  return /^(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(message.trim());
}

// ---- orchestrator ----

export interface QuantumAiTurnResult {
  answerSegments: string[];   // substantive answers, in priority order
  schedulingIntentDetected: boolean;
  offTopic: boolean;
}

/**
 * Runs a single user message through all detectors and returns every
 * substantive answer that applies, in priority order. Scheduling-flow
 * handling is layered on top of this by the state machine — this function
 * only ever produces the "answer the question" half of a response.
 */
export function processTurn(message: string): QuantumAiTurnResult {
  if (isGreeting(message) && message.trim().split(/\s+/).length <= 4) {
    return {
      answerSegments: [`Hi — I'm QuantumAI, here to answer questions about Prabhat's background, skills, and projects, or help you schedule time with him.`],
      schedulingIntentDetected: false,
      offTopic: false,
    };
  }

  const segments: string[] = [];

  // Priority order: fit > background > skills > project > venture > site > bare-tech
  const fit = evaluateFitQuestion(message);
  if (fit) segments.push(fit);

  const background = answerBackgroundQuestion(message);
  if (background && !fit) segments.push(background);

  const skills = answerSkillQuestion(message);
  if (skills && !fit) segments.push(skills);

  const project = answerProjectQuestion(message);
  if (project) segments.push(project);

  const venture = answerVentureQuestion(message);
  if (venture) segments.push(venture);

  const site = answerSiteQuestion(message);
  if (site) segments.push(site);

  const bareTech = answerBareTechQuestion(message);
  if (bareTech && segments.length === 0) segments.push(bareTech);

  const schedulingIntentDetected = /\b(schedule|book (a|the) (call|meeting|interview)|set up (a|the) meeting|meeting form)\b/i.test(message);

  if (segments.length === 0 && isOutOfScope(message)) {
    return { answerSegments: [handleOutOfScope(message)!], schedulingIntentDetected, offTopic: true };
  }

  return { answerSegments: segments, schedulingIntentDetected, offTopic: false };
}
