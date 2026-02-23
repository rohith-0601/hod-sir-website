import { useEffect, useState } from "react";
import useContent from "../hooks/useContent";
import "./Admin.css";

// 👇 UPDATE THIS TO YOUR BACKEND PORT
const API_BASE_URL = "https://digvijay.xo.je/api";

// Compress image client-side before upload (keeps under PHP 2MB limit)
const compressImage = (file, maxWidth = 1600, quality = 0.85) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
        "image/jpeg", quality);
    };
    img.src = url;
  });

const Admin = () => {
  // ---------- AUTH ----------
  const [password, setPassword] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");


  const { content, loading, error } = useContent(
    password ? `getContent.php?admin=1&password=${password}` : null,
  );

  // ---------- CORE STATE ----------
  const [editable, setEditable] = useState(null);
  const [status, setStatus] = useState("");

  // ---------- GALLERY ----------
  const [galleryCategory, setGalleryCategory] = useState("professional");
  const [galleryFile, setGalleryFile] = useState(null);

  // ---------- PUBLICATIONS STATE ----------
  const [newPub, setNewPub] = useState({
    year: "",
    authors: "",
    title: "",
    journal: "",
    doi: "",
  });

  // ---------- RESEARCH STATE ----------
  const [newProject, setNewProject] = useState({
    title: "",
    fundedBy: "",
    cost: "",
    status: "",
    role: "",
  });

  const [newStudent, setNewStudent] = useState({
    name: "",
    topic: "",
    year: "",
    mtech: "",
  });

  // ---------- INIT EDITABLE ----------
  useEffect(() => {
    if (content && !content.error && !editable) {
      // Deep copy to avoid reference issues
      setEditable(JSON.parse(JSON.stringify(content)));
    }
  }, [content, editable]);

  // ---------- UPDATE FUNCTION ----------
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getContent.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...editable }),
      });

      if (res.ok) {
        setStatus("✅ Content updated successfully!");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ Update failed. Check password.");
      }
    } catch {
      setStatus("❌ Network Error");
    }
  };

  // ---------- HELPERS ----------
  const addPublication = () => {
    if (!newPub.title) return;
    setEditable({
      ...editable,
      publications: {
        ...editable.publications,
        journals: [
          { ...newPub, year: Number(newPub.year) },
          ...(editable.publications?.journals || []),
        ],
      },
    });
    setNewPub({ year: "", authors: "", title: "", journal: "", doi: "" });
  };

  const deletePublication = (idx) => {
    const updated = editable.publications.journals.filter((_, i) => i !== idx);
    setEditable({
      ...editable,
      publications: { ...editable.publications, journals: updated },
    });
  };

  // ---------- RENDER ----------
  return (
    <div className="admin-page">
      {/* ─── TOP HEADER ─── */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="admin-logo-icon">🎓</div>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Dr. Digvijay S. Pawar · IIT Hyderabad</p>
          </div>
        </div>
        <span className="admin-header-badge">Secure Access</span>
      </header>

      <div className="admin-container">

        {/* AUTH CARD */}
        <div className="admin-card login-card" style={{ maxWidth: '100%', textAlign: 'left' }}>
          <h2><span className="card-icon">🔐</span> Authentication</h2>
          <label className="form-label">Admin Password</label>
          <input
            type="password"
            placeholder="Enter password to unlock editing…"
            value={password}
            className="form-input"
            style={{ marginTop: 4 }}
            onChange={(e) => {
              setPassword(e.target.value);
              setEditable(null);
            }}
          />
          {loading && <p style={{ color: 'var(--ink3)', fontSize: '0.85rem', marginTop: 6 }}>⏳ Loading data…</p>}
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 6 }}>❌ Connection Error</p>}
          {content?.error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 6 }}>❌ Incorrect Password</p>}
          {editable && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: 6 }}>✅ Authenticated — editing unlocked</p>}
        </div>

        {/* EDITOR */}
        {editable && (
          <div className="editor-wrapper">
            {/* 1. HOME BIO */}
            <section className="admin-card">
              <h2><span className="card-icon">📝</span> Biography</h2>
              <label className="form-label">Brief Bio</label>
              <textarea
                rows="6"
                className="form-textarea"
                /* FIX: Changed from .bio to .briefBio */
                value={editable.home?.briefBio || ""}
                onChange={(e) =>
                  setEditable({
                    ...editable,
                    home: { ...editable.home, briefBio: e.target.value },
                  })
                }
              />
            </section>

            {/* 2. PUBLICATIONS */}
            <section className="admin-card">
              <h2><span className="card-icon">📚</span> Add Publication</h2>
              <div className="input-grid">
                <input
                  placeholder="Year"
                  value={newPub.year}
                  onChange={(e) =>
                    setNewPub({ ...newPub, year: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Authors"
                  value={newPub.authors}
                  onChange={(e) =>
                    setNewPub({ ...newPub, authors: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Journal Name"
                  value={newPub.journal}
                  onChange={(e) =>
                    setNewPub({ ...newPub, journal: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="DOI"
                  value={newPub.doi}
                  onChange={(e) =>
                    setNewPub({ ...newPub, doi: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Paper Title"
                  value={newPub.title}
                  onChange={(e) =>
                    setNewPub({ ...newPub, title: e.target.value })
                  }
                  className="form-input full-width"
                />
              </div>
              <button className="btn btn-primary" onClick={addPublication}>
                + Add Paper
              </button>

              <div className="list-preview">
                <h3>
                  Current Journals ({editable.publications.journals.length})
                </h3>
                <ul>
                  {editable.publications.journals.map((p, i) => (
                    <li key={i}>
                      <span>
                        <strong>{p.year}</strong> - {p.title}
                      </span>
                      <button
                        className="btn-icon"
                        onClick={() => deletePublication(i)}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 3. RESEARCH PROJECTS */}
            <section className="admin-card">
              <h2><span className="card-icon">🔬</span> Add Research Project</h2>
              <div className="input-grid">
                <input
                  placeholder="Title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="form-input full-width"
                />
                <input
                  placeholder="Funded By"
                  value={newProject.fundedBy}
                  onChange={(e) =>
                    setNewProject({ ...newProject, fundedBy: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Cost (e.g. 25L)"
                  value={newProject.cost}
                  onChange={(e) =>
                    setNewProject({ ...newProject, cost: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Status (Ongoing/Completed)"
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Role"
                  value={newProject.role}
                  onChange={(e) =>
                    setNewProject({ ...newProject, role: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditable({
                    ...editable,
                    research: {
                      ...editable.research,
                      projects: [
                        ...(editable.research?.projects || []),
                        newProject,
                      ],
                    },
                  });
                  setNewProject({
                    title: "",
                    fundedBy: "",
                    cost: "",
                    status: "",
                    role: "",
                  });
                }}
              >
                + Add Project
              </button>

              <div className="list-preview">
                <h3>Current Projects</h3>
                <ul>
                  {editable.research.projects.map((p, i) => (
                    <li key={i}>
                      <span>
                        {p.title} ({p.status})
                      </span>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          const updated = editable.research.projects.filter(
                            (_, x) => x !== i,
                          );
                          setEditable({
                            ...editable,
                            research: {
                              ...editable.research,
                              projects: updated,
                            },
                          });
                        }}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4. PhD STUDENTS */}
            <section className="admin-card">
              <h2><span className="card-icon">👥</span> Add PhD Student</h2>
              <div className="input-grid">
                <input
                  placeholder="Name"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Year"
                  value={newStudent.year}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, year: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  placeholder="Topic"
                  value={newStudent.topic}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, topic: e.target.value })
                  }
                  className="form-input full-width"
                />
                <input
                  placeholder="M.Tech Info"
                  value={newStudent.mtech}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, mtech: e.target.value })
                  }
                  className="form-input full-width"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditable({
                    ...editable,
                    research: {
                      ...editable.research,
                      phdStudents: [
                        ...(editable.research?.phdStudents || []),
                        newStudent,
                      ],
                    },
                  });
                  setNewStudent({ name: "", topic: "", year: "", mtech: "" });
                }}
              >
                + Add Student
              </button>

              <div className="list-preview">
                <h3>Current Students</h3>
                <ul>
                  {editable.research.phdStudents.map((s, i) => (
                    <li key={i}>
                      <span>{s.name}</span>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          const updated = editable.research.phdStudents.filter(
                            (_, x) => x !== i,
                          );
                          setEditable({
                            ...editable,
                            research: {
                              ...editable.research,
                              phdStudents: updated,
                            },
                          });
                        }}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 5. GALLERY UPLOAD */}
            <section className="admin-card">
              <h2><span className="card-icon">🖼️</span> Gallery Manager</h2>
              <div className="gallery-controls">
                <select
                  className="form-select"
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="hobbies">Hobbies</option>
                  <option value="life">Life</option>
                </select>

                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={(e) => setGalleryFile(e.target.files[0])}
                />

                {/* ✅ NEW: Caption Input */}
                <input
                  type="text"
                  className="form-input"
                  placeholder="Image Caption (e.g. 'Conference 2024')"
                  value={galleryCaption}
                  onChange={(e) => setGalleryCaption(e.target.value)}
                />

                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (!galleryFile) {
                      alert("Select an image first");
                      return;
                    }

                    setStatus("Compressing image…");
                    const compressed = await compressImage(galleryFile);

                    const fd = new FormData();
                    fd.append("password", password);
                    fd.append("category", galleryCategory);
                    fd.append("image", compressed);
                    fd.append("caption", galleryCaption);

                    setStatus("Uploading…");
                    try {
                      const res = await fetch(`${API_BASE_URL}/uploadImage.php`, {
                        method: "POST",
                        body: fd,
                      });

                      if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || `Upload failed (HTTP ${res.status})`);
                      }

                      const data = await res.json();

                      // ✅ UPDATE WITH {src, caption} STRUCTURE
                      setEditable({
                        ...editable,
                        gallery: {
                          ...editable.gallery,
                          [galleryCategory]: [
                            ...(editable.gallery?.[galleryCategory] || []),
                            { src: data.path, caption: galleryCaption },
                          ],
                        },
                      });

                      // Reset form
                      setGalleryFile(null);
                      setGalleryCaption("");
                      alert("✅ Image + Caption uploaded successfully!");
                    } catch (e) {
                      console.error(e);
                      alert("❌ Upload error: " + e.message);
                    }
                  }}
                >
                  📤 Upload Image + Caption
                </button>
              </div>

              <div className="gallery-preview-grid">
                {(editable.gallery?.[galleryCategory] || []).map((img, i) => (
                  <div key={i} className="preview-item">
                    <img
                      src={`http://localhost:8000${img.src || img}`}
                      alt={img.caption || "preview"}
                    />
                    {/* ✅ SHOW CAPTION IN PREVIEW */}
                    {img.caption && (
                      <div className="preview-caption">{img.caption}</div>
                    )}
                    <button
                      className="delete-overlay"
                      onClick={() =>
                        setEditable({
                          ...editable,
                          gallery: {
                            ...editable.gallery,
                            [galleryCategory]: editable.gallery[galleryCategory].filter((_, x) => x !== i),
                          },
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </section>


            {/* GLOBAL ACTIONS */}
            <div className="sticky-footer">
              <button className="btn btn-save" onClick={handleUpdate}>
                💾 Save All Changes
              </button>
              {status && <span className="save-status">{status}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
