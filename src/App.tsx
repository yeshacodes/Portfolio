import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Building } from './components/Building';
import { OutsideOfCode } from './components/OutsideOfCode';
import { Projects } from './components/Projects';
import { Now } from './components/Now';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="ed-page">
      <Navigation />
      <main>
        <Hero />
        <Building />
        <OutsideOfCode />
        <Projects />
        <Now />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
