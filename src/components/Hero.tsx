import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { resumeData } from '../data/resume';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1758598307046-22f11e2a6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzY4ODM2MTk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Background"
          className="w-full h-full object-cover opacity-10 dark:opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-block">
            <p className="text-sm text-muted-foreground mb-2">Hello, I'm</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {resumeData.personalInfo.name}
            </h1>
          </div>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {resumeData.personalInfo.headline}
          </p>

          <p className="text-lg text-muted-foreground">
            {resumeData.personalInfo.location} • {resumeData.personalInfo.phone}
          </p>

          <div className="text-base sm:text-lg text-foreground/90 max-w-2xl mx-auto pt-4 space-y-4">
            <p>
              I am a Computer Science student at Kennesaw State University with a strong foundation in software engineering, data structures, and algorithms.
            </p>
            <p>
              My experience spans full-stack development, AI-powered automation, and cloud systems. I am passionate about building scalable solutions and leveraging AI to solve complex problems.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="min-w-[160px]"
            >
              View Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="min-w-[160px]"
            >
              Contact Me
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-8">
            <a
              href={resumeData.personalInfo.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href={resumeData.personalInfo.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href={`mailto:${resumeData.personalInfo.email}`}
              className="p-2 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>

        <button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </button>
      </div>
    </section>
  );
}
