import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import useContent from "./hooks/useContent";
import Admin from "./pages/Admin";
import "./pages/Home.css";
import "./pages/Teaching.css";
import "./pages/Research.css";
import "./pages/Publications.css";
import "./pages/Gallery.css";
import "./pages/Other.css";

// ─── Sub-components (no hero, just content panels) ───────────────

// HOME PANEL
const HomePanel = ({ home }) => (
  <div className="content-col">
    <div className="dept-strip">
      <h2>{home.department}</h2>
      <p className="faculty-line">{home.faculty}</p>
    </div>
    <div className="bio-section">
      <p className="sec-head">About</p>
      <p className="bio-text">{home.briefBio}</p>
      {home.socialNote && <div className="social-note">{home.socialNote}</div>}
    </div>
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
);

// TEACHING PANEL
const TeachingPanel = ({ teaching }) => (
  <div className="content-col">
    <div className="page-title-strip">
      <h2>Academic Teaching</h2>
      <p>Courses delivered at IIT Hyderabad</p>
    </div>
    <div className="course-cols">
      <div className="course-col">
        <div className="course-badge">B.Tech — Undergraduate</div>
        {teaching.ug?.map((c, i) => <div key={i} className="course-item">{c}</div>)}
      </div>
      <div className="course-col">
        <div className="course-badge">M.Tech / Ph.D — Postgraduate</div>
        {teaching.pg?.map((c, i) => <div key={i} className="course-item">{c}</div>)}
      </div>
    </div>
  </div>
);

// RESEARCH PANEL
const API_BASE = "https://digvijay.xo.je";

