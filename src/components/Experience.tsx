import { useEffect, useRef } from 'react';
import { resumeData } from '../data/resume';

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll('.st-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const edu = resumeData.education[0];
  const exp = resumeData.experience[0];
  const certifications = resumeData.certifications;

  const skillGroups = [
    { label: 'Languages',              skills: resumeData.skills.languages },
    { label: 'Backend & APIs',         skills: resumeData.skills.backend },
    { label: 'Cloud & Databases',      skills: resumeData.skills.cloud },
    { label: 'AI & Data',              skills: resumeData.skills.ai },
    { label: 'Frontend',               skills: resumeData.skills.frontend },
    { label: 'DevOps & Observability', skills: resumeData.skills.devops },
    { label: 'Concepts',               skills: resumeData.skills.concepts },
  ];

  return (
    <section id="experience" ref={sectionRef} className="st-exp-section">
      <div className="st-wrap">
        <span className="st-label st-reveal">Background</span>
        <h2 className="st-h2 st-reveal d1" style={{ marginBottom: 0 }}>
          Experience & <em>Skills</em>
        </h2>

        <div className="st-exp-grid">

          {/* Left: timeline + education */}
          <div>
            <div className="st-tl-item st-reveal d2">
              <div className="st-tl-company">{exp.company}</div>
              <div className="st-tl-role">{exp.role}</div>
              <div className="st-tl-period">{exp.location} &nbsp;&middot;&nbsp; {exp.date}</div>
              <ul className="st-tl-bullets">
                {exp.description.map((item, i) => {
                  const parts = item.split(/(\~?\d+[\+%]?(?:\s*(?:pages?|endpoints?|workflows?|hours?|orders?\/sec|K\+))?)/g);
                  return (
                    <li key={i}>
                      {parts.map((part, j) =>
                        /\~?\d/.test(part)
                          ? <strong key={j}>{part}</strong>
                          : part
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="st-edu-card st-reveal d3">
              <div className="st-edu-school">{edu.school}</div>
              <div className="st-edu-degree">{edu.degree} &nbsp;&middot;&nbsp; {edu.graduationDate}</div>
              <span className="st-edu-badge">GPA {edu.gpa} &nbsp;&middot;&nbsp; {edu.honors}</span>
              <p className="st-edu-courses">{edu.coursework}</p>
              <div className="st-edu-certs">
                {certifications.map((cert) => (
                  <span key={cert.name} className="st-edu-badge">
                    {cert.name} &nbsp;&middot;&nbsp; {cert.issuer} &nbsp;&middot;&nbsp; {cert.date}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: skills */}
          <div className="st-reveal d2">
            {skillGroups.map((group) => (
              <div key={group.label} className="st-skill-group">
                <span className="st-skill-group-label">{group.label}</span>
                <div className="st-skill-tags">
                  {group.skills.map((skill) => (
                    <span key={skill} className="st-stag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
