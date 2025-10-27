// src/lib/data.ts
import {
  Github,
  Linkedin,
  Instagram,
  Layers,
  Briefcase,
  Code,
  ListCheck,
  ListChecks,
  Twitter,
  Youtube,
  Mail,
  Facebook,
  Send,
  Monitor,
  CodeXml,
  Cpu,
  Server,
  Cloud,
  TrendingUp,
  BrainCircuit,
  ScreenShare,
  Palette,
  Bot,
  Terminal,
  Database,
  PenTool,
  Webhook,
} from "lucide-react";

import type { Project, Service, SkillCategory, SocialLink, TimelineEvent, Education, NavLink, ProjectFilter, TechCategory } from "@/lib/types";

export const siteConfig = {
  name: "Prabhat Kumar",
  title: "Prabhat Kumar - Software Alchemist",
  description: "Hi! I'm Prabhat Kumar, a passionate Java Software Developer driven by a vision to merge intelligence with innovation.",
  email: "mailtoprabhat72@gmail.com",
  phone: "+91 7250063206",
  location: "Bengaluru, India",
  
  navLinks: [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ] as NavLink[],

  socials: {
    github: "https://github.com/Hugs-4-Bugs",
    linkedin: "https://www.linkedin.com/in/prabhat-kumar-6963661a4/",
    instagram: "https://www.instagram.com/_s_4_sharma/?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D",
  },
  
  allSocials: [
    { name: "GitHub", icon: Github, url: "https://github.com/Hugs-4-Bugs" },
    { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/prabhat-kumar-6963661a4/" },
    { name: "Twitter", icon: Twitter, url: "https://x.com/kattyPrabhat" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/_s_4_sharma/?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D" },
    { name: "StackOverflow", icon: Layers, url: "https://stackoverflow.com/users/19520484/prabhat-kumar" },
    { name: "Naukri", icon: Briefcase, url: "https://www.naukri.com/mnjuser/profile?id=&altresid" },
    { name: "HackerRank", icon: Code, url: "https://www.hackerrank.com/profile/Prabhat_7250" },
    { name: "LeetCode", icon: ListCheck, url: "https://leetcode.com/u/Hugs-2-Bugs/" },
    { name: "GeeksforGeeks", icon: ListChecks, url: "https://www.geeksforgeeks.org/user/stealthy_prabhat/" },
    { name: "YouTube", icon: Youtube, url: "https://www.youtube.com/@Hugs-4-Bugs" },
    { name: "Email", icon: Mail, url: "mailto:mailtoprabhat72@gmail.com" },
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=100009107757751" },
    { name: "Telegram", icon: Send, url: "https://t.me/prabhat_7250" },
    { name: "Dev.to", icon: Webhook, url: "https://dev.to/hugs-4-bugs" },
    { name: "Portfolio", icon: Monitor, url: "https://prabhatkr.vercel.app/" },
  ] as SocialLink[],

  about: {
    p1: "Hi! I'm Prabhat Kumar, a passionate Java Software Developer driven by a vision to merge intelligence with innovation. I dive deep into AI, web technologies, and system design - crafting software that solves real-world problems. With love for Java, Spring Boot, React, and Machine Learning, I thrive on crafting scalable, high-performance apps.",
    p2: "With 4+ years of trading experience across Stocks, Crypto, Forex & Derivatives, I specialize in combining algorithmic precision with market psychology.",
    p3: "I am always exploring new technologies and creating innovative solutions to solve complex problems in a range of fields.",
    interests: ["AI", "Full Stack Development", "Open Source", "System Design", "Trading", "Writing", "Innovation"],
  },

  services: [
    { icon: Server, title: "API Development and Integration", description: "Crafting seamless digital connections, I specialize in API development and integration, ensuring robust communication between systems for a cohesive and efficient user experience." },
    { icon: Cpu, title: "Java Software Development", description: "Expert Java Developer skilled in Spring Boot, Hibernate, Microservices, and database management. Proven track record in creating robust, efficient Java applications." },
    { icon: Cloud, title: "Cloud Infrastructure & DevOps", description: "I architect and manage cloud-native solutions with AWS, focusing on scalability, security, and automation, from CI/CD pipelines to container orchestration." },
    { icon: TrendingUp, title: "Strategic Trading Solutions", description: "4+ years in Stock, Future & Option, Crypto, and Forex trading. Offering tailored strategies and insights for optimized trading experiences." },
    { icon: BrainCircuit, title: "AI/ML Implementation", description: "Designing and deploying intelligent systems with real-world machine learning models, from predictive analytics to natural language processing." },
    { icon: ScreenShare, title: "Web Application Development", description: "I build scalable, high-performance web applications using modern frameworks and best practices, optimized for responsiveness and efficiency." },
    { icon: Palette, title: "UI/UX Design", description: "Crafting user-centric interfaces that are visually stunning, intuitive, and accessible. I focus on design systems and responsive layouts to enhance user engagement." },
    { icon: Bot, title: "System Architecture & Automation", description: "Specialized in designing end-to-end system architectures and automating complex workflows, from custom servers to AI pipelines." },
  ] as Service[],
  
  workExperience: [
    { date: "June 2025 – Present", title: "Technical Support Engineer", company: "Startek Technology Private Limited", description: "Provided technical support for Acer systems, troubleshot hardware/software/network issues, and handled incident management. Collaborated with cross-functional teams to ensure smooth service delivery.", tags: ["Windows", "Linux", "Networking", "Remote Support", "Ticketing Systems"] },
    { date: "Jan 2023 – April 2025", title: "Backend Developer", company: "JMR Infotech Pvt Ltd", description: "Developed login/signup systems with Spring Security & JWT. Built scalable backend services for Supply Chain & Real Estate projects and created blog APIs. Collaborated with frontend and QA teams.", tags: ["Java", "Spring Boot", "Hibernate", "MySQL", "JWT", "Postman"] },
    { date: "Oct 2022 – Dec 2022", title: "Java Software Engineer Intern", company: "CodeSpeedy Technology Pvt Ltd", description: "Built authentication modules using Spring Boot & JWT. Managed entity relationships via Hibernate ORM and streamlined error handling with custom exceptions.", tags: ["Java", "Spring Boot", "Hibernate", "JWT", "MySQL"] },
    { date: "2022", title: "Remote Job Simulation", company: "Walmart USA", description: "Completed Advanced Software Engineering simulations. Built custom Java heap for logistics and created UML/ER diagrams for scalable system design.", tags: ["Java", "System Design", "UML", "Logistics"] },
  ] as TimelineEvent[],

  education: [
      { date: "2019-2023", title: "Bachelor of Engineering, Computer Science", company: "Visvesvaraya Technological University", description: "CGPA: 7.85", tags: [] },
      { date: "2016-2018", title: "Pre-University Course", company: "Veer Kunwar Singh University", description: "Percentage: 62.4%", tags: [] },
      { date: "2016", title: "Secondary School", company: "St. Anne's Mission School", description: "CGPA: 9.2", tags: [] }
  ] as Education[],

  projects: [
    {
      title: 'Cryptocurrency Price Prediction',
      description: 'A machine learning-based app that predicts Bitcoin prices using historical data. Demonstrates data preprocessing, model training, and performance evaluation in a real-world finance use case.',
      tags: ['Python', 'Machine Learning', 'Pandas', 'Matplotlib'],
      link: 'https://github.com/Hugs-4-Bugs/Cryptocurrency-Price-prediction-using-ML',
      image: 'project-crypto-prediction',
    },
    {
      title: 'QuantumFusion Solutions',
      description: 'Official website of QuantumFusion Solutions — an innovative tech company shaping the future through AI, cloud computing, automation, and open-source development. Showcases services, projects, and the company’s mission to empower digital transformation.',
      tags: ['Next.js', 'Vercel', 'Tailwind CSS', 'Company Portfolio'],
      link: 'https://quantumfusion-solutions.vercel.app/',
      image: 'project-quantumfusion',
    },
    {
      title: 'PrabhatVerse',
      description: 'A visionary personal universe crafted by Prabhat Kumar, featuring his projects, innovations, blogs, and creative works. PrabhatVerse acts as a digital portfolio, connecting all ventures from AI to cloud computing under a unified identity.',
      tags: ['Next.js', 'Portfolio', 'Creative Hub', 'Tailwind CSS'],
      link: 'https://prabhatverse.vercel.app/',
      image: 'project-prabhatverse',
    },    
    {
      title: 'ArticleHub Application',
      description: 'A full-stack content management platform where users can create, manage, and explore articles. Features include admin control, category management, user roles, and a clean, responsive UI. Built with Angular and integrated with a Node.js backend.',
      tags: ['Angular', 'Node.js', 'REST API', 'JWT Auth', 'Material UI'],
      link: 'https://github.com/Hugs-4-Bugs/ArticleHub-Application',
      image: 'project-articlehub',
    },    
    {
      title: 'REST API CRUD Operation',
      description: 'A Spring Boot application implementing full CRUD functionality using RESTful APIs. Features Hibernate, JSP, and MySQL integration for robust backend operations.',
      tags: ['Spring Boot', 'Hibernate', 'MySQL', 'JSP'],
      link: 'https://github.com/Hugs-4-Bugs/REST-API-CRUD-Operation',
      image: 'project-rest-api',
    },
    {
      title: 'Flight Reservation System',
      description: 'A full-featured airline booking platform using Spring Boot and AngularJS. Supports flight search, booking, and check-in with secure authentication and role-based access.',
      tags: ['Spring Boot', 'AngularJS', 'Thymeleaf', 'MySQL'],
      link: 'https://github.com/Hugs-4-Bugs/Flight-Reservation-Project',
      image: 'project-flight-reservation',
    },
    {
      title: 'Blog Application (Spring Boot)',
      description: 'A secure blog platform supporting JWT authentication, CRUD operations, and Postman testing. Built with Spring Boot and MySQL for backend robustness.',
      tags: ['Spring Boot', 'JWT', 'MySQL', 'Postman'],
      link: 'https://github.com/Hugs-4-Bugs/Blog_Application-SpringBoot-Project',
      image: 'project-blog-app',
    },
    {
      title: 'Hospital Management System',
      description: 'A full-stack hospital management app with admin panels, report downloads, and service tracking. Uses Spring Boot, Thymeleaf, and Bootstrap for a responsive UI.',
      tags: ['Spring Boot', 'Thymeleaf', 'Bootstrap', 'MySQL'],
      link: 'https://github.com/Hugs-4-Bugs/Hospital-Management-Application',
      image: 'project-hospital-management',
    },
    {
      title: 'Bitcoin Mining Application',
      description: 'Spring Boot project simulating Bitcoin mining operations with account management, transactions, and audit logging. Integrates BitcoinJ and REST APIs.',
      tags: ['Spring Boot', 'BitcoinJ', 'MySQL', 'REST API'],
      link: 'https://github.com/Hugs-4-Bugs/Bitcoin-Mining-Application',
      image: 'project-bitcoin-mining',
    },
    {
      title: 'Multi File Upload System',
      description: 'Spring Boot REST API for uploading multiple files to the database using Spring Data JPA. Supports multipart handling and easy integration.',
      tags: ['Spring Boot', 'REST API', 'File Upload'],
      link: 'https://github.com/Hugs-4-Bugs/MultiFileUpload-Using-Spring-Boot-Application',
      image: 'project-file-upload',
    },
    {
      title: 'QR Code Generator',
      description: 'Java-based QR code generator that accepts text input and outputs custom QR codes. Includes REST endpoints and Postman test support.',
      tags: ['Java', 'QR Code', 'Spring Boot'],
      link: 'https://github.com/Hugs-4-Bugs/QR-code-Generator',
      image: 'project-qr-generator',
    },
    {
      title: 'Awesome Portfolio Collection',
      description: 'A curated collection of 100+ portfolio templates built using HTML, CSS, and JavaScript. Ideal for design inspiration and development practice.',
      tags: ['HTML', 'CSS', 'JavaScript', 'UI Design'],
      link: 'https://github.com/Hugs-4-Bugs/Awesome-Portfolio-Collection',
      image: 'project-portfolio-collection',
    },
    {
      title: 'GitHub Streak Back',
      description: 'Automates contributions to restore broken GitHub streaks using Node.js and Git. Ideal for devs who missed a commit.',
      tags: ['Node.js', 'Automation', 'Git'],
      link: 'https://github.com/Hugs-4-Bugs/GitHub-Streak-Back',
      image: 'project-github-streak',
    },
    {
      title: 'AlgoByPrabhat',
      description: 'A learning platform for DSA concepts with visualizations. Helps learners understand algorithms via interactive examples.',
      tags: ['JavaScript', 'Algorithms', 'Data Structures'],
      link: 'https://github.com/Hugs-4-Bugs/AlgoByPrabhat',
      image: 'project-algobyprabhat',
    },
    {
      title: 'Sharma AI Assistant',
      description: 'Voice-activated desktop assistant built with JavaScript and Node.js. Uses AppleScript to automate OS-level tasks.',
      tags: ['JavaScript', 'Voice Control', 'Node.js'],
      link: 'https://github.com/Hugs-4-Bugs/Sharma-AI',
      image: 'project-sharma-ai',
    },
    {
      title: 'User Details App',
      description: 'Spring Boot app for managing user data with REST API. Supports CRUD operations and MySQL integration.',
      tags: ['Spring Boot', 'MySQL', 'REST API'],
      link: 'https://github.com/Hugs-4-Bugs/User-Details-App',
      image: 'project-user-details',
    },
    {
      title: 'SpringBoot OpenAI Integration',
      description: 'Integrates OpenAI into a Spring Boot backend to enable AI-powered text generation, response crafting, and content creation.',
      tags: ['Spring Boot', 'OpenAI', 'REST API'],
      link: 'https://github.com/Hugs-4-Bugs/SpringBoot-OpenAI',
      image: 'project-springboot-openai',
    },
    {
      title: 'Mobile Banking App',
      description: 'Spring Boot application providing mobile banking services like transactions, fund transfers, and account management.',
      tags: ['Spring Boot', 'Banking', 'MySQL'],
      link: 'https://github.com/Hugs-4-Bugs/Mobile-Banking',
      image: 'project-mobile-banking',
    },
    {
      title: 'Uber Application',
      description: 'A ride-hailing platform with real-time ride tracking, driver management, and fare estimation. Built with Spring Boot.',
      tags: ['Spring Boot', 'Maps API', 'E-commerce'],
      link: 'https://github.com/Hugs-4-Bugs/Uber-Application',
      image: 'project-uber-app',
    },
    {
      title: 'Cafe Management System',
      description: 'Spring Boot-based system for handling cafe operations like order processing, billing, and menu updates.',
      tags: ['Spring Boot', 'Cafe App', 'MySQL'],
      link: 'https://github.com/Hugs-4-Bugs/Cafe-Management-System',
      image: 'project-cafe-management',
    },
    {
      title: 'Ollama AI + Spring Boot',
      description: 'Spring Boot integration with Ollama AI using Spring AI and Flux to deliver both synchronous and streaming AI responses.',
      tags: ['Spring Boot', 'Ollama', 'Spring AI', 'LLMs'],
      link: 'https://github.com/Hugs-4-Bugs/Ollama-Spring-Boot-AI-Implementation',
      image: 'project-ollama-springboot',
    },
    {
      title: 'LinkedIn Clone Application',
      description: 'A microservice-based LinkedIn clone with features like connections, posts, notifications, and user profiles.',
      tags: ['Spring Boot', 'Microservices', 'API Gateway', 'Eureka'],
      link: 'https://github.com/Hugs-4-Bugs/LinkedIn-Application',
      image: 'project-linkedin-app',
    }
  ] as Project[],

  projectFilters: [
    { label: 'All', value: 'All' },
    { label: 'AI', value: 'AI' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Web Development', value: 'Web Development' },
    { label: 'E-commerce', value: 'E-commerce' },
    { label: 'Web', value: 'Web' },
    { label: 'Utility', value: 'Utility' },
    { label: 'Resources', value: 'Resources' },
    { label: 'API', value: 'API' },
    { label: 'Educational', value: 'Educational' },
    { label: 'Business', value: 'Business' },
    { label: 'Social', value: 'Social' },
  ] as ProjectFilter[],

  skills: [
    {
      category: "Frontend",
      icon: ScreenShare,
      skills: ["React (Basic)", "HTML", "CSS", "Tailwind CSS", "Angular (Basic)", "Framer Motion"]
    },
    {
      category: "Backend",
      icon: Server,
      skills: ["Spring Boot", "Node.js", "REST API", "Java", "Spring MVC", "Spring Security", "Spring Cloud", "Spring AI", "Hibernate ORM"]
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      skills: ["AWS", "Firebase", "Docker", "Kubernetes", "Jenkins", "Git", "JIRA", "Agile", "SDLC"]
    },
    {
      category: "Databases",
      icon: Database,
      skills: ["MySQL", "MongoDB", "PostgreSQL", "RDS", "DynamoDB"]
    },
    {
      category: "AI & Machine Learning",
      icon: BrainCircuit,
      skills: ["Machine Learning", "Artificial Intelligence", "Algorithmic Trading", "AI/ML APIs"]
    },
    {
      category: "Design",
      icon: Palette,
      skills: ["Figma", "Adobe XD", "UI/UX"]
    },
    {
      category: "Problem Solving",
      icon: Terminal,
      skills: ["Data Structures", "Algorithms", "Competitive Coding", "System Design"]
    },
    {
      category: "Trading",
      icon: TrendingUp,
      skills: ["Technical Analysis", "Market Psychology", "Backtesting", "Smart Money Concepts", "Order Blocks"]
    },
    {
      category: "Creative",
      icon: PenTool,
      skills: ["Writing", "Creative Writing", "Research", "Self-Help", "Motivation"]
    },
  ] as SkillCategory[],

  techStack: [
    {
      category: "Programming Languages & Problem Solving",
      tools: [
        { name: "Java", description: "Core backend programming" },
        { name: "SQL", description: "Structured Query Language" },
        { name: "Data Structures & Algorithms", description: "Problem-solving logic" },
        { name: "Competitive Coding", description: "Code optimization skills" }
      ]
    },
    {
      category: "Java Frameworks & Libraries",
      tools: [
        { name: "Spring Boot", description: "Java backend framework" },
        { name: "Spring MVC", description: "Model View Controller architecture" },
        { name: "Spring Security", description: "Security for Java applications" },
        { name: "Spring Cloud", description: "Microservices & distributed systems" },
        { name: "Spring AI", description: "AI integration with Spring" },
        { name: "Apache POI", description: "Java API for Microsoft documents" },
        { name: "ORM", description: "Object Relational Mapping" }
      ]
    },
    {
      category: "Web Technologies",
      tools: [
        { name: "HTML", description: "Markup language for web" },
        { name: "CSS", description: "Style sheet language" },
        { name: "RESTful API", description: "Web service architecture" },
        { name: "JWT", description: "Authentication via JSON Web Tokens" }
      ]
    },
    {
      category: "Cloud Services - AWS",
      tools: [
        { name: "AWS", description: "Amazon Cloud Platform" },
        { name: "EC2", description: "Elastic Compute Cloud" },
        { name: "S3", description: "Simple Storage Service" },
        { name: "Lambda", description: "Serverless compute service" },
        { name: "RDS", description: "Managed Relational DB" },
        { name: "CloudFront", description: "Content Delivery Network" },
        { name: "IAM", description: "Access & Identity Management" },
        { name: "CloudWatch", description: "Monitoring & Logging" },
        { name: "Cognito", description: "Authentication & user pools" },
        { name: "DynamoDB", description: "NoSQL database" },
        { name: "SQS", description: "Message queueing service" },
        { name: "SNS", description: "Notification service" },
        { name: "VPC", description: "Virtual Private Cloud" }
      ]
    },
    {
      category: "Databases",
      tools: [
        { name: "MySQL", description: "Relational DBMS" },
        { name: "PostgreSQL", description: "Advanced open-source DB" },
        { name: "MongoDB", description: "NoSQL database" }
      ]
    },
    {
      category: "DevOps & Tools",
      tools: [
        { name: "Docker", description: "Container platform" },
        { name: "Kubernetes", description: "Container orchestration" },
        { name: "Jenkins", description: "CI/CD automation" },
        { name: "Postman", description: "API testing tool" },
        { name: "Git", description: "Version control system" },
        { name: "GitHub", description: "Code hosting platform" },
        { name: "JIRA", description: "Agile project management" },
        { name: "Agile", description: "Development methodology" },
        { name: "SDLC", description: "Software Development Life Cycle" }
      ]
    },
    {
      category: "Editors / IDEs",
      tools: [
        { name: "IntelliJ IDEA", description: "Java IDE" },
        { name: "Eclipse", description: "Java development environment" },
        { name: "Visual Studio Code", description: "Lightweight editor" },
        { name: "STS", description: "Spring Tool Suite" },
        { name: "MySQL Workbench", description: "DB visualization tool" }
      ]
    },
    {
      category: "Operating Systems",
      tools: [
        { name: "macOS", description: "Apple Operating System" },
        { name: "Windows", description: "Microsoft OS" },
        { name: "Linux", description: "Open-source OS" }
      ]
    },
    {
      category: "Frontend Tools",
      tools: [
        { name: "React (Basic)", description: "Frontend JavaScript library" },
        { name: "Tailwind CSS", description: "Utility-first CSS" },
        { name: "Framer Motion", description: "Animation library for React" },
        { name: "Angular (Basic)", description: "Frontend JavaScript framework" }
      ]
    },
    {
      category: "Design & UI/UX",
      tools: [
        { name: "Figma", description: "UI/UX design tool" },
        { name: "Adobe XD", description: "Design & prototyping tool" },
        { name: "UI/UX", description: "User experience & design" }
      ]
    },
    {
      category: "AI, ML, Automation",
      tools: [
        { name: "AI", description: "Artificial Intelligence development" },
        { name: "Machine Learning", description: "Intelligent systems" },
        { name: "Algorithmic Trading", description: "Automated trading strategies" },
        { name: "Trading Algorithms", description: "Automated trading systems" }
      ]
    },
    {
      category: "Testing & Documentation",
      tools: [
        { name: "JUnit", description: "Unit testing framework" },
        { name: "Mockito", description: "Mocking framework" },
        { name: "Swagger", description: "API documentation" }
      ]
    },
    {
      category: "Build & Dependency Management",
      tools: [
        { name: "Maven", description: "Build automation tool" },
        { name: "Gradle", description: "Build system for Java" }
      ]
    },
    {
      category: "Trading & Market Concepts",
      tools: [
        { name: "Supply & Demand", description: "Core market movement" },
        { name: "Order Blocks", description: "Institutional trading zones" },
        { name: "Fair Value Gap (FVG)", description: "Inefficiencies in price" },
        { name: "Support & Resistance", description: "Price action key levels" },
        { name: "Market Psychology", description: "Investor behavior insights" },
        { name: "Technical Analysis", description: "Stock pattern analysis" }
      ]
    },
    {
      category: "Personal & Creative",
      tools: [
        { name: "Writing", description: "Creative expression" },
        { name: "Research", description: "Knowledge discovery" },
        { name: "Self-Help", description: "Personal development" },
        { name: "Motivation", description: "Inspiring others" }
      ]
    }
  ]
};
