import { Heart } from 'lucide-react';
import { resumeData } from '../data/resume';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {resumeData.personalInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
