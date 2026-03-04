export type CourseworkCategory = {
  title: string;
  courses: string[];
  learned?: string;
};

export const courseworkCategories: CourseworkCategory[] = [
  {
    title: 'Core Programming & Foundations',
    courses: [
      'Programming Problem Solving I',
      'Programming Problem Solving II',
      'Data Structures',
      'Algorithm Analysis',
      'Concepts of Programming Languages',
      'Discrete Mathematics',
    ],
    learned: 'Built strong foundations in programming, algorithmic thinking, and computational problem solving.',
  },
  {
    title: 'Systems & Computer Architecture',
    courses: [
      'Computer Organization & Architecture',
      'Operating Systems',
      'Parallel & Distributed Computing',
      'Fundamentals of Data Communications',
    ],
    learned: 'Studied how computer systems operate at the hardware, operating system, and distributed system levels.',
  },
  {
    title: 'AI / Machine Intelligence',
    courses: [
      'Artificial Intelligence',
      'Linear Algebra I',
      'Probability & Data Analysis',
    ],
    learned: 'Applied mathematical and computational techniques for building intelligent and data-driven systems.',
  },
  {
    title: 'Databases & Data',
    courses: [
      'Intro to Database Systems',
    ],
    learned: 'Learned data modeling, querying, and analytical reasoning for software systems.',
  },
  {
    title: 'Software Engineering',
    courses: [
      'Intro to Software Engineering',
      'Software Architecture & Design',
      'Software Testing & QA',
      'Technical Writing',
      'Professional Practices & Ethics',
    ],
    learned: 'Focused on scalable system design, testing methodologies, documentation, and professional development practices.',
  },
  {
    title: 'Cloud & Modern Development',
    courses: [
      'Cloud Software Development',
    ],
    learned: 'Learned modern cloud architectures, scalable services, and distributed computing systems.',
  },
];
