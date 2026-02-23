import { useEffect } from "react";
import useContent from "../hooks/useContent";
import ProfileTabs from "../components/ProfileTabs";
import "./Home.css";
import "./Publications.css";

function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

const Publications = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
  }, []);

  if (loading) return <div className="loading-state">Loading…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.publications) return <div>No data</div>;

  const { header, home, publications } = content;
  const { journals, conferences, invitedTalks } = publications;

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
            <p className="sidebar-label">Summary</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div className="ci-label">Journal Papers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--p)' }}>{journals?.length ?? 0}</div>
              </div>
              <div>
                <div className="ci-label">Conferences</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--p)' }}>{conferences?.length ?? 0}</div>
              </div>
              <div>
                <div className="ci-label">Invited Talks</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--p)' }}>{invitedTalks?.length ?? 0}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="content-col">

          {/* Journal Papers */}
          {journals?.length > 0 && (
            <div className="bio-section">
              <p className="sec-head">Journal Papers</p>
              {journals.map((p, i) => (
                <div key={i} className="pub-entry">
                  <div className="pub-year-badge">{p.year}</div>
                  <div className="pub-body">
                    <div className="pub-title">{p.title}</div>
                    <div className="pub-authors">{p.authors}</div>
                    <div className="pub-meta-row">
                      <span className="pub-journal">{p.journal}</span>
                      {p.volume && <span className="pub-detail">Vol. {p.volume}</span>}
                      {p.pages && <span className="pub-detail">pp. {p.pages}</span>}
                      {p.doi && (
                        <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="doi-link">
                          DOI ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Conferences */}
          {conferences?.length > 0 && (
            <div className="bio-section">
              <p className="sec-head">Conference Proceedings</p>
              {conferences.map((c, i) => (
                <div key={i} className="pub-entry">
                  <div className="pub-year-badge">{c.year}</div>
                  <div className="pub-body">
                    <div className="pub-title">{c.title}</div>
                    <div className="pub-authors">{c.authors}</div>
                    <div className="pub-meta-row">
                      <span className="pub-journal">{c.conference}</span>
                      {c.location && <span className="pub-detail">📍 {c.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Invited Talks */}
          {invitedTalks?.length > 0 && (
            <div className="bio-section">
              <p className="sec-head">Invited Talks</p>
              {invitedTalks.map((t, i) => (
                <div key={i} className="talk-entry">
                  <div className="talk-year">{t.year}</div>
                  <div className="talk-body">
                    <div className="talk-title">{t.title}</div>
                    <div className="talk-event">{t.event}</div>
                    <div className="talk-inst">{t.institution}</div>
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

export default Publications;
