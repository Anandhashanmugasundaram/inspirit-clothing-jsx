import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: true,
    });

    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // Refresh ScrollTrigger after Lenis initializes
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        immediate: true,
      });

      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return null;
}