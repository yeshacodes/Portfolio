import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Coursework } from './components/Coursework';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Coursework />
        <Projects />
        <Experience />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
