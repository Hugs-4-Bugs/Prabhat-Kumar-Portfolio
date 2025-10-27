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
    twitter: "https://x.com/kattyPrabhat",
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
    { name: "Dev.to", icon: CodeXml, url: "https://dev.to/hugs-4-bugs" },
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
      title: "Cryptocurrency Price prediction using Machine Learning",
      description: "This program helps in forecasting cryptocurrency prices. In an effort to more accurately predict bitcoin prices quantitatively. It involves training a machine learning model to predict future prices of bitcoin based on historical data. It requires skills in data analysis, machine learning, and programming, and demonstrates expertise in these areas. This is a longer description to test the scrolling functionality within the card.",
      link: "https://github.com/Hugs-4-Bugs/Cryptocurrency-Price-prediction-using-Machine-Learning",
      tags: ["AI", "Finance"],
      image: "project-crypto-prediction"
    },
    {
      title: "REST-API-CRUD-Operation",
      description: "The 'REST-API-CRUD-Operation' project is a Java-based application using Hibernate, Spring Boot, Maven, JSP, and Servlets. It enables efficient Create, Read, Update, and Delete (CRUD) operations, ensuring seamless data management and robust RESTful API interaction with the database.",
      link: "https://github.com/Hugs-4-Bugs/REST-API-CRUD-Operation",
      tags: ["API", "Web", "Business"],
      image: "project-rest-api"
    },
    {
      title: "Flight Reservation Project",
      description: "Designed and implemented a comprehensive airline E-commerce website using Java Spring Boot, MySQL, AngularJS, and Thymeleaf. Integrated secure user authentication, flight search, booking, and check-in functionalities, incorporating REST APIs and role-based access control. Employed Spring Data JPA for seamless database interaction and implemented robust logging features.",
      link: "https://github.com/Hugs-4-Bugs/Flight-Reservation-Project",
      tags: ["E-commerce", "Web"],
      image: "project-flight-reservation"
    },
    {
      title: "Blog Application - SpringBoot Project",
      description: "I developed a secure blogging application using Spring Security for user authentication and authorization. Leveraging Spring Boot, Maven, and Postman, the app supports CRUD operations for blog posts. Users can generate authentication tokens, access endpoints securely, and perform actions such as creating, updating, and deleting posts. This description is also a bit longer to see the scrolling.",
      link: "https://github.com/Hugs-4-Bugs/Blog_Application-SpringBoot-Project",
      tags: ["Web", "API", "Social"],
      image: "project-blog-app"
    },
    {
      title: "Hospital Management Application",
      description: "Hospital Management Application with HTML, CSS, Bootstrap, and Spring Thymeleaf for frontend, and MySQL, Spring Boot, and Hibernate for backend. Features CRUD operations, contact service, service sections, downloadable reports, and REST API endpoints. Demonstrates proficiency in full-stack development and user-friendly interface design.",
      link: "https://github.com/Hugs-4-Bugs/Hospital-Management-Application",
      tags: ["Web", "Business"],
      image: "project-hospital-management"
    },
    {
      title: "Bitcoin Mining Application",
      description: "Java Spring Boot app with HTML and CSS for user interaction. Enables Bitcoin mining, user account management, transaction history viewing, configuration settings, logging, and audit trails. Features RESTful API endpoints and controllers. Dependencies: Spring Boot, BitcoinJ, MySQL Connector/J, Spring Boot Starter Test, and Spring Boot DevTools.",
      link: "https://github.com/Hugs-4-Bugs/Bitcoin-Mining-Application",
      tags: ["Finance", "API"],
      image: "project-bitcoin-mining"
    },
    {
      title: "Multiple File Upload Using Spring Boot",
      description: "MultiFileUpload-Using-Spring-Boot-Application is a Spring Boot project facilitating multiple file uploads into a database via a RESTful API. It showcases multipart file handling and storage with Spring Data JPA. Simply clone the repository, build, and run the application to upload files via POST request.",
      link: "https://github.com/Hugs-4-Bugs/MultiFileUpload-Using-Spring-Boot-Application",
      tags: ["Utility", "API"],
      image: "project-file-upload"
    },
    {
      title: "QR-code-Generator",
      description: "'QR-code-Generator' is a Java project for creating unique QR codes for various inputs. It's scalable and customizable, supporting different sizes and error correction levels. Clone the repository, compile, and run using a Java IDE. Test input data via Postman at http://localhost:8100/qr/qrcode/{Your Input}.",
      link: "https://github.com/Hugs-4-Bugs/QR-code-Generator",
      tags: ["Utility"],
      image: "project-qr-generator"
    },
    {
      title: "Awesome-Portfolio-Collection",
      description: "'Awesome-Portfolio-Collection' is a comprehensive repository housing a vast array of over 100 portfolio collections. Each portfolio is crafted using HTML, CSS, JavaScript, and other technologies, offering a rich diversity of designs and functionalities. Explore and gain inspiration from a wide range of professional and creative portfolio examples.",
      link: "https://github.com/Hugs-4-Bugs/Awesome-Portfolio-Collection",
      tags: ["Resources", "Web Development"],
      image: "project-portfolio-collection"
    },
    {
      title: "GitHub-Streak-Back",
      description: "GitHub-Streak-Back is a tool that helps restore broken GitHub streaks effortlessly. It automates contributions using Node.js and Git commands, ensuring your streak remains intact. Ideal for developers who accidentally missed a commit and want to maintain their streak history.",
      link: "https://github.com/Hugs-4-Bugs/GitHub-Streak-Back",
      tags: ["Utility", "Web Development"],
      image: "project-github-streak"
    },
    {
      title: "AlgoByPrabhat",
      description: "AlgoByPrabhat is a platform designed to simplify learning complex data structures and algorithms through interactive and engaging visualizations. Whether you're a student, coding enthusiast, or preparing for technical interviews, this platform provides a hands-on approach to mastering key algorithmic concepts.",
      link: "https://github.com/Hugs-4-Bugs/AlgoByPrabhat",
      tags: ["Educational", "Web Development"],
      image: "project-algobyprabhat"
    },
    {
      title: "Sharma AI",
      description: "Sharma AI is a voice-activated virtual assistant that allows users to interact with their computer using voice commands. Built with HTML, CSS, and JavaScript for the frontend, and Node.js with AppleScript for backend tasks, Sharma AI enables seamless application control and automation through voice interactions.",
      link: "https://github.com/Hugs-4-Bugs/Sharma-AI",
      tags: ["AI", "Utility"],
      image: "project-sharma-ai"
    },
    {
      title: "User Details App",
      description: "The User Details App is a Spring Boot-based CRUD application that allows users to manage personal information, including adding, viewing, updating, and deleting entries. It features a clean REST API with validation and MySQL integration for data storage.",
      link: "https://github.com/Hugs-4-Bugs/User-Details-App",
      tags: ["Business", "API"],
      image: "project-user-details"
    },
    {
      title: "SpringBoot-OpenAI",
      description: "SpringBoot-OpenAI is a Spring Boot-based API integration with OpenAI, allowing seamless interaction with AI models for generating responses, text processing, and more. It serves as an example for integrating AI-driven capabilities into Java applications.",
      link: "https://github.com/Hugs-4-Bugs/SpringBoot-OpenAI",
      tags: ["AI", "API"],
      image: "project-springboot-openai"
    },
    {
      title: "Mobile Banking",
      description: "Mobile Banking is a Spring Boot application designed to provide banking services such as account management, transactions, and secure fund transfers. It ensures high security and scalability while offering seamless integration with financial systems.",
      link: "https://github.com/Hugs-4-Bugs/Mobile-Banking",
      tags: ["Finance", "Business"],
      image: "project-mobile-banking"
    },
    {
      title: "Uber Application",
      description: "Uber Application is a Spring Boot-based ride-hailing platform that allows users to book rides, track drivers, estimate fares, and make secure payments. It ensures real-time ride management and seamless integration with mapping and payment systems.",
      link: "https://github.com/Hugs-4-Bugs/Uber-Application",
      tags: ["Business", "Web"],
      image: "project-uber-app"
    },
    {
      title: "Cafe Management System",
      description: "Cafe Management System is a Spring Boot application designed to streamline cafe operations, including order management, menu customization, billing, and customer management. It ensures efficiency and enhances the overall cafe experience through automation and easy tracking.",
      link: "https://github.com/Hugs-4-Bugs/Cafe-Management-System",
      tags: ["Business", "Web"],
      image: "project-cafe-management"
    },
    {
      title: "Ollama Spring Boot AI Implementation",
      description: "Ollama Spring Boot AI Implementation integrates Spring Boot with Ollama AI models to provide AI-powered responses using Spring AI and Flux. It supports synchronous and streaming AI responses using models like DeepSeek R1, ensuring real-time, efficient AI interactions. This description is intentionally very long to demonstrate the scrolling functionality within the project card. It spans multiple lines and contains extra text to exceed the typical card height.",
      link: "https://github.com/Hugs-4-Bugs/Ollama-Spring-Boot-AI-Implementation",
      tags: ["AI", "API"],
      image: "project-ollama-springboot"
    },
    {
      title: "LinkedIn Application",
      description: "LinkedIn Application is a Spring Boot microservices-based project that replicates key features of LinkedIn, including user management, connections, posts, and notifications. It leverages Eureka for service discovery and API Gateway for seamless interaction between services.",
      link: "https://github.com/Hugs-4-Bugs/LinkedIn-Application",
      tags: ["Social", "Web", "API"],
      image: "project-linkedin-app"
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
  ] as TechCategory[]
};
