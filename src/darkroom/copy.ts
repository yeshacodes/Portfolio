// The darkroom's words, written in Yesha's voice and checked against her sources: her résumé data and PDF, her site's
// existing copy, and each project's own repository (README, code, test results). Kept here rather than in
// src/data/resume.ts so the previous site keeps its own text.

export type Metric = { value: string; desc: string };
export type CaseCopy = {
  subtitle: string;
  what: string;            // what it does, in plain words
  idea: string;            // the goal, stated directly
  how: string[];           // how it works, one idea per paragraph
  results?: string;        // test conditions, when the figures need context
  metrics: Metric[];
  techStack?: string[];
  toolGroups?: [layer: string, tools: string][];   // shown in place of techStack when a project's tools sit in separate layers
};

// The hero says what I do; About says more about me without repeating it.
export const HERO_BIO = 'I’m a software engineer who enjoys solving problems and finding creative ways to build useful things.';

export const ABOUT_TITLE = 'A little about me';
export const ABOUT = [
  'I’m based in Atlanta and graduated from Kennesaw State University with a BS in Computer Science in May 2026.',
  'I’m currently interning at ElderFort, working with local AI models and document Q&A. Previously, at LexisNexis Risk Solutions, I worked on AI-assisted testing and backend workflows. My projects have given me room to explore web development, AI, and data analysis.',
  'Away from the keyboard, I like to paint, head out for a hike, or explore somewhere new, usually with a place to eat in mind.',
  'I’m currently open to full-time software engineering opportunities.',
];

