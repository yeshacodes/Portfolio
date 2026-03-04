import { GraduationCap, Brain, Code, Cloud, Globe, Cpu } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { resumeData } from '../data/resume';

export function About() {
  const interestIcons = [Brain, Code, Cloud, Globe, Cpu];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Bio */}
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">
              I am currently pursuing my Bachelor of Science in Computer Science at Kennesaw State University, where I have developed a strong foundation in core computer science concepts and modern software development practices.
            </p>
            <p className="text-lg leading-relaxed">
              Throughout my academic journey, I have worked on projects involving full-stack web development, AI-powered applications, and cloud-based systems. I enjoy designing software that is both scalable and user-focused, and I am particularly interested in areas such as artificial intelligence, web development, and cloud computing.
            </p>
            <p className="text-lg leading-relaxed">
              I am always eager to learn new technologies and apply them to real-world problems. My goal is to continue growing as a software engineer by building impactful systems, collaborating with talented teams, and contributing to innovative technology solutions.
            </p>
          </div>

          {/* Education & Interests */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Education</h3>
                    <p className="text-sm font-medium">
                      {resumeData.education[0].degree}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {resumeData.education[0].school}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expected Graduation: {resumeData.education[0].graduationDate}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      GPA: {resumeData.education[0].gpa}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Honors: {resumeData.education[0].honors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Areas of Interest</h3>
                <div className="grid grid-cols-1 gap-3">
                  {resumeData.skills.concepts.map((interest, index) => {
                    const Icon = interestIcons[index] ?? Code;

                    return (
                      <div key={interest} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm">{interest}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
