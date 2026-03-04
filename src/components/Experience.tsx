import { Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { resumeData } from '../data/resume';

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Professional and academic experiences that have shaped my technical expertise
          </p>
        </div>

        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {exp.role}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {exp.company} • {exp.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {exp.date}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="flex-1 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-muted rounded-md"
                    >
                      {tech}
                    </span>
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
