import { resumeData } from '../data/resume';

export function Footer() {
  const { email, links } = resumeData.personalInfo;

  return (
    <footer className="ed-footer">
      <div className="ed-footer-name">Yesha Bhavsar<span className="dot">.</span></div>
      <div className="ed-footer-links">
        <a className="ed-footer-link" href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="ed-footer-link" href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="ed-footer-link" href={`mailto:${email}`}>Email</a>
      </div>
      <div className="ed-footer-note">Designed &amp; built by me · {new Date().getFullYear()}</div>
    </footer>
  );
}
