import { useEffect } from "react";
import useContent from "../hooks/useContent";
import "./Other.css";

const API_BASE = "https://digvijay.xo.je";

function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

const Other = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
  }, []);

  if (loading) return <div className="loading-state">Loading…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.other) return <div className="error-state">No data available</div>;

  const { forms, news } = content.other;

  return (
    <div className="other-page">
      <div className="other-container">

        <header className="other-page-header">
          <h1>Resources &amp; Updates</h1>
          <p>Downloadable forms and latest announcements</p>
        </header>

        {/* Forms */}
        {forms?.length > 0 && (
          <section className="other-section">
            <p className="other-sec-head">Forms &amp; Documents</p>
            <div className="forms-list">
              {forms.map((form, i) => (
                <a
                  key={i}
                  href={`${API_BASE}${form.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="form-entry"
                  download
                >
                  <div className="form-icon">📄</div>
                  <div className="form-info">
                    <span className="form-name">{form.name}</span>
                    <span className="form-dl">Download PDF ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* News */}
        {news?.length > 0 && (
          <section className="other-section">
            <p className="other-sec-head">Latest News</p>
            <div className="news-list">
              {news.map((item, i) => (
                <div key={i} className="news-entry">
                  <div className="news-dot" />
                  <p className="news-text">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Other;
