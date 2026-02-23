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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    fetch(`${API_BASE}/${endpoint}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load content");
        return res.json();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          setError("Backend is unreachable. Please try again later.");
        } else {
          setError(err.message);
        }
        setLoading(false);
      })
      .finally(() => clearTimeout(timeout));

    return () => { controller.abort(); clearTimeout(timeout); };
  }, [endpoint]);

  return { content, loading, error };
}
