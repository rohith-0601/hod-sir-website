import { useEffect } from "react";
import useContent from "../hooks/useContent";
import ProfileTabs from "../components/ProfileTabs";
import "./Home.css";
import "./Teaching.css";

function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

const Teaching = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
  }, []);

  if (loading) return <div className="loading-state">Loading…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.teaching) return <div>No teaching data</div>;

  const { header, home, teaching } = content;

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
            {home?.contact?.office && (
              <div className="contact-item">
                <div className="ci-icon">📍</div>
                <div className="ci-body">
                  <span className="ci-label">Office</span>
                  <span className="ci-value">{home.contact.office}</span>
                </div>
              </div>
            )}
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
            <img src="/digvijaySir.png" alt={header.name}
              style={{ width: '100%', borderRadius: 8, objectFit: 'cover', aspectRatio: '1/1' }} />
          </div>
        </aside>

        {/* Content */}
        <div className="content-col">
          <div className="page-title-strip">
            <h2>Academic Teaching</h2>
            <p>Courses delivered at IIT Hyderabad</p>
          </div>

          <div className="course-cols">
            <div className="course-col">
              <div className="course-badge">B.Tech — Undergraduate</div>
              {teaching.ug?.map((course, i) => (
                <div key={i} className="course-item">{course}</div>
              ))}
            </div>
            <div className="course-col">
              <div className="course-badge">M.Tech / Ph.D — Postgraduate</div>
              {teaching.pg?.map((course, i) => (
                <div key={i} className="course-item">{course}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teaching;