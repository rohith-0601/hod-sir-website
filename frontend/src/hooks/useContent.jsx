import { useEffect, useState } from "react";

const API_BASE = "https://digvijay.xo.je/api";
// ✅ fixed

export default function useContent(endpoint = "getContent.php") {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/${endpoint}`)   // ✅ fixed path
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load content");
        return res.json();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [endpoint]);

  return { content, loading, error };
}
