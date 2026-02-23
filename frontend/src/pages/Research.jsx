import { useEffect } from "react";
import useContent from "../hooks/useContent";
import ProfileTabs from "../components/ProfileTabs";
import "./Home.css";
import "./Research.css";

const API_BASE = "";

function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

const Research = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
  }, []);

  if (loading) return <div className="loading-state">Loading…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.research) return <div>No data</div>;

  const { header, home, research } = content;
  const { interests, projects, phdStudents } = research;

  return (
    <div className="home-wrapper">

      {/* ── HERO ── */}
      <header className="academic-hero">
        <div className="wide-container">
          <div className="hero-top">
            <div className="hero-identity">
              <h1 className="hero-name">{header.name}</h1>
              <p className="hero-subname">{header.subname}</p>
              <span className="hero-designation">{header.designation}</span>
              <span className="hero-institute">{header.institute}</span>
            </div>
            <img className="iit-logo" src="/IITHLOGO1.png" alt="IIT Hyderabad" />
          </div>
          <div className="hero-nav"><ProfileTabs /></div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="page-body wide-container">

        {/* Sidebar */}
        <aside className="prof-sidebar">
          <div className="sidebar-section">
            <p className="sidebar-label">Contact</p>
            {home?.contact?.email && (
              <div className="contact-item">
                <div className="ci-icon">✉</div>
                <div className="ci-body">
                  <span className="ci-label">Email</span>
                  <span className="ci-value email">{home.contact.email}</span>
                </div>
              </div>
            )}
            {home?.contact?.webpage && (
              <a href={home.contact.webpage} target="_blank" rel="noreferrer" className="sidebar-btn">
                Visit Website ↗
              </a>
            )}
          </div>
          <div className="sidebar-section">
            <p className="sidebar-label">Research Areas</p>
            <div className="interest-pills">
              {home?.researchInterests?.map((r, i) => (
                <span key={i} className="interest-pill">{r}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="content-col">

          {/* Research Interests with images */}
          {interests?.length > 0 && (
            <div className="bio-section">
              <p className="sec-head">Areas of Focus</p>
              <div className="interest-cards">
                {interests.map((item, i) => (
                  <div key={i} className="interest-img-card">
                    <img
                      src={`${API_BASE}${item.image}`}
                      alt={item.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                    />
                    <div className="interest-img-label">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsored Projects */}
          {projects?.length > 0 && (
            <div className="bio-section">
              <p className="sec-head">Sponsored Projects</p>
              {projects.map((p, i) => (
                <div key={i} className="project-entry">
                  <div className="project-idx">{i + 1}</div>
                  <div className="project-body">
                    <div className="project-title">{p.title}</div>
                    <div className="project-meta">
                      <span><strong>Agency:</strong> {p.fundedBy}</span>
                      <span><strong>Grant:</strong> {p.cost}</span>
                      <span
                        className={`status-badge ${p.status?.toLowerCase().includes('ongoing') ? 'ongoing' : 'completed'}`}
                      >{p.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PhD Scholars */}
          {phdStudents?.length > 0 && (
            <div className="bio-section">
              <p className="sec-head">PhD Scholars</p>
              {phdStudents.map((s, i) => (
                <div key={i} className="scholar-entry">
                  <img
                    className="scholar-avatar"
                    src={`${API_BASE}${s.image}`}
                    alt={s.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='32'%3E👤%3C/text%3E%3C/svg%3E"; }}
                  />
                  <div className="scholar-info">
                    <div className="scholar-name">{s.name}</div>
                    <div className="scholar-topic">{s.topic}</div>
                    <div className="scholar-meta">{s.institution} · {s.year}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Research;