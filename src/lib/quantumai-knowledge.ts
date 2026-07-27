/** Grounded facts used for deterministic recruiter-fit answers. */
export const quantumAiKnowledge = {
  currentRole: {
    title: "Java Software Developer",
    company: "Netcore Cloud",
    since: "January 2023",
    skills: ["Java", "Spring Boot", "Hibernate", "Microservices", "REST APIs", "MySQL", "AWS"],
  },
  stack: [
    "Java", "Spring Boot", "Spring Security", "Hibernate", "Microservices",
    "REST APIs", "PostgreSQL", "MySQL", "MongoDB", "Next.js", "React",
    "TypeScript", "AWS", "Docker", "CI/CD", "GitHub Actions", "Spring AI",
  ],
  projects: [
    { name: "CodeGuard AI", proof: "a published VS Code extension that detects AWS Terraform cost risks before deployment", skills: ["TypeScript", "AWS", "Terraform", "static analysis"] },
    { name: "SystemFoundry", proof: "an architecture-planning product for API boundaries, trade-offs, diagrams, and engineering roadmaps", skills: ["system design", "backend architecture", "API design"] },
    { name: "AcquisitionOS", proof: "an AI-assisted lead qualification and sales-workflow system", skills: ["AI workflows", "automation", "product engineering"] },
    { name: "Ollama Spring Boot AI Integration", proof: "a streaming AI interface built with Spring AI, Ollama, and WebFlux", skills: ["Java", "Spring Boot", "WebFlux", "AI integration"] },
  ],
  achievements: ["AWS 10,000 AIdeas Competition semi-finalist", "published VS Code Marketplace extension"],
} as const;

const KNOWN = quantumAiKnowledge.stack.map((skill) => skill.toLowerCase());
const TECH_PATTERNS = ["java", "spring boot", "spring", "microservices", "postgresql", "mysql", "mongodb", "next.js", "react", "typescript", "aws", "docker", "kubernetes", "kafka", "python", "golang", "node.js"];

export function isFitQuestion(message: string): boolean {
  return /\b(good fit|fit for|qualified|qualify|match(?:es)?|suitable|experience.*(?:role|requirement)|role.*(?:experience|skills?|fit)|does he have|is he good)\b/i.test(message);
}

/** Returns a concise fact-based answer without inventing unlisted credentials. */
export function evaluateFitQuestion(message: string): string | null {
  if (!isFitQuestion(message)) return null;
  const text = message.toLowerCase();
  const requestedYears = Number(text.match(/(\d+)\s*\+?\s*years?/)?.[1] ?? 0);
  const requestedTech = TECH_PATTERNS.filter((tech) => text.includes(tech));
  const unknownTech = requestedTech.filter((tech) => !KNOWN.some((known) => known.includes(tech) || tech.includes(known)));
  const javaBackend = /\b(java|backend|spring boot|microservices)\b/.test(text);
  const yearsCovered = !requestedYears || requestedYears <= 3;

  if (unknownTech.length > 0) {
    return `I don't have confirmed portfolio information for ${unknownTech.join(", ")}. For the rest of the role, Prabhat has been a Java Software Developer at Netcore Cloud since January 2023, working with Spring Boot, microservices, REST APIs, MySQL, and AWS; I can flag the unconfirmed requirement for him to answer directly.`;
  }
  if (javaBackend && yearsCovered) {
    return `Strong fit. Prabhat has worked as a Java Software Developer at Netcore Cloud since January 2023, using Spring Boot, microservices, REST APIs, MySQL, and AWS. He also built backend and streaming-AI work such as the Spring Boot/Ollama WebFlux integration, which directly supports a Java backend profile.`;
  }
  if (javaBackend) {
    return `Partial fit based on the confirmed portfolio. Prabhat has been working with Java and Spring Boot at Netcore Cloud since January 2023 and has relevant backend project experience, but I cannot confirm the exact ${requestedYears}+ year requirement beyond that documented timeline.`;
  }
  return `I can confirm Prabhat's experience with ${quantumAiKnowledge.stack.slice(0, 8).join(", ")}. If you share the role's required stack or years of experience, I can compare those requirements against the documented portfolio facts.`;
}
