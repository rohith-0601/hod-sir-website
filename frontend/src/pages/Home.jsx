import { useEffect } from "react";
import useContent from "../hooks/useContent";
import ProfileTabs from "../components/ProfileTabs";
import "./Home.css";

// Theme switches every 8 hours — all keep navy #0f2b46 as primary
// 00–07 → theme-gold  (warm gold accent)
// 08–15 → theme-teal  (teal accent)
// 16–23 → theme-violet (violet accent)
function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

const Home = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    document.documentElement.classList.add(cls);
    return () => {
      document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    };
  }, []);

  if (loading) return <div className="loading-state">Loading…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.home) return <div>No data</div>;

  const { header, home } = content;

  return (
    <div className="home-wrapper">

      {/* ══════════════════ HERO ══════════════════ */}
      <header className="academic-hero">
        <div className="wide-container">

          {/* Row 1: Name + IIT Logo */}
          <div className="hero-top">
            <div className="hero-identity">
              <h1 className="hero-name">{header.name}</h1>
              <p className="hero-subname">{header.subname}</p>
              <span className="hero-designation">{header.designation}</span>
              <span className="hero-institute">{header.institute}</span>
            </div>
            <img className="iit-logo" src="/IITHLOGO1.png" alt="IIT Hyderabad" />
          </div>

          {/* Row 2: Profile photo + contact chips */}
          <div className="hero-body">
            <div className="hero-photo-wrap">
              <img
                className="hero-photo"
                src="/digvijaySir.png"
                alt={header.name}
              />
              <div className="hero-photo-accent" />
            </div>

            <div className="hero-chips">
              {home.contact?.lab && (
                <span className="hero-chip">
                  <span className="hero-chip-icon">🏬</span>
                  {home.contact.lab}
                </span>
              )}
              {home.contact?.office && (
                <span className="hero-chip">
                  <span className="hero-chip-icon">📍</span>
                  {home.contact.office}
                </span>
              )}
              {home.contact?.email && (
                <a href={`mailto:${home.contact.email}`} className="hero-chip">
                  <span className="hero-chip-icon">✉</span>
                  {home.contact.email}
                </a>
              )}
              {home.contact?.webpage && (
                <a href={home.contact.webpage} target="_blank" rel="noreferrer" className="hero-chip">
                  <span className="hero-chip-icon">🌐</span>
                  Personal Website ↗
                </a>
              )}
            </div>
          </div>

          {/* Row 3: Nav tabs */}
          <div className="hero-nav">
            <ProfileTabs />
          </div>

        </div>
      </header>

      {/* ══════════════════ PAGE BODY ══════════════════ */}
      <div className="page-body wide-container">

        {/* ── SIDEBAR ── */}
        <aside className="prof-sidebar">

          {/* Contact */}
          <div className="sidebar-section">
            <p className="sidebar-label">Contact</p>

            {home.contact?.lab && (
              <div className="contact-item">
                <div className="ci-icon">🏬</div>
                <div className="ci-body">
                  <span className="ci-label">Lab</span>
                  <span className="ci-value">{home.contact.lab}</span>
                </div>
              </div>
            )}
            {home.contact?.office && (
              <div className="contact-item">
                <div className="ci-icon">📍</div>
                <div className="ci-body">
                  <span className="ci-label">Office</span>
                  <span className="ci-value">{home.contact.office}</span>
                </div>
              </div>
            )}
            {home.contact?.email && (
              <div className="contact-item">
                <div className="ci-icon">✉</div>
                <div className="ci-body">
                  <span className="ci-label">Email</span>
                  <span className="ci-value email">{home.contact.email}</span>
                </div>
              </div>
            )}

            {home.contact?.webpage && (
              <a href={home.contact.webpage} target="_blank" rel="noreferrer" className="sidebar-btn">
                Visit Website ↗
              </a>
            )}
          </div>

          {/* Research Interests — flowing pill tags, no boxes */}
          <div className="sidebar-section">
            <p className="sidebar-label">Research Interests</p>
            <div className="interest-pills">
              {home.researchInterests?.map((r, i) => (
                <span key={i} className="interest-pill">{r}</span>
              ))}
            </div>
          </div>

        </aside>

        {/* ── CONTENT ── */}
        <div className="content-col">

          {/* Dept */}
          <div className="dept-strip">
            <h2>{home.department}</h2>
            <p className="faculty-line">{home.faculty}</p>
          </div>

          {/* Bio */}
          <div className="bio-section">
            <p className="sec-head">About</p>
            <p className="bio-text">{home.briefBio}</p>
            {home.socialNote && <div className="social-note">{home.socialNote}</div>}
          </div>

          {/* Honours + Positions — flex side by side */}
          <div className="awards-row">
            <div className="awards-col">
              <p className="sec-head">Honours &amp; Awards</p>
              <ul className="clean-list">
                {home.honours?.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            <div className="awards-col">
              <p className="sec-head">Positions of Responsibility</p>
              <ul className="clean-list">
                {home.positions?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
