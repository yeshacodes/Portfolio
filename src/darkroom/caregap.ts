// CareGap, from Yesha's own sources: the project README at github.com/yeshacodes/caregap-healthcare-analytics and
// the CareGap entry in her Portfolio repo's resume data. Nothing here is estimated or invented.
// It lives beside the darkroom (not in src/data/resume.ts) because the previous site pairs projects with fixed
// lists by position; adding a project there would shift that site's layout.

export const CAREGAP = {
  title: 'CareGap',
  subtitle: 'U.S. hospital access and quality analysis',
  category: 'Data analysis · Healthcare',
  techStack: ['Python', 'pandas', 'PostgreSQL', 'SQL', 'pgAdmin', 'Power BI', 'DAX'],
  description:
    'A look at where U.S. hospitals are, how they’re rated, and how many offer emergency care, built from public CMS data with Python, PostgreSQL, and Power BI.',
  image: '/images/caregap-dashboard.png',
  imageFocus: 'left top',
  link: { label: 'Read the analysis', url: 'https://github.com/yeshacodes/caregap-healthcare-analytics#readme' },
  github: 'https://github.com/yeshacodes/caregap-healthcare-analytics',
  analysis: {
    questions: [
      'Which states have the most hospitals?',
      'How do ratings compare across hospital types and ownership?',
      'How many hospitals actually have a rating?',
      'How widely available are emergency services?',
    ],
    source: 'The Hospital General Information dataset from the Centers for Medicare & Medicaid Services (CMS): one row per hospital, with location, type, ownership, emergency services, and an overall rating from 1 to 5.',
    pipeline: [
      { step: 'Clean', detail: 'With Python and pandas I kept the fields I needed, kept facility IDs and ZIP codes as text, turned unavailable ratings into blanks, and removed duplicate facility IDs.' },
      { step: 'Load', detail: 'Into a typed PostgreSQL table through pgAdmin.' },
      { step: 'Check', detail: 'SQL quality checks on state codes, ratings, emergency-service values, and hospital names, plus row and unique-ID counts.' },
      { step: 'Analyze', detail: 'SQL queries for counts and ratings by state, hospital type, and ownership, and for emergency-service availability.' },
      { step: 'Present', detail: 'A Power BI dashboard connected to PostgreSQL, with filters for state, type, and ownership.' },
    ],
    summary: [
      { value: '5,419', label: 'hospitals' },
      { value: '3,174', label: 'with a rating' },
      { value: '2,245', label: 'without a rating' },
      { value: '3.21', label: 'average rating' },
      { value: '82.9%', label: 'offer emergency services' },
    ],
    findings: [
      'Texas has the most hospitals, followed by California and Florida. These are raw counts, not hospitals per person, so they show where hospitals are, not how easy they are to reach.',
      'Among hospital types with ratings, Veterans Administration acute-care hospitals have the highest average rating.',
      'About 82.9% of hospitals offer emergency services.',
    ],
    limitations: 'Only 3,174 of the 5,419 hospitals (about 59%) have an overall rating, and some categories have just a few rated hospitals, so their averages should be read alongside how many hospitals they include. The counts also aren’t adjusted for population.',
    next: ['Hospitals per 100,000 residents', 'Access at the county level', 'Map views', 'Automated loading', 'Changes over time', 'More CMS quality and patient-experience data'],
  },
} as const;
