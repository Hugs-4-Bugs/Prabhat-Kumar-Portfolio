import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SeoTitleSync } from "./seo-title-sync";

const siteUrl = "https://www.prabhat.online";
const ogImage = `${siteUrl}/Prabhat%20image.png`;

type CodeBlock = {
  language: string;
  code: string;
};

type Section = {
  eyebrow?: string;
  title: string;
  body: string[];
  bullets?: string[];
  code?: CodeBlock;
  diagram?: string[];
};

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  keywords: string[];
  sections: Section[];
};

export function createSeoMetadata(page: SeoPage): Metadata {
  const url = `${siteUrl}/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Prabhat Kumar",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
  };
}

export function SeoPageShell({ page }: { page: SeoPage }) {
  const pageUrl = `${siteUrl}/${page.slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <SeoTitleSync title={page.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="relative min-h-screen bg-background text-foreground">
        <div className="sticky top-20 z-40 mx-auto flex w-full max-w-6xl justify-start px-4 pt-4 sm:px-6 lg:px-8">
          <Link
            href="/#seo-pages"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/10 backdrop-blur transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <header className="max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {page.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {page.intro}
            </p>
          </header>

          <div className="mt-14 grid gap-10">
            {page.sections.map((section, index) => (
              <section
                key={section.title}
                className="rounded-lg border border-border/80 bg-card/40 p-6 shadow-sm sm:p-8"
              >
                {section.eyebrow && (
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {section.eyebrow}
                  </p>
                )}
                {index === 0 ? (
                  <h2 className="font-headline text-3xl font-semibold tracking-tight">
                    {section.title}
                  </h2>
                ) : (
                  <h2 className="font-headline text-2xl font-semibold tracking-tight sm:text-3xl">
                    {section.title}
                  </h2>
                )}
                <div className="mt-5 space-y-4 text-base leading-8 text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.bullets && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="flex gap-3 rounded-md border border-border/70 bg-background/60 p-4"
                      >
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <h3 className="text-sm font-medium leading-6 text-foreground">
                          {bullet}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}

                {section.diagram && (
                  <div className="mt-6 overflow-x-auto rounded-md border border-border bg-muted/30 p-4">
                    <pre className="text-sm leading-7 text-foreground">
                      {section.diagram.join("\n")}
                    </pre>
                  </div>
                )}

                {section.code && (
                  <div className="mt-6 overflow-hidden rounded-md border border-border bg-slate-950 text-slate-100 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-400">
                      <span>Example</span>
                      <span>{section.code.language}</span>
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm leading-7">
                      <code className={`language-${section.code.language}`}>
                        <HighlightedCode
                          code={section.code.code}
                          language={section.code.language}
                        />
                      </code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <h2 className="font-headline text-2xl font-semibold tracking-tight">
              Work with Prabhat
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
              Build production-grade backend systems, AI workflows, cloud
              automation, and high-signal engineering products with a developer
              who ships from architecture to deployment.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Work with Prabhat
              <ArrowRight className="h-4 w-4" />
              Contact
            </Link>
          </section>
        </div>
      </article>
    </>
  );
}

function HighlightedCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const keywordPattern = getKeywordPattern(language);

  return (
    <>
      {code.split("\n").map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="block">
          {highlightLine(line, keywordPattern)}
        </span>
      ))}
    </>
  );
}

function getKeywordPattern(language: string) {
  const common = [
    "async",
    "await",
    "class",
    "const",
    "enum",
    "function",
    "if",
    "new",
    "public",
    "return",
    "void",
  ];
  const languageKeywords: Record<string, string[]> = {
    java: [
      "Bean",
      "Boolean",
      "Duration",
      "Exception",
      "List",
      "Long",
      "SecurityFilterChain",
      "String",
      "boolean",
      "throws",
    ],
    python: ["Enum", "TradeDecision", "def", "elif", "else", "from"],
    typescript: ["document", "findings", "map", "vscode"],
    yaml: ["application", "cloud", "gateway", "name", "routes", "spring"],
  };
  const keywords = [...common, ...(languageKeywords[language] ?? [])];

  return new RegExp(
    `(//.*|#.*|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\\b(?:${keywords.join(
      "|"
    )})\\b|@[A-Za-z0-9_]+|\\b\\d+\\b)`,
    "g"
  );
}

function highlightLine(line: string, keywordPattern: RegExp) {
  const parts = line.split(keywordPattern);

  return parts.map((part, index) => {
    if (!part) return null;

    let className = "text-slate-100";
    if (part.startsWith("//") || part.startsWith("#")) {
      className = "text-slate-500";
    } else if (part.startsWith("\"") || part.startsWith("'")) {
      className = "text-emerald-300";
    } else if (part.startsWith("@")) {
      className = "text-sky-300";
    } else if (/^\d+$/.test(part)) {
      className = "text-amber-300";
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) {
      className = "text-violet-300";
    }

    return (
      <span key={`${part}-${index}`} className={className}>
        {part}
      </span>
    );
  });
}

export const seoPages: Record<string, SeoPage> = {
  "trading-bot-architecture": {
    slug: "trading-bot-architecture",
    title:
      "Building a Production-Grade AI Trading Bot for Indian Markets (NIFTY 50, BANK NIFTY, Crypto)",
    description:
      "Architecture overview of Prabhat Kumar's AI trading bot for Indian markets, crypto, risk controls, live dashboards, broker integrations, and AI analysis.",
    intro:
      "A production-grade trading system needs more than signals. It needs streaming data, broker-safe execution, risk boundaries, auditability, and a clean path from paper trading to live capital.",
    keywords: ["AI Trading Bot", "NIFTY 50", "BANK NIFTY", "Crypto"],
    sections: [
      {
        eyebrow: "Architecture",
        title: "System Overview",
        body: [
          "Prabhat's trading bot architecture is built around a FastAPI backend, WebSocket-powered dashboard, Claude AI analysis layer, broker connectors, and a risk management service that guards every order before it reaches the market.",
          "The system supports NIFTY 50, BANK NIFTY, SENSEX, Gold, Silver, Crude Oil, and Crypto instruments, with separate adapters for Zerodha Kite Connect and Binance.",
        ],
        diagram: [
          "+------------------+      +--------------------+      +-------------------+",
          "| Market Data Feed | ---> | FastAPI Core Engine | ---> | Risk Manager      |",
          "| Kite + Binance   |      | Signals + WebSocket |      | Limits + Kill Sw. |",
          "+------------------+      +--------------------+      +---------+---------+",
          "         |                         |                             |",
          "         v                         v                             v",
          "+------------------+      +--------------------+      +-------------------+",
          "| Claude AI Layer  |      | Realtime Dashboard |      | Order Execution   |",
          "| Context Analysis |      | PnL + Positions    |      | Paper -> Live     |",
          "+------------------+      +--------------------+      +-------------------+",
          "                                      |",
          "                                      v",
          "                         +--------------------------+",
          "                         | Telegram + WhatsApp      |",
          "                         | Alerts + Trade Reports   |",
          "                         +--------------------------+",
        ],
      },
      {
        title: "Realtime Dashboard and AI Analysis",
        body: [
          "The WebSocket dashboard streams positions, order state, live PnL, drawdown, model confidence, and risk flags without forcing traders to refresh.",
          "Claude AI can summarize market context, detect regime shifts, explain why a setup is risky, and generate a plain-English trade journal after execution.",
        ],
        bullets: [
          "Live positions and realized or unrealized PnL",
          "Instrument-level risk limits",
          "AI market context and setup validation",
          "Telegram and WhatsApp notifications",
        ],
      },
      {
        title: "Paper Trading to Live Trading Flow",
        body: [
          "The execution layer treats paper trading and live trading as two modes behind the same order interface. A strategy can be tested with simulated fills, then promoted to live execution only after risk rules, sizing, and daily loss limits are proven.",
        ],
        code: {
          language: "python",
          code: `class ExecutionMode(str, Enum):
    PAPER = "paper"
    LIVE = "live"

async def place_order(signal: TradeSignal, mode: ExecutionMode):
    risk_result = await risk_manager.validate(signal)
    if not risk_result.allowed:
        return TradeDecision(status="blocked", reason=risk_result.reason)

    if mode == ExecutionMode.PAPER:
        return await paper_broker.simulate(signal)

    return await kite_or_binance.place_order(signal)`,
        },
      },
    ],
  },
  "ai-sales-outreach-platform": {
    slug: "ai-sales-outreach-platform",
    title:
      "AI-Powered Sales Outreach & Lead Automation Platform — Architecture & Engineering",
    description:
      "Engineering breakdown of Prabhat Kumar's 24/7 AI sales outreach platform for lead discovery, validation, personalization, follow-ups, reply classification, and analytics.",
    intro:
      "This platform turns outbound sales into an automated engineering pipeline: discover leads, validate contacts, personalize messages, run campaigns, classify replies, and surface real-time analytics.",
    keywords: ["AI Outreach", "Spring Boot", "Lead Automation", "B2B SaaS"],
    sections: [
      {
        title: "24/7 Laptop-Hosted Automation System",
        body: [
          "The system runs continuously on Prabhat's laptop and coordinates lead discovery, email validation, campaign execution, AI personalization, automated follow-up sequences, reply classification, and dashboard analytics.",
          "It is designed for B2B lead generation, SaaS outbound sales, and agency prospecting where personalization and response handling matter more than raw volume.",
        ],
        bullets: [
          "LinkedIn, Google Maps, and company website discovery",
          "MX, SMTP, and domain reputation validation",
          "OpenAI-powered personalization",
          "Interested, Not Interested, Schedule Later, and Demo Request classification",
        ],
      },
      {
        title: "Microservice-Oriented Stack",
        body: [
          "The backend uses Java, Spring Boot, Spring Security, JWT, PostgreSQL, Redis, and Kafka or RabbitMQ for asynchronous workflows. Python workers handle scraping, enrichment, and AI-heavy tasks where the ecosystem is stronger.",
          "React and Next.js power the dashboard, Docker packages the stack, and Redis keeps rate limits, campaign state, and temporary enrichment results fast.",
        ],
        diagram: [
          "Lead Sources -> Discovery Workers -> Validation Queue -> CRM Store",
          "CRM Store -> AI Personalization -> Campaign Manager -> Follow-up Engine",
          "Inbox Webhooks -> AI Reply Classifier -> Auto Reply + Workflow Automation",
          "Events -> Analytics Stream -> Realtime Dashboard",
        ],
      },
      {
        title: "Reply Classification and Workflow Automation",
        body: [
          "Inbound replies are classified into business states instead of being dumped into an inbox. That makes it possible to auto-send meeting links, stop campaigns for uninterested leads, or schedule later follow-ups without manual sorting.",
        ],
        code: {
          language: "java",
          code: `public enum ReplyIntent {
    INTERESTED,
    NOT_INTERESTED,
    SCHEDULE_LATER,
    DEMO_REQUEST
}

public void handleReply(LeadReply reply) {
    ReplyIntent intent = aiClassifier.classify(reply);
    workflowRouter.route(reply.leadId(), intent);
}`,
        },
      },
    ],
  },
  "aws-codeguard-ai": {
    slug: "aws-codeguard-ai",
    title: "CodeGuard AI — Real-Time AWS Cost Detection in VS Code for Terraform",
    description:
      "CodeGuard AI is Prabhat Kumar's VS Code extension for real-time AWS Terraform cost detection, quick fixes, diagnostics, and cloud cost guardrails.",
    intro:
      "CodeGuard AI catches expensive AWS Terraform patterns directly inside VS Code, before infrastructure is applied and before cost mistakes reach production.",
    keywords: ["CodeGuard AI", "AWS", "Terraform", "VS Code"],
    sections: [
      {
        title: "Real-Time Terraform Cost Detection",
        body: [
          "CodeGuard AI is a VS Code extension that analyzes Terraform files in real time and flags AWS cost issues through the editor's DiagnosticCollection API.",
          "It uses a 14-pattern rule engine, debounced document analysis, CodeActionProvider quick fixes, and a webview results panel for readable cost guidance.",
        ],
        bullets: [
          "AWS 10,000 AIdeas Competition semi-finalist",
          "DiagnosticCollection-powered inline warnings",
          "CodeActionProvider Quick Fixes",
          "Demo: https://youtu.be/-epMTSDVvH4",
        ],
      },
      {
        title: "TypeScript Extension Flow",
        body: [
          "The extension watches Terraform documents, waits for edits to settle, runs cost-pattern detection, then publishes diagnostics and quick fixes back into the editor.",
        ],
        code: {
          language: "typescript",
          code: `const diagnostics = vscode.languages.createDiagnosticCollection("codeguard-ai");

function analyzeTerraform(document: vscode.TextDocument) {
  const findings = ruleEngine.scan(document.getText());
  diagnostics.set(
    document.uri,
    findings.map(toDiagnostic)
  );
}`,
        },
      },
      {
        title: "Roadmap",
        body: [
          "Phase 1 is the live VS Code extension. Phase 2 expands the product into a SaaS web app for team-level scans and reports. Phase 3 adds premium subscriptions, policy packs, and organization-wide cloud cost workflows.",
        ],
      },
    ],
  },
  "spring-boot-jwt-authentication-guide": {
    slug: "spring-boot-jwt-authentication-guide",
    title: "Spring Boot JWT Authentication — Complete Guide with Spring Security 6",
    description:
      "Complete Spring Boot JWT authentication guide with Spring Security 6, filters, UserDetailsService, refresh tokens, roles, Postman testing, and common 403 fixes.",
    intro:
      "JWT authentication in Spring Security 6 becomes reliable when the filter chain, user loading, token validation, refresh flow, and role checks are designed as one system.",
    keywords: ["Spring Boot", "JWT", "Spring Security 6", "Java"],
    sections: [
      {
        title: "JWT Filter Chain",
        body: [
          "A stateless JWT setup disables sessions, allows authentication routes, protects application APIs, and inserts a JWT filter before UsernamePasswordAuthenticationFilter.",
        ],
        code: {
          language: "java",
          code: `@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}`,
        },
      },
      {
        title: "UserDetailsService and Token Generation",
        body: [
          "UserDetailsService should load users by email or username and return authorities that match the access rules. Token generation should include subject, expiry, issued date, and minimal role claims.",
        ],
        code: {
          language: "java",
          code: `public String generateToken(UserDetails user) {
    return Jwts.builder()
        .subject(user.getUsername())
        .claim("roles", user.getAuthorities())
        .issuedAt(new Date())
        .expiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
        .signWith(secretKey)
        .compact();
}`,
        },
      },
      {
        title: "Refresh Tokens, Roles, and Postman Testing",
        body: [
          "Use short-lived access tokens and longer-lived refresh tokens stored server-side or in a revocation-aware persistence layer. In Postman, test login, access with Bearer token, refresh, logout, expired token, and role-restricted endpoints.",
          "Common 403 errors usually come from role prefix mismatches, missing Authorization headers, CORS preflight requests, CSRF being enabled for APIs, or filters running in the wrong order.",
        ],
      },
    ],
  },
  "java-microservices-project": {
    slug: "java-microservices-project",
    title: "Java Microservices Architecture — Real-World Implementation with Spring Cloud",
    description:
      "Real-world Java microservices architecture with Spring Cloud, Eureka, API Gateway, config server, REST, Kafka, tracing, Docker Compose, and CI/CD.",
    intro:
      "A production microservices architecture is a set of operational contracts: service discovery, routing, configuration, communication, tracing, deployment, and failure handling.",
    keywords: ["Java Microservices", "Spring Cloud", "Eureka", "Kafka"],
    sections: [
      {
        title: "Production Architecture from Backend Experience",
        body: [
          "Based on Prabhat's backend experience at Netcore Cloud, the architecture centers on Spring Boot services, service discovery through Eureka, Spring Cloud Gateway, centralized configuration, REST communication, Kafka events, and clear CI/CD boundaries.",
        ],
        diagram: [
          "Client -> API Gateway -> Auth Service",
          "                    -> User Service -> PostgreSQL",
          "                    -> Notification Service -> Kafka",
          "Config Server -> All Services",
          "Eureka Registry -> Service Discovery",
          "Tracing -> Logs + Metrics + Distributed Spans",
        ],
      },
      {
        title: "Service Discovery, Gateway, and Config Server",
        body: [
          "Eureka lets services register and discover each other without hard-coded hostnames. The API Gateway centralizes routing, authentication handoff, rate limits, and cross-cutting filters. Config Server keeps environment-specific configuration consistent across deployments.",
        ],
        code: {
          language: "yaml",
          code: `spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**`,
        },
      },
      {
        title: "REST, Kafka, Docker Compose, and CI/CD",
        body: [
          "REST is useful for request-response flows, while Kafka is better for asynchronous domain events such as notifications, audit logs, and analytics. Docker Compose provides a local production-like environment, and CI/CD runs tests, builds images, and deploys services predictably.",
        ],
      },
    ],
  },
  "ai-observability-platform": {
    slug: "ai-observability-platform",
    title: "AI Observability Platform — Kafka Event Architecture for Real-Time Monitoring",
    description:
      "AI observability platform architecture using Kafka, Spring Boot consumers, real-time dashboards, anomaly detection, and alerting.",
    intro:
      "Modern AI systems need observability for prompts, latency, token usage, errors, model drift, anomalies, and user-facing behavior in real time.",
    keywords: ["AI Observability", "Kafka", "Spring Boot", "Monitoring"],
    sections: [
      {
        title: "Event-Driven Monitoring Architecture",
        body: [
          "The platform emits structured events for model requests, responses, latency, token usage, failures, user feedback, and downstream workflow outcomes. Kafka stores those events as durable streams that multiple consumers can process independently.",
        ],
        diagram: [
          "AI Apps -> Event SDK -> Kafka Topics",
          "Kafka -> Spring Boot Consumers -> Metrics Store",
          "Kafka -> Anomaly Detection Worker -> Alert Manager",
          "Metrics Store -> Realtime Dashboard",
        ],
      },
      {
        title: "Spring Boot Consumers and Anomaly Detection",
        body: [
          "Spring Boot consumers aggregate events into service-level metrics while anomaly workers watch for unusual latency spikes, high error rates, abnormal token usage, and suspicious model output patterns.",
        ],
        code: {
          language: "java",
          code: `@KafkaListener(topics = "ai-observability-events")
public void consume(AiEvent event) {
    metricsStore.record(event);

    if (anomalyDetector.isSuspicious(event)) {
        alertManager.notify(event);
    }
}`,
        },
      },
      {
        title: "Dashboards and Alerts",
        body: [
          "The dashboard exposes latency percentiles, model cost, prompt volume, failure rate, anomalous sessions, and service health. Alerts can route to email, Slack, Telegram, or incident tooling depending on severity.",
        ],
      },
    ],
  },
  "system-design-interview": {
    slug: "system-design-interview",
    title: "System Design Interview Preparation — Real-World Patterns by a Production Engineer",
    description:
      "System design interview preparation with HLD and LLD patterns, rate limiting, caching, sharding, CAP theorem, trading systems, and outreach platforms.",
    intro:
      "Good system design answers connect fundamentals to real product constraints: traffic, data shape, latency, consistency, failures, cost, and operational recovery.",
    keywords: ["System Design", "HLD", "LLD", "Interview Prep"],
    sections: [
      {
        title: "Patterns Prabhat Uses in Real Systems",
        body: [
          "Prabhat's system design approach starts with requirements, APIs, data model, capacity estimates, component boundaries, failure modes, and trade-offs. HLD explains the system shape; LLD clarifies classes, interfaces, state transitions, and edge cases.",
        ],
        bullets: [
          "Rate limiting with Redis token buckets",
          "Caching with explicit invalidation strategy",
          "Sharding by tenant, user, or instrument",
          "CAP theorem trade-offs for real workflows",
        ],
      },
      {
        title: "Practical Examples",
        body: [
          "A trading system prioritizes real-time data, risk checks, idempotent order placement, and audit logs. An outreach platform prioritizes queue-based workflows, deduplication, sender reputation, reply classification, and analytics.",
        ],
        diagram: [
          "Requirements -> APIs -> Data Model -> Capacity",
          "Capacity -> HLD Components -> Failure Modes",
          "Failure Modes -> LLD Contracts -> Trade-offs",
        ],
      },
      {
        title: "Rate Limiter Example",
        body: [
          "Rate limiting protects APIs from abuse and stabilizes downstream services during bursts. Redis is commonly used because counters and expiry operations are fast and centralized.",
        ],
        code: {
          language: "java",
          code: `boolean allowRequest(String userId) {
    String key = "rate:" + userId;
    Long count = redisTemplate.opsForValue().increment(key);
    if (count == 1) {
        redisTemplate.expire(key, Duration.ofMinutes(1));
    }
    return count <= 100;
}`,
        },
      },
    ],
  },
  "spring-security-403-fix": {
    slug: "spring-security-403-fix",
    title: "Spring Security 403 Forbidden Fix — JWT, CORS, and Filter Chain Debugging Guide",
    description:
      "Debug Spring Security 403 Forbidden errors caused by JWT validation, CORS, CSRF, role prefixes, and filter chain order with working code snippets.",
    intro:
      "A 403 in Spring Security means the request reached the security layer but authorization failed. The fix depends on whether the cause is JWT parsing, role mapping, CORS, CSRF, or filter order.",
    keywords: ["Spring Security", "403 Forbidden", "JWT", "CORS"],
    sections: [
      {
        title: "Start with the Filter Chain",
        body: [
          "JWT filters should run before UsernamePasswordAuthenticationFilter, CORS should be configured before authorization decisions, and stateless APIs should usually disable CSRF unless browser sessions are involved.",
        ],
        code: {
          language: "java",
          code: `@Bean
SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
    return http
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}`,
        },
      },
      {
        title: "CORS, CSRF, and Role Prefix Issues",
        body: [
          "CORS failures often appear before your controller runs. Permit OPTIONS requests and explicitly allow the frontend origin. Role bugs usually come from using hasRole('ADMIN') while storing authorities as ADMIN instead of ROLE_ADMIN, or using hasAuthority when the code expects hasRole.",
        ],
        code: {
          language: "java",
          code: `@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://www.prabhat.online"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}`,
        },
      },
      {
        title: "Debugging Checklist",
        body: [
          "Check that the Authorization header starts with Bearer, the token subject maps to a real user, authorities are loaded correctly, the endpoint matcher is not too broad, and logs show the JWT filter setting SecurityContextHolder authentication.",
        ],
        bullets: [
          "JWT expired or signed with the wrong key",
          "Missing ROLE_ prefix for hasRole checks",
          "OPTIONS preflight blocked by authentication",
          "CSRF enabled on stateless REST APIs",
        ],
      },
    ],
  },
};
