import { Download, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { resumeData } from '../data/resume';

export function Resume() {
  return (
    <section id="resume" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Resume</h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-primary/10 rounded-full">
                <FileText className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Download My Resume</h3>
                <p className="text-muted-foreground max-w-md">
                  Get a detailed overview of my education, skills, experience, and projects in PDF format.
                </p>
              </div>
              <Button asChild size="lg" className="gap-2">
                <a href={resumeData.personalInfo.resumePdf} download="Yesha Bhavsar Resume.pdf">
                  <Download className="h-5 w-5" />
                  Download Resume (PDF)
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
