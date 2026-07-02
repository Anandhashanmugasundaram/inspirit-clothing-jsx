import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logo from "@/assets/inspirit-logo.png";

export default function IntroLoader() {
  const [done, setDone] = useState(false);

  const root = useRef(null);
  const bar = useRef(null);
  const logoRef = useRef(null);
  const count = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadyLoaded = false;

    try {
      alreadyLoaded = !!sessionStorage.getItem("inspirit:loaded");
    } catch {
      alreadyLoaded = false;
    }

    if (alreadyLoaded) {
      setDone(true);
      return;
    }

    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("inspirit:loaded", "1");
        } catch {}

        setDone(true);
      },
    });

    tl.from(logoRef.current, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    })

      .to(
        bar.current,
        {
          width: "100%",
          duration: 1.6,
          ease: "power2.inOut",
        },
        "<0.2"
      )

      .to(
        counter,
        {
          value: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) {
              count.current.textContent = `${Math.round(counter.value)}%`;
            }
          },
        },
        "<"
      )

      .to(
        logoRef.current,
        {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: "power3.in",
        },
        "+=0.2"
      )

      .to(
        root.current,
        {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut",
        },
        "<0.1"
      );

    return () => tl.kill();
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
    >
      <img
        ref={logoRef}
        src={logo}
        alt="Inspirit"
        className="intro-logo w-44 mb-10"
      />

      <div className="w-72 h-[2px] bg-white/20 overflow-hidden">
        <div
          ref={bar}
          className="h-full w-0 bg-[var(--ember)]"
          style={{ boxShadow: "0 0 20px var(--ember)" }}
        />
      </div>

      <p className="mt-6 text-sm tracking-[0.3em]">
        <span ref={count}>0%</span> — ENTERING THE RITUAL
      </p>
    </div>
  );
}