const ResearchPanel = ({ research }) => {
  const { interests, projects, phdStudents } = research;
  return (
    <div className="content-col">
      {interests?.length > 0 && (
        <div className="bio-section">
          <p className="sec-head">Areas of Focus</p>
          <div className="interest-cards">
            {interests.map((item, i) => (
              <div key={i} className="interest-img-card">
                <img src={`${API_BASE}${item.image}`} alt={item.title}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=Research"; }} />
                <div className="interest-img-label">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
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
                  <span className={`status-badge ${p.status?.toLowerCase().includes('ongoing') ? 'ongoing' : 'completed'}`}>{p.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PUBLICATIONS PANEL
const PublicationsPanel = ({ publications }) => {
  const { journals, conferences, invitedTalks } = publications;
  return (
    <div className="content-col">
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
                    <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="doi-link">DOI ↗</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  );
};

// GALLERY PANEL
const GalleryPanel = ({ gallery }) => {
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedImg ? 'hidden' : 'auto';
  }, [selectedImg]);

  const GallerySection = ({ title, images }) => {
    if (!images?.length) return null;
    return (
      <div className="bio-section">
        <p className="sec-head">{title}</p>
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={i} className="gallery-item"
              onClick={() => setSelectedImg({ src: `${API_BASE}${img.src}`, caption: img.caption })}>
              <img src={`${API_BASE}${img.src}`} alt={img.caption || title} loading="lazy" />
              <div className="overlay">
                <span>View</span>
                <p className="caption-text">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="content-col">
      <GallerySection title="Professional Events" images={gallery.professional} />
      <GallerySection title="Hobbies &amp; Interests" images={gallery.hobbies} />
      <GallerySection title="Life &amp; Moments" images={gallery.life} />

      {selectedImg && (
        <div className="lightbox-overlay" onClick={() => setSelectedImg(null)}>
          <span className="close-btn">&times;</span>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg.src} alt={selectedImg.caption || "Enlarged"} />
            {selectedImg.caption && <div className="lightbox-caption"><p>{selectedImg.caption}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
};

// TEAM PANEL
const TeamPanel = ({ research }) => {
  const phdStudents = research?.phdStudents ?? [];
  return (
    <div className="content-col">
      <div className="dept-strip">
        <h2>Research Team</h2>
        <p className="faculty-line">PhD Scholars · Transportation Systems Engineering Lab</p>
      </div>

      {phdStudents.length === 0 ? (
        <p style={{ color: 'var(--ink3)', fontSize: '0.95rem' }}>No team members found.</p>
      ) : (
        <div className="team-grid">
          {phdStudents.map((s, i) => (
            <div key={i} className="team-card">
              <div className="team-photo-wrap">
                <img
                  src={`${API_BASE}${s.image}`}
                  alt={s.name}
                  className="team-photo"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200?text=👤"; }}
                />
              </div>
              <div className="team-info">
                <div className="team-name">{s.name}</div>
                <div className="team-topic">{s.topic}</div>
                <div className="team-institution">{s.institution}</div>
                <div className="team-footer">
                  <span className="team-year">Since {s.year}</span>
                  <span className={`status-badge ${s.status?.toLowerCase().includes('ongoing') || !s.status ? 'ongoing' : 'completed'}`}>
                    {s.status || 'Ongoing'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// OTHER PANEL
const OtherPanel = ({ other }) => {
  const { forms, news } = other;
  return (
    <div className="content-col">
      {forms?.length > 0 && (
        <div className="bio-section">
          <p className="sec-head">Forms &amp; Documents</p>
          <div className="forms-list">
            {forms.map((form, i) => (
              <a key={i} href={`${API_BASE}${form.link}`} target="_blank" rel="noopener noreferrer" className="form-entry" download>
                <div className="form-icon">📄</div>
                <div className="form-info">
                  <span className="form-name">{form.name}</span>
                  <span className="form-dl">Download PDF ↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      {news?.length > 0 && (
        <div className="bio-section">
          <p className="sec-head">Latest News</p>
          <div className="news-list">
            {news.map((item, i) => (
              <div key={i} className="news-entry">
                <div className="news-dot" />
                <p className="news-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── OUTREACH PANEL ───────────────────────────────────────────────
const SCHOLAR_URL = "https://scholar.google.com/citations?user=KOwRhZQAAAAJ&hl=en";

// Citation data from Google Scholar (year → count)
const CITE_YEARS = [
  { year: "2014", count: 17 },
  { year: "2015", count: 27 },
  { year: "2016", count: 32 },
  { year: "2017", count: 45 },
  { year: "2018", count: 71 },
  { year: "2019", count: 202 },
  { year: "2020", count: 286 },
  { year: "2021", count: 315 },
  { year: "2022", count: 320 },
  { year: "2023", count: 336 },
  { year: "2024", count: 66 },
];

const CO_AUTHORS = [
  { name: "Gopal R Patil", role: "Indian Institute of Technology Bombay", url: "https://scholar.google.com/citations?user=3lTYyqYAAAAJ" },
  { name: "Vinayak Devendra Malaghan", role: "Assistant Professor, BITS Pilani", url: "https://scholar.google.com/citations?user=Uo-YjlsAAAAJ" },
  { name: "Pritha Chatterjee", role: "IIT Hyderabad", url: "https://scholar.google.com/citations?user=aCIAFWsAAAAJ" },
  { name: "Hussein Dia", role: "Professor, Swinburne University of Technology", url: "https://scholar.google.com/citations?user=GtVmK_oAAAAJ" },
  { name: "Nagendra R Velaga", role: "Professor, IIT Bombay", url: "https://scholar.google.com/citations?user=lGeaDAUAAAAJ" },
  { name: "Jahnavi Yarlagadda", role: "Assistant Professor, Mahindra University", url: "https://scholar.google.com/citations?user=FiwoQ78AAAAJ" },
  { name: "Ankit Kumar Yadav", role: "Assistant Professor, UPES Dehradun", url: "https://scholar.google.com/citations?user=B2ZLHK0AAAAJ" },
  { name: "Pushpa Choudhary", role: "Assistant Professor, IIT Indore", url: "https://scholar.google.com/citations?user=unUZoZAAAAAJ" },
  { name: "Rakshita Nagalla", role: "Student, Columbia University", url: "https://scholar.google.com/citations?user=WMecmuEAAAAJ" },
  { name: "Shruti Upadhyaya", role: "Assistant Professor, IIT Hyderabad", url: "https://scholar.google.com/citations?user=BnK37qIAAAAJ" },
  { name: "Anita Chandrasekharan", role: "PhD, IIT Bombay", url: "https://scholar.google.com/citations?user=tFWq_boAAAAJ" },
];

const CitationChart = () => {
  const max = Math.max(...CITE_YEARS.map(d => d.count));
  const H = 140, W = 560, barW = 36, gap = 14;
  const totalW = CITE_YEARS.length * (barW + gap) - gap;
  const offsetX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H + 36}`} className="scholar-chart" aria-label="Citations per year">
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={0} x2={W} y1={H - f * H} y2={H - f * H}
          stroke="var(--divider)" strokeWidth="1" />
      ))}

      {CITE_YEARS.map((d, i) => {
        const x = offsetX + i * (barW + gap);
        const bh = Math.max(4, (d.count / max) * H);
        const y = H - bh;
        return (
          <g key={d.year}>
            <rect x={x} y={y} width={barW} height={bh}
              rx="4" fill="var(--a)" opacity="0.85"
              className="chart-bar" />
            <text x={x + barW / 2} y={H + 16} textAnchor="middle"
              fontSize="10" fill="var(--ink3)">{d.year}</text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle"
              fontSize="9" fill="var(--ink2)" fontWeight="600">{d.count}</text>
          </g>
        );
      })}
    </svg>
  );
};

const OutreachPanel = () => (
  <div className="content-col">
    {/* Header */}
    <div className="dept-strip">
      <h2>Academic Outreach</h2>
      <p className="faculty-line">Citation metrics sourced from Google Scholar</p>
    </div>

    {/* Metric Cards */}
    <div className="scholar-metrics">
      {[
        { label: "Total Citations", all: "1,738", since: "1,529" },
        { label: "h-index", all: "23", since: "22" },
        { label: "i10-index", all: "37", since: "37" },
      ].map(m => (
        <div key={m.label} className="metric-card">
          <div className="metric-label">{m.label}</div>
          <div className="metric-row">
            <div className="metric-val">
              <span className="metric-num">{m.all}</span>
              <span className="metric-sub">All time</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-val">
              <span className="metric-num">{m.since}</span>
              <span className="metric-sub">Since 2021</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Citation Bar Chart */}
    <div className="bio-section">
      <div className="section-hdr-row">
        <p className="sec-head">Citations per Year</p>
        <a href={SCHOLAR_URL} target="_blank" rel="noreferrer" className="scholar-link">
          View on Google Scholar ↗
        </a>
      </div>
      <CitationChart />
    </div>

    {/* Co-authors */}
    <div className="bio-section">
      <p className="sec-head">Co-authors</p>
      <div className="coauthor-grid">
        {CO_AUTHORS.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noreferrer" className="coauthor-card">
            <div className="coauthor-avatar">{a.name.charAt(0)}</div>
            <div className="coauthor-info">
              <div className="coauthor-name">{a.name}</div>
              <div className="coauthor-role">{a.role}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
);

// ─── SIDEBAR ─────────────────────────────────────────────────────
const Sidebar = ({ home, header, activeTab }) => (
  <aside className="prof-sidebar">
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

    {/* show research interests on Home & Research tabs */}
    {(activeTab === "home" || activeTab === "research") && (
      <div className="sidebar-section">
        <p className="sidebar-label">Research Interests</p>
        <div className="interest-pills">
          {home.researchInterests?.map((r, i) => (
            <span key={i} className="interest-pill">{r}</span>
          ))}
        </div>
      </div>
    )}

    {/* publication counts on Publications tab */}
    {activeTab === "publications" && (
      <div className="sidebar-section">
        <p className="sidebar-label">Summary</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: "Journals", count: "—" },
            { label: "Conferences", count: "—" },
            { label: "Invited Talks", count: "—" },
          ].map(({ label }) => (
            <div key={label}>
              <span className="ci-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </aside>
);

// ─── TAB BAR ─────────────────────────────────────────────────────
const TABS = [
  { id: "home", label: "Home" },
  { id: "teaching", label: "Teaching" },
  { id: "research", label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "team", label: "Team" },
  { id: "gallery", label: "Gallery" },
  { id: "outreach", label: "Outreach" },
  { id: "other", label: "Other" },
];

const TabBar = ({ active, onChange }) => (
  <div className="hero-nav">
    <div className="profile-tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-link ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── THEME ───────────────────────────────────────────────────────
function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

// ─── MAIN APP ────────────────────────────────────────────────────
function ProfessorSite() {
  const { content, loading, error } = useContent();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, []);

  if (loading) return <div className="loading-state">Loading…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.home) return <div className="loading-state">No data</div>;

  const { header, home, teaching, research, publications, gallery, other } = content;

  const renderPanel = () => {
    switch (activeTab) {
      case "home": return <HomePanel home={home} />;
      case "teaching": return teaching ? <TeachingPanel teaching={teaching} /> : null;
      case "research": return research ? <ResearchPanel research={research} /> : null;
      case "publications": return publications ? <PublicationsPanel publications={publications} /> : null;
      case "team": return research ? <TeamPanel research={research} /> : null;
      case "gallery": return gallery ? <GalleryPanel gallery={gallery} /> : null;
      case "outreach": return <OutreachPanel />;
      case "other": return other ? <OtherPanel other={other} /> : null;
      default: return <HomePanel home={home} />;
    }
  };

  return (
    <div className="home-wrapper">

      {/* ══════ HERO — always shown ══════ */}
      <header className="academic-hero">
        <div className="wide-container">

          {/* Name + Logo */}
          <div className="hero-top">
            <div className="hero-identity">
              <h1 className="hero-name">{header.name}</h1>
              <p className="hero-subname">{header.subname}</p>
              <span className="hero-designation">{header.designation}</span>
              <span className="hero-institute">{header.institute}</span>
            </div>
            <img className="iit-logo" src="/IITHLOGO1.png" alt="IIT Hyderabad" />
          </div>

          {/* Photo + Chips */}
          <div className="hero-body">
            <div className="hero-photo-wrap">
              <img className="hero-photo" src="/digvijaySir.png" alt={header.name} />
              <div className="hero-photo-accent" />
            </div>
            <div className="hero-chips">
              {home.contact?.lab && (
                <span className="hero-chip"><span className="hero-chip-icon">🏬</span>{home.contact.lab}</span>
              )}
              {home.contact?.office && (
                <span className="hero-chip"><span className="hero-chip-icon">📍</span>{home.contact.office}</span>
              )}
              {home.contact?.email && (
                <a href={`mailto:${home.contact.email}`} className="hero-chip">
                  <span className="hero-chip-icon">✉</span>{home.contact.email}
                </a>
              )}
              {home.contact?.webpage && (
                <a href={home.contact.webpage} target="_blank" rel="noreferrer" className="hero-chip">
                  <span className="hero-chip-icon">🌐</span>Personal Website ↗
                </a>
              )}
            </div>
            {/* Lab logo — white ring + blue T on dark hero */}
            <img
              src="/lablogo_final.png"
              alt="Lab Logo"
              className="hero-lab-logo"
            />
          </div>

          {/* Tab bar */}
          <TabBar active={activeTab} onChange={setActiveTab} />

        </div>
      </header>

      {/* ══════ CONTENT — changes per tab ══════ */}
      {activeTab === "home" ? (
        <div className="page-body wide-container">
          <Sidebar home={home} header={header} activeTab={activeTab} />
          {renderPanel()}
        </div>
      ) : (
        <div className="page-body-full wide-container">
          {renderPanel()}
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/update" element={<Admin />} />
      <Route path="/*" element={<ProfessorSite />} />
    </Routes>
  );
}

export default App;
