import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;

      const scrollTop = window.scrollY || doc.scrollTop;
      const total = doc.scrollHeight - window.innerHeight;

      const value = total > 0 ? (scrollTop / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, value)));
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, { passive: true });

    // Support Lenis
    if (window.lenis) {
      window.lenis.on("scroll", updateProgress);
    }

    return () => {
      window.removeEventListener("scroll", updateProgress);

      if (window.lenis) {
        window.lenis.off("scroll", updateProgress);
      }
    };
  }, []);

  return (
    <div
      className="h-full bg-[var(--ember)] transition-[width] duration-150"
      style={{
        width: `${progress}%`,
        boxShadow: "0 0 16px var(--ember)",
      }}
    />
  );
}