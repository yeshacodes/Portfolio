import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { resumeData } from '../data/resume';

export function Skills() {
  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: resumeData.skills.languages,
    },
    {
      title: 'Backend & APIs',
      skills: resumeData.skills.backend,
    },
    {
      title: 'Cloud Platforms',
      skills: resumeData.skills.cloud,
    },
    {
      title: 'Data & Managed Services',
      skills: resumeData.skills.data,
    },
    {
      title: 'Systems, Testing & DevOps',
      skills: resumeData.skills.testingops,
    },
    {
      title: 'Frontend',
      skills: resumeData.skills.frontend,
    },
    {
      title: 'Core CS & Systems Concepts',
      skills: resumeData.skills.concepts,
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Technical Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit developed through coursework, personal projects, and hands-on experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
