import { BookOpen } from 'lucide-react';
import { courseworkCategories } from '../data/coursework';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function Coursework() {
  return (
    <section id="coursework" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Coursework</h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Selected academic coursework that reflects my preparation in software engineering,
            systems, data, and applied AI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courseworkCategories.map((category) => (
            <Card key={category.title} className="h-full border-border/60">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                {category.learned && (
                  <CardDescription>{category.learned}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2" aria-label={`${category.title} courses`}>
                  {category.courses.map((course) => (
                    <li key={course}>
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-normal">
                        {course}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