export const CASES: Record<string, CaseCopy> = {
  // Repository: github.com/yeshacodes/Flowcommerce-ai (README, docs/architecture.md, load_tests/order_load_test.js).
  FlowCommerce: {
    subtitle: 'Order processing across event-driven services',
    what: 'The backend for an online store: seven Python services that pass each order along through Kafka events, from checkout through inventory, payment, and an email confirmation.',
    idea: 'Process orders reliably under load without losing or double-processing them, and undo the work cleanly when a payment fails.',
    how: [
      'Each FastAPI service owns one step and publishes what happened as an event. There’s no central coordinator: the services follow a saga by choreography, each reacting to the others’ events, while the order service keeps track of where every order is.',
      'When a payment fails, the order service asks inventory to release the stock it had reserved, and the order is marked as failed.',
      'The transactional outbox covers the sending side. Each event is written to PostgreSQL in the same transaction as the change that caused it, and a background poller publishes it to Kafka. That way, a crash between saving the change and publishing the event doesn’t drop the event: it’s still in the outbox, waiting to be sent.',
      'Idempotent consumers cover the receiving side. Kafka can deliver the same message more than once, so each service records the event ID before acting and skips anything it has already processed.',
      'Every service reports to Prometheus and Grafana, with correlation IDs that follow a single order across services. There’s also an admin operations console and an AI ops copilot for looking into incidents.',
    ],
    results: 'Load-tested with k6 against a local setup: 20 virtual users for 100 seconds, sending orders to the order endpoint. These figures cover order intake and persistence only, not end-to-end processing through inventory, payment, and email.',
    metrics: [
      { value: '173 orders/sec', desc: 'Orders accepted and written to the database with their outbox events, on a local setup.' },
      { value: '17,417 / 17,417', desc: 'Orders created vs. distinct order IDs in that run: no duplicate orders were recorded.' },
      { value: 'No overselling', desc: 'Verified: once stock runs out, checkout returns 409 instead of selling more.' },
    ],
  },
  // Résumé data, PDF, and github.com/yeshacodes/LearnBot-AI.
  LearnBot: {
    subtitle: 'A study assistant that answers from your own sources',
    what: 'A study tool that turns your PDFs and web pages into cited answers, quizzes, and flashcards.',
    idea: 'Study help that stays grounded in the material you upload, with a citation for every answer so you can check where it came from.',
    how: [
      'When you add a document, LearnBot splits it into overlapping 1,000-character chunks, turns each chunk into a Gemini embedding, and stores them in a FAISS index.',
      'For each question it pulls the 50 closest chunks, narrows them down to 6, and answers from those, citing where each part came from. The same sources feed the quizzes and flashcard decks.',
      'Behind it is a FastAPI backend. Each user’s vectors are kept separate, sign-in uses Supabase JWTs, and documents and data are split across S3, Supabase, and SQLite.',
    ],
    metrics: [
      { value: 'Under 10 ms', desc: 'p95 retrieval time, benchmarked over a 10,000-vector index.' },
      { value: '3,072-dim', desc: 'Gemini embeddings, indexed in FAISS.' },
      { value: '13 endpoints', desc: 'For ingestion, retrieval, chat, quizzes, and flashcards.' },
    ],
  },
  // Résumé data, PDF, and github.com/yeshacodes/ai-closet (README, package.json: Supabase, OpenAI).
  'AI Closet': {
    subtitle: 'Outfit suggestions from the clothes you own',
    what: 'An outfit-planning app that suggests combinations from clothes you already own, taking the weather and your preferences into account.',
    idea: 'Skip the tedious part: upload photos of your clothes without labeling each item by hand, and get outfits that suit the day.',
    how: [
      'OpenAI Vision reads each photo and fills in the item’s category, color, and style.',
      'A recommendation engine scores possible outfits on weighted features such as style coverage, color harmony, weather fit (from a weather API), and your feedback. Likes and dislikes adjust the scores, so suggestions change as you use it.',
      'Wardrobe and recommendation data live in Supabase, in relational tables with row-level security.',
    ],
    metrics: [
      { value: '12 weighted features', desc: 'Style, color, weather, and feedback signals.' },
      { value: '600', desc: 'Generated recommendations used for evaluation.' },
      { value: 'Auto-tagging', desc: 'Category, color, and style read from each photo.' },
    ],
    techStack: ['Next.js', 'TypeScript', 'OpenAI Vision', 'Supabase', 'Tailwind CSS'],
  },
  // Résumé (October 2026) and github.com/yeshacodes/PulseCheck: README, src/app/api (10 method handlers),
  // tests/ (32 Vitest tests), .github/workflows/cron.yml (every 10 minutes), src/lib/constants.ts (FAILURE_THRESHOLD = 2).
  PulseCheck: {
    subtitle: 'Uptime monitoring for websites and APIs',
    what: 'An uptime monitor for websites and APIs. It checks each endpoint on a schedule, records uptime, status codes, and response times, opens an incident when something keeps failing, and gives you a public status page to share.',
    idea: 'Know when a site or API is down, slow, or returning the wrong status, without raising an alarm for every one-off blip.',
    how: [
      'You add a website or API along with the status code you expect. A GitHub Actions workflow calls a protected endpoint every 10 minutes to check every monitor, and you can also run a check yourself.',
      'Each check records the status code and response time. Two failures in a row open an incident, and the next successful check resolves it.',
      'Because the server requests URLs that people type in, each one is checked first to guard against server-side request forgery. Only http and https are allowed. Local, private, and cloud-metadata addresses are blocked once the hostname is resolved, every redirect is checked again (up to three), and requests time out after at most 30 seconds.',
      'It’s built with Next.js and TypeScript on Supabase. Supabase Auth and PostgreSQL row-level security keep each person’s monitors and history private, and a status page shows only what’s been made public.',
    ],
    metrics: [
      { value: '10 API routes', desc: 'Counted per method, for monitors, checks, incidents, status pages, and the scheduled job.' },
      { value: '32 tests', desc: 'Vitest tests covering URL safety, checks, uptime math, and incident recovery.' },
      { value: 'Every 10 minutes', desc: 'Scheduled checks, run by GitHub Actions.' },
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Zod', 'Recharts', 'Tailwind CSS', 'Vitest', 'GitHub Actions'],
  },
  // Résumé data and github.com/yeshacodes/tickethub: the React app (src/) and the Supabase Edge Function
  // (supabase/functions/make-server-458470b3: Hono on Deno, 14 routes incl. /health and /test-email, Postgres
  // key-value table). Admin routes verify the Supabase session, then check the email against ADMIN_EMAILS.
  // The order route saves the order before sending the email, and a failed send doesn't fail the order.
  // api/send-confirmation.ts only sends a test email, so it isn't listed as a tool.
  'Ticket Management System': {
    subtitle: 'Ticket sales, entry checks, and admin tools',
    what: 'A ticketing site for shows: people buy tickets and get a confirmation email, and admins manage the shows, check tickets at entry, and follow sales.',
    idea: 'A ticketing flow where buying, checking in, and managing shows all work together, and a problem with the confirmation email doesn’t cost anyone their tickets.',
    how: [
      'The React front end handles browsing and checkout, and turns each ticket into a downloadable PDF with a QR code.',
      'The API runs as a Supabase Edge Function, with routes for the public, for signed-in users, and for admins. A purchase checks availability, then saves the order and a record for every ticket in Supabase’s Postgres database.',
      'Admin access comes from an email allowlist. For an admin route, the server first verifies the person’s Supabase session, then checks their email against a list of admin addresses kept in the function’s settings, and turns away anyone who isn’t on it.',
      'Admins can create, edit, and delete shows, including price and ticket counts. They can look up a ticket and mark it as used at entry, and see total revenue, bookings, and tickets sold.',
      'The confirmation email is sent through Resend only after the order is saved. If sending fails, the order still goes through, and the response reports the email’s status.',
    ],
    toolGroups: [
      ['Frontend', 'React, TypeScript, Vite, Tailwind CSS, Radix UI, qrcode, jsPDF'],
      ['Supabase Edge Function', 'Deno, Hono, supabase-js, Resend'],
      ['Database', 'Supabase Postgres (key-value table)'],
    ],
    metrics: [
      { value: '14 routes', desc: 'Across public, user, and admin access, including a health check and a test-email route.' },
      { value: 'Email allowlist', desc: 'Admin routes need a signed-in account whose email is on the admin list.' },
      { value: 'SPF · DKIM · DMARC', desc: 'Authenticated sending domain for confirmation emails.' },
    ],
  },
  // Résumé data and github.com/yeshacodes/Mindful-Journaling-App.
  'Mindful Journaling App': {
    subtitle: 'A journal with mood tracking and AI reflections',
    what: 'A journaling app where you write and tag entries, track your mood, look back on a calendar, and get optional AI prompts and reflections based on what you’ve written.',
    idea: 'Mood insights and AI reflections that come from your own entries, and hold back when there isn’t enough to go on yet.',
    how: [
      'It’s built with Next.js and Supabase (PostgreSQL), with email and Google sign-in.',
      'A mood-trend engine summarizes entries across several time windows in a single pass.',
      'OpenAI GPT-4.1-mini powers writing prompts, reflections, a chat that knows your entries, and mood insights. Until there are enough entries, it skips the AI mood analysis instead of drawing conclusions from too little.',
    ],
    metrics: [
      { value: '4 AI endpoints', desc: 'Prompts, reflections, chat, and mood insights.' },
      { value: '5 time windows', desc: 'Mood trends calculated in one pass.' },
      { value: 'Row-level security', desc: 'Each person’s entries are kept separate.' },
    ],
  },
};

// Her internships, most recent first. ElderFort is from her October 2026 résumé, kept to what its three points say:
// no metrics, deployment status, or business impact. LexisNexis is from her résumé data and PDF (the Spring Boot
// point is in the PDF).
export type Role = { role: string; company: string; location: string; dates: string; points: string[] };
export const EXPERIENCE: Role[] = [
  {
    role: 'Software Engineer Intern', company: 'ElderFort', location: 'Alpharetta, GA', dates: 'October 2026–Present',
    points: [
      'I set up a local AI stack with Docker, Ollama, AnythingLLM, and Flowise, and worked through the container, storage, and dependency issues that came up along the way.',
      'I built a document Q&A workflow: it ingests PDFs, splits them into chunks, creates embeddings locally, and uses vector search so each answer points back to the passages it came from.',
      'I benchmarked Llama 3.2 and Qwen 2.5 on accuracy, policy interpretation, and calculations, and traced their mistakes back to the passages they had retrieved.',
    ],
  },
  {
    role: 'Software Engineer Intern', company: 'LexisNexis Risk Solutions', location: 'Alpharetta, GA', dates: 'May–July 2025',
    points: [
      'I designed and integrated an AI-powered QA Copilot that generates test cases for backend workflows. Across the 8+ workflows it covered, test coverage rose by about 30% and time spent writing tests by hand fell by about 40%.',
      'I integrated the Copilot into an existing Spring Boot platform, working with the QA and engineering teams so the generated test cases matched how production workflows actually run.',
      'I built and ran automated REST API validation across 50+ endpoints in Postman, to catch configuration regressions in Jira-driven platform changes before release.',
      'I wrote 15+ pages of documentation, runbooks, and handoff guides so the QA and platform teams could run the Copilot on their own after my internship.',
      'Together, this work helped reduce defects introduced during configuration and deployment changes in customer-facing risk and compliance workflows.',
    ],
  },
];
