import { useReveal } from '../hooks/useReveal';
import { resumeData } from '../data/resume';

export function Resume() {
  const ref = useReveal<HTMLDivElement>();
  const pdf = resumeData.personalInfo.resumePdf;

  return (
    <section id="resume" className="ed-section ed-section--linen">
      <div className="ed-wrap ed-resume" ref={ref}>
        <p className="ed-eyebrow ed-reveal">The full record</p>
        <h2 className="ed-h2 ed-reveal d1">Want the resume?</h2>
        <p className="ed-resume-p ed-reveal d2">
          Work history, projects, and the LexisNexis internship — all in one PDF.
        </p>
        <div className="ed-resume-actions ed-reveal d3">
          <a className="ed-btn ed-btn-dark" href={pdf} target="_blank" rel="noopener noreferrer">
            View resume <span className="ed-arrow">↗</span>
          </a>
          <a className="ed-btn ed-btn-ghost" href={pdf} download="Yesha_Bhavsar_Resume.pdf">
            Download PDF ↓
          </a>
        </div>
      </div>
    </section>
  );
}
