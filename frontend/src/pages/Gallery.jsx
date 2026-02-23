import { useState, useEffect } from "react";
import useContent from "../hooks/useContent";
import "./Gallery.css";

const API_BASE = "https://digvijay.xo.je";

function getTheme() {
  const h = new Date().getHours();
  if (h < 8) return "theme-gold";
  if (h < 16) return "theme-teal";
  return "theme-violet";
}

const GallerySection = ({ title, images, onImageClick }) => {
  if (!images || images.length === 0) return null;
  return (
    <section className="gallery-section">
      <h2 className="gallery-section-title">{title}</h2>
      <div className="gallery-grid">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="gallery-item"
            onClick={() => onImageClick({ src: `${API_BASE}${img.src}`, caption: img.caption })}
          >
            <img src={`${API_BASE}${img.src}`} alt={img.caption || `${title} ${idx + 1}`} loading="lazy" />
            <div className="overlay">
              <span>View</span>
              <p className="caption-text">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Gallery = () => {
  const { content, loading, error } = useContent();
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const cls = getTheme();
    document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove("theme-gold", "theme-teal", "theme-violet");
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedImg ? 'hidden' : 'auto';
  }, [selectedImg]);

  if (loading) return <div className="loading-state">Loading Gallery…</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!content?.gallery) return <div className="error-state">No gallery data</div>;

  const { professional, hobbies, life } = content.gallery;

  return (
    <div className="gallery-page">
      <div className="gallery-container">

        <header className="gallery-page-header">
          <div>
            <h1>Photo Gallery</h1>
            <p>A glimpse into professional &amp; personal life</p>
          </div>
        </header>

        <GallerySection title="Professional Events" images={professional} onImageClick={setSelectedImg} />
        <GallerySection title="Hobbies &amp; Interests" images={hobbies} onImageClick={setSelectedImg} />
        <GallerySection title="Life &amp; Moments" images={life} onImageClick={setSelectedImg} />

      </div>

      {/* Lightbox */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={() => setSelectedImg(null)}>
          <span className="close-btn">&times;</span>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg.src} alt={selectedImg.caption || "Enlarged view"} />
            {selectedImg.caption && (
              <div className="lightbox-caption"><p>{selectedImg.caption}</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
