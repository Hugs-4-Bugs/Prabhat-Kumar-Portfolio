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
  description: "Hi! I'm Prabhat Kumar, a passionate developer fascinated by AI, web technologies, and building software that solves real-world problems.",
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
    instagram: "https://www.instagram.com/_s_4_sharma/",
    twitter: "https://x.com/kattyPrabhat",
    naukri: "https://www.naukri.com/mnjuser/profile?id=&altresid",
    stackoverflow: "https://stackoverflow.com/users/19520484/prabhat-kumar",
    hackerrank: "https://www.hackerrank.com/profile/Prabhat_7250",
    leetcode: "https://leetcode.com/u/Hugs-2-Bugs/",
    youtube: "https://youtube.com/@Hugs-4-Bugs",
    gfg: 'https://www.geeksforgeeks.org/user/stealthy_prabhat/'
  },
  
  allSocials: [
    { name: "GitHub", icon: Github, url: "https://github.com/Hugs-4-Bugs" },
    { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/prabhat-kumar-6963661a4/" },
    { name: "Twitter", icon: Twitter, url: "https://x.com/kattyPrabhat" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/_s_4_sharma/" },
    { name: "StackOverflow", icon: Layers, url: "https://stackoverflow.com/users/19520484/prabhat-kumar" },
    { name: "Naukri", icon: Briefcase, url: "https://www.naukri.com/mnjuser/profile?id=&altresid" },
    { name: "HackerRank", icon: Code, url: "https://www.hackerrank.com/profile/Prabhat_7250" },
    { name: "LeetCode", icon: ListCheck, url: "https://leetcode.com/u/Hugs-2-Bugs/" },
    { name: "GeeksforGeeks", icon: ListChecks, url: "https://www.geeksforgeeks.org/user/stealthy_prabhat/" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@Hugs-4-Bugs" },
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
    { icon: ScreenShare, title: "Web Application Development", description: "End-to-end responsive and performant modern web apps." },
    { icon: Server, title: "API Design & Integration", description: "RESTful APIs and backend microservices for your apps." },
    { icon: BrainCircuit, title: "AI/ML Implementation", description: "Machine learning models integrated into practical applications." },
    { icon: Palette, title: "UI/UX Design", description: "Beautiful, intuitive, and modern user experiences." },
    { icon: Cpu, title: "Java Software Development", description: "Expert Java Developer skilled in Spring Boot, Hibernate, JSP, Microservices, and database management." },
    { icon: TrendingUp, title: "Strategic Trading Solutions", description: "4+ years in Stock, Future & Option, Crypto, and Forex trading. Offering tailored strategies and insights." },
    { icon: Cloud, title: "Cloud Infrastructure & DevOps", description: "I architect and manage cloud-native solutions with AWS, focusing on scalability, security, and automation." },
    { icon: Bot, title: "System Architecture & Automation", description: "Specialized in designing end-to-end system architectures and automating complex workflows." },
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
      name: 'Cryptocurrency Price Prediction',
      description: 'A machine learning-based app that predicts Bitcoin prices using historical data. Demonstrates data preprocessing, model training, and performance evaluation in a real-world finance use case.',
      tags: ['Python', 'Machine Learning', 'Pandas', 'Matplotlib', 'Finance', 'AI'],
      link: 'https://github.com/Hugs-4-Bugs/Cryptocurrency-Price-prediction-using-ML',
      image: '/images/cryptoprice.png',
      imageAiHint: 'cryptocurrency prediction graph'
    },
    {
      name: 'QuantumFusion Solutions',
      description: 'Official website of QuantumFusion Solutions — an innovative tech company shaping the future through AI, cloud computing, automation, and open-source development. Showcases services, projects, and the company’s mission to empower digital transformation.',
      tags: ['Next.js', 'Vercel', 'Tailwind CSS', 'Company Portfolio', 'Web', 'Business'],
      link: 'https://quantumfusion-solutions.vercel.app/',
      image: '/images/quantumfusionsolution.png',
      imageAiHint: 'modern tech company website with futuristic UI'
    },
    {
      name: 'PrabhatVerse',
      description: 'A visionary personal universe crafted by Prabhat Kumar, featuring his projects, innovations, blogs, and creative works. PrabhatVerse acts as a digital portfolio, connecting all ventures from AI to cloud computing under a unified identity.',
      tags: ['Next.js', 'Portfolio', 'Creative Hub', 'Tailwind CSS', 'Web', 'Social'],
      link: 'https://prabhatverse.vercel.app/',
      image: '/images/prabhatverse.png',
      imageAiHint: 'personal portfolio website with futuristic and minimal UI'
    },    
    {
      name: 'ArticleHub Application',
      description: 'A full-stack content management platform where users can create, manage, and explore articles. Features include admin control, category management, user roles, and a clean, responsive UI. Built with Angular and integrated with a Node.js backend.',
      tags: ['Angular', 'Node.js', 'REST API', 'JWT Auth', 'Material UI', 'Web', 'API', 'Social'],
      link: 'https://github.com/Hugs-4-Bugs/ArticleHub-Application',
      image: '/images/articlehub.png',
      imageAiHint: 'dashboard view of article management application'
    },    
    {
      name: 'REST API CRUD Operation',
      description: 'A Spring Boot application implementing full CRUD functionality using RESTful APIs. Features Hibernate, JSP, and MySQL integration for robust backend operations.',
      tags: ['Spring Boot', 'Hibernate', 'MySQL', 'JSP', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/REST-API-CRUD-Operation',
      image: '/images/RestAPI.png',
      imageAiHint: 'rest api crud operation backend'
    },
    {
      name: 'Flight Reservation System',
      description: 'A full-featured airline booking platform using Spring Boot and AngularJS. Supports flight search, booking, and check-in with secure authentication and role-based access.',
      tags: ['Spring Boot', 'AngularJS', 'Thymeleaf', 'MySQL', 'E-commerce', 'Business'],
      link: 'https://github.com/Hugs-4-Bugs/Flight_Reservation_Project',
      image: '/images/flight.png',
      imageAiHint: 'flight booking interface'
    },
    {
      name: 'Blog Application (Spring Boot)',
      description: 'A secure blog platform supporting JWT authentication, CRUD operations, and Postman testing. Built with Spring Boot and MySQL for backend robustness.',
      tags: ['Spring Boot', 'JWT', 'MySQL', 'Postman', 'API', 'Social'],
      link: 'https://github.com/Hugs-4-Bugs/Blog_Application-SpringBoot-Project',
      image: '/images/blogapp.png',
      imageAiHint: 'developer blog interface'
    },
    {
      name: 'Hospital Management System',
      description: 'A full-stack hospital management app with admin panels, report downloads, and service tracking. Uses Spring Boot, Thymeleaf, and Bootstrap for a responsive UI.',
      tags: ['Spring Boot', 'Thymeleaf', 'Bootstrap', 'MySQL', 'Business', 'Web'],
      link: 'https://github.com/Hugs-4-Bugs/Hospital-Managment-Application',
      image: '/images/hospital.png',
      imageAiHint: 'hospital dashboard interface'
    },
    {
      name: 'Bitcoin Mining Application',
      description: 'Spring Boot project simulating Bitcoin mining operations with account management, transactions, and audit logging. Integrates BitcoinJ and REST APIs.',
      tags: ['Spring Boot', 'BitcoinJ', 'MySQL', 'REST API', 'Finance', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/Bitcoin-Mining-App',
      image: '/images/bitcoinmining.png',
      imageAiHint: 'bitcoin mining dashboard'
    },
    {
      name: 'Multi File Upload System',
      description: 'Spring Boot REST API for uploading multiple files to the database using Spring Data JPA. Supports multipart handling and easy integration.',
      tags: ['Spring Boot', 'REST API', 'File Upload', 'Utility', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/MultiFileUpload-Using-Spring-Boot-Application',
      image: '/images/multifileupload.png',
      imageAiHint: 'file upload ui'
    },
    {
      name: 'QR Code Generator',
      description: 'Java-based QR code generator that accepts text input and outputs custom QR codes. Includes REST endpoints and Postman test support.',
      tags: ['Java', 'QR Code', 'Spring Boot', 'Utility', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/QR-code-Generator',
      image: '/images/qrcode.png',
      imageAiHint: 'qr code generator'
    },
    {
      name: 'Awesome Portfolio Collection',
      description: 'A curated collection of 100+ portfolio templates built using HTML, CSS, and JavaScript. Ideal for design inspiration and development practice.',
      tags: ['HTML', 'CSS', 'JavaScript', 'UI Design', 'Resources', 'Web'],
      link: 'https://github.com/Hugs-4-Bugs/Awesome-Portfolio-Collection',
      image: '/images/awesomeportfolio.png',
      imageAiHint: 'web developer portfolio gallery'
    },
    {
      name: 'GitHub Streak Back',
      description: 'Automates contributions to restore broken GitHub streaks using Node.js and Git. Ideal for devs who missed a commit.',
      tags: ['Node.js', 'Automation', 'Git', 'Utility'],
      link: 'https://github.com/Hugs-4-Bugs/github-streak-back.git',
      image: '/images/githubstreakback.png',
      imageAiHint: 'github contribution graph automation'
    },
    {
      name: 'AlgoByPrabhat',
      description: 'A learning platform for DSA concepts with visualizations. Helps learners understand algorithms via interactive examples.',
      tags: ['JavaScript', 'Algorithms', 'Data Structures', 'Educational'],
      link: 'https://github.com/Hugs-4-Bugs/AlgoByPrabhat.git',
      image: '/images/algobyprabhat.png',
      imageAiHint: 'algorithm visualizer interface'
    },
    {
      name: 'Sharma AI Assistant',
      description: 'Voice-activated desktop assistant built with JavaScript and Node.js. Uses AppleScript to automate OS-level tasks.',
      tags: ['JavaScript', 'Voice Control', 'Node.js', 'AI', 'Utility'],
      link: 'https://github.com/Hugs-4-Bugs/Sharma-AI.git',
      image: '/images/sharmaAI.png',
      imageAiHint: 'voice assistant interface'
    },
    {
      name: 'User Details App',
      description: 'Spring Boot app for managing user data with REST API. Supports CRUD operations and MySQL integration.',
      tags: ['Spring Boot', 'MySQL', 'REST API', 'API', 'Business'],
      link: 'https://github.com/Hugs-4-Bugs/user-details-app.git',
      image: '/images/userdetailapp.png',
      imageAiHint: 'user profile management'
    },
    {
      name: 'SpringBoot OpenAI Integration',
      description: 'Integrates OpenAI into a Spring Boot backend to enable AI-powered text generation, response crafting, and content creation.',
      tags: ['Spring Boot', 'OpenAI', 'REST API', 'AI', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/SpringBoot-OpenAI',
      image: '/images/springopenai.png',
      imageAiHint: 'ai integration spring boot'
    },
    {
      name: 'Mobile Banking App',
      description: 'Spring Boot application providing mobile banking services like transactions, fund transfers, and account management.',
      tags: ['Spring Boot', 'Banking', 'MySQL', 'Finance', 'Business'],
      link: 'https://github.com/Hugs-4-Bugs/Mobile-Banking-System-Project',
      image: '/images/mobilebanking.png',
      imageAiHint: 'mobile banking interface'
    },
    {
      name: 'Uber Application',
      description: 'A ride-hailing platform with real-time ride tracking, driver management, and fare estimation. Built with Spring Boot.',
      tags: ['Spring Boot', 'Maps API', 'E-commerce', 'Business'],
      link: 'https://github.com/Hugs-4-Bugs/Uber-Application.git',
      image: '/images/uberapp.png',
      imageAiHint: 'uber clone interface'
    },
    {
      name: 'Cafe Management System',
      description: 'Spring Boot-based system for handling cafe operations like order processing, billing, and menu updates.',
      tags: ['Spring Boot', 'Cafe App', 'MySQL', 'E-commerce', 'Business'],
      link: 'https://github.com/Hugs-4-Bugs/Cafe-Management-System.git',
      image: '/images/cafemanagement.png',
      imageAiHint: 'cafe billing interface'
    },
    {
      name: 'Ollama AI + Spring Boot',
      description: 'Spring Boot integration with Ollama AI using Spring AI and Flux to deliver both synchronous and streaming AI responses.',
      tags: ['Spring Boot', 'Ollama', 'Spring AI', 'LLMs', 'AI', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/Ollama-Spring-Boot-AI-Implementation.git',
      image: '/images/ollamaspring.png',
      imageAiHint: 'spring ai ollama chatbot'
    },
    {
      name: 'LinkedIn Clone Application',
      description: 'A microservice-based LinkedIn clone with features like connections, posts, notifications, and user profiles.',
      tags: ['Spring Boot', 'Microservices', 'API Gateway', 'Eureka', 'Social', 'API'],
      link: 'https://github.com/Hugs-4-Bugs/LinkedIn-Application.git',
      image: '/images/linkedinapp.png',
      imageAiHint: 'linkedin clone ui'
    }
  ] as Project[],

  projectFilters: [
    { label: 'All', value: 'All' },
    { label: 'AI', value: 'AI' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Web Development', value: 'Web' },
    { label: 'E-commerce', value: 'E-commerce' },
    { label: 'Utility', value: 'Utility' },
    { label: 'Resources', value: 'Resources' },
    { label: 'API', value: 'API' },
    { label: 'Educational', value: 'Educational' },
    { label: 'Business', value: 'Business' },
    { label: 'Social', value: 'Social' },
  ] as ProjectFilter[],

  skills: [
    {
      category: "Languages",
      icon: CodeXml,
      skills: ["Java", "JavaScript", "HTML/CSS", "Node.js", "TypeScript", "SQL"]
    },
    {
      category: "Java & Spring",
      icon: Server,
      skills: ["Spring Boot", "Spring Security", "Spring Cloud", "Spring AI", "Hibernate", "JWT", "REST API", "Spring MVC"]
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      skills: ["AWS EC2", "S3", "Lambda", "RDS", "VPC", "CloudFront", "CloudWatch", "IAM", "SQS", "SNS", "ELB", "CI/CD", "Jenkins", "Docker"]
    },
    {
      category: "Databases",
      icon: Database,
      skills: ["MySQL", "MongoDB", "PostgreSQL", "RDS", "DynamoDB", "ORM"]
    },
    {
      category: "AI & ML",
      icon: BrainCircuit,
      skills: ["OpenAI API", "Ollama", "AI Streaming", "Chatbots", "Voicebots", "ML Price Prediction", "Algo Trading"]
    },
    {
      category: "Frontend",
      icon: ScreenShare,
      skills: ["React", "Next.js", "Angular", "Redux", "Framer Motion", "Tailwind CSS", "Terminal UI"]
    },
     {
      category: "Problem Solving",
      icon: Terminal,
      skills: ["Data Structures", "Algorithms", "System Design", "UML/ER Diagrams", "Custom Exception Handling"]
    },
    {
      category: "Trading",
      icon: TrendingUp,
      skills: ["Mirror Market", "Supply & Demand", "Order Blocks", "FVG", "Liquidity Traps", "Technical Analysis"]
    },
  ] as SkillCategory[],

  techStack: [
    {
      category: "Languages & Databases",
      tools: [
        { name: "Java", description: "Core language for backend development" },
        { name: "JavaScript/TypeScript", description: "For frontend and Node.js applications" },
        { name: "SQL", description: "For relational database management" },
        { name: "MySQL / PostgreSQL", description: "Relational database systems" },
        { name: "MongoDB", description: "NoSQL document-oriented database" },
      ]
    },
    {
      category: "Backend Frameworks",
      tools: [
        { name: "Spring Boot", description: "Primary framework for building microservices and REST APIs" },
        { name: "Spring Security / JWT", description: "For robust authentication and authorization" },
        { name: "Spring Cloud", description: "For building resilient microservice architectures" },
        { name: "Hibernate / JPA", description: "For object-relational mapping and data persistence" },
        { name: "Node.js", description: "For building scalable network applications" },
      ]
    },
    {
      category: "Frontend Development",
      tools: [
        { name: "React / Next.js", description: "For building dynamic user interfaces and server-side rendering" },
        { name: "Angular", description: "A platform for building mobile and desktop web applications" },
        { name: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development" },
        { name: "Framer Motion", description: "For creating fluid animations in React" },
        { name: "HTML/CSS", description: "The building blocks of the web" },
      ]
    },
    {
      category: "AI & Machine Learning",
      tools: [
        { name: "Spring AI", description: "For integrating AI capabilities into Spring applications" },
        { name: "Ollama", description: "For running large language models locally" },
        { name: "OpenAI API", description: "For leveraging advanced AI models like GPT" },
        { name: "WebFlux", description: "For building reactive, non-blocking applications like AI streaming" },
        { name: "Scikit-learn / Pandas", description: "For machine learning and data analysis in Python" },
      ]
    },
     {
      category: "Cloud (AWS) & DevOps",
      tools: [
        { name: "AWS", description: "Comprehensive suite of cloud services" },
        { name: "EC2 / S3 / Lambda / RDS", description: "Core AWS services for compute, storage, and databases" },
        { name: "Docker", description: "For containerizing applications" },
        { name: "Jenkins / GitHub Actions", description: "For CI/CD and automating workflows" },
        { name: "Git", description: "Distributed version control system" },
      ]
    },
     {
      category: "Development Tools",
      tools: [
        { name: "Postman / Swagger", description: "For API design, testing, and documentation" },
        { name: "IntelliJ IDEA / VS Code", description: "Primary IDEs for development" },
        { name: "Maven", description: "For project build and dependency management" },
        { name: "JIRA", description: "For agile project management" },
      ]
    },
  ] as TechCategory[],
};

    