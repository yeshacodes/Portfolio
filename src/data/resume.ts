export const resumeData = {
  personalInfo: {
    name: "Yesha Bhavsar",
    headline: "Computer Science Student | Software Engineer | AI & Cloud",
    email: "yesha2903bhavsar@gmail.com",
    phone: "+1-470-549-1330",
    location: "Marietta, GA",
    links: {
      linkedin: "https://www.linkedin.com/in/yeshabhavsar/",
      github: "https://github.com/yeshacodes",
      portfolio: "https://portfolio-mu-five-e095u5sooi.vercel.app/",
    },
    // This should refer to a file in the public directory
    resumePdf: "/Yesha Bhavsar Resume.pdf",
    about: "I am a Computer Science student at Kennesaw State University with a strong foundation in software engineering, data structures, and algorithms. My experience spans full-stack development, AI-powered automation, and cloud systems. I am passionate about building scalable solutions and leveraging AI to solve complex problems, as demonstrated by my work on QA Copilots and recommendation systems.",
  },
  education: [
    {
      school: "Kennesaw State University",
      degree: "Bachelor of Science in Computer Science",
      gpa: "3.7/4.0",
      graduationDate: "May 2026",
      honors: "President’s List, Dean’s List, UPE Member",
      coursework:
        "Data Structures and Algorithm (DSA), Algorithm Analysis, Operating Systems, Database Management System (DBMS), Parallel & Distributed Computing, Software Architecture & Design, Cloud Software Development, Software Testing and QA, Artificial Intelligence (AI)",
    },
  ],
  skills: {
    languages: ["Java", "Python", "JavaScript", "C/C++", "SQL"],
    backend: ["Spring Boot", "FastAPI", "Node.js", "REST APIs"],
    cloud: ["AWS (EC2, S3, RDS, Lambda)"],
    data: ["Postgres", "Supabase", "Firebase Firestore", "SQLite", "FAISS"],
    testingops: [
      "CI/CD Pipelines",
      "Automated Testing",
      "Unit Testing",
      "Git",
      "Asynchronous Processing",
    ],
    frontend: ["React", "Typescript"],
    concepts: [
      "Artificial Intelligence",
      "Web Development",
      "Cloud Computing",
      "Distributed Systems",
      "System Design",
    ],
  },
  experience: [
    {
      company: "LexisNexis Risk Solutions",
      role: "Software Engineer Intern",
      location: "Alpharetta, GA",
      date: "May 2025 – Jul 2025",
      description: [
        "Owned design and integration of an AI-powered QA Copilot that automated test-case generation across 8+ backend workflows, increasing test coverage by ~30% and reducing manual test authoring time by ~40%.",
        "Built and executed automated REST API validation using Postman across 50+ endpoints, preventing configuration regressions and improving release confidence for Jira-driven platform changes.",
        "Partnered with software engineers, QA, and product managers to translate requirements into scalable automation solutions, accelerating test execution cycles from days to hours.",
        "Authored 15+ pages of technical documentation, runbooks, and handoff guides, enabling independent adoption and long-term ownership of the Copilot by QA and platform teams after internship completion.",
        "Improved overall platform reliability and release quality for customer-facing risk and compliance workflows by reducing defects introduced during configuration and deployment changes.",
      ],
      technologies: ["AI/ML", "REST API", "Postman", "QA Automation"],
    },
  ],
  projects: [
    {
      title: "AI Closet: Smart Outfit Recommendation System",
      techStack: ["OpenAI", "React", "Python", "Vision Model"], // Inferred from description
      description:
        "Designed and implemented a customer-facing recommendation system that classifies clothing images and generates personalized outfit suggestions based on user preferences, contextual inputs, and rule-based constraints. Integrated OpenAI’s multimodal vision model to extract semantic attributes (category, color, style) from uploaded clothing images, enabling automated image understanding without manual labeling.",
      link: {
        label: "Live",
        url: "https://ai-closet-pearl.vercel.app/",
      },
      github: "https://github.com/yeshacodes/ai-closet",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" // Placeholder image for closet/fashion
    },
    {
      title: "Ticket Management System",
      techStack: ["Full Stack", "Event-Driven", "Email APIs"], // Inferred
      description:
        "Designed and built a full-stack transactional system supporting ticket purchases, order confirmation, and customer-facing purchase workflows. Implemented event-driven backend processing to handle purchase events asynchronously and manage order state changes reliably. Integrated transactional email workflows with authenticated custom domains.",
      link: {
        label: "Live",
        url: "https://www.ticketmanagement.online/",
      },
      github: "https://github.com/yeshacodes/tickethub",
      image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2574&auto=format&fit=crop" // Placeholder for tickets
    },
    {
      title: "LearnBot: Retrieval-Augmented AI Learning Assistant",
      techStack: ["RAG", "FAISS", "SQLite", "REST API"],
      description:
        "Designed and built a backend service that ingests PDFs and web content, processes and chunks documents, and exposes semantic retrieval via RESTful APIs. Implemented a retrieval-augmented generation (RAG) pipeline using vector embeddings and FAISS to deliver accurate, context-aware responses.",
      link: {
        label: "Live",
        url: "https://learn-bot-ai.vercel.app",
      },
      github: "https://github.com/yeshacodes/LearnBot-AI",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2574&auto=format&fit=crop" // Placeholder for learning/books
    },
  ],
};
