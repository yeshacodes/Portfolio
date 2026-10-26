// PulseCheck, from Yesha's October 2026 résumé and github.com/yeshacodes/PulseCheck. Its wording is in copy.ts.
// The screenshot is the live demo's landing page (pulse-check-sigma-two.vercel.app), captured at 1440×725 @2x like the
// other project images; the repository has no screenshots of its own.
// Like CareGap, it lives beside the darkroom so the previous site's position-paired project lists are unchanged.

export const PULSECHECK = {
  title: 'PulseCheck',
  subtitle: 'Website and API uptime monitor',
  category: 'Full-Stack',
  techStack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vitest'],
  description: 'Website and API uptime monitor.',
  image: '/images/pulsecheck.png',
  link: { label: 'Live', url: 'https://pulse-check-sigma-two.vercel.app' },
  github: 'https://github.com/yeshacodes/PulseCheck',
} as const;
