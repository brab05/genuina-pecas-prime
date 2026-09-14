import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Reveal de carregamento — cortina em dois painéis (navy sólido, mesmo grid
// técnico do resto do site) que se abre revelando a logo em branco antes de
// se separar verticalmente. Sóbrio e consistente com a identidade da marca,
// ao invés de faixas coloridas.
const SESSION_KEY = "gpp_reveal_shown_v2";

// Avisa o resto da página (ex.: animações do hero) que a cortina terminou
// de abrir, pra elas não começarem enquanto o overlay ainda cobre a tela.
function announceDone() {
  window.__gppRevealDone = true;
  window.dispatchEvent(new Event("gpp:reveal-done"));
}

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(0,75,190,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,75,190,0.08) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
};

export default function PageLoadReveal({ children }) {
  // Decide de forma síncrona (antes do primeiro paint) se o reveal deve rodar,
  // pra não ter flash de conteúdo sem overlay.
  const [shouldRun] = useState(() => {
    if (typeof window === "undefined") return false;
    const already = sessionStorage.getItem(SESSION_KEY);
    if (already) return false;
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  });

  const overlayRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!shouldRun) {
      announceDone();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (overlayRef.current) overlayRef.current.style.display = "none";
      announceDone();
      return;
    }

    document.body.style.overflow = "hidden";

    const runReveal = () => {
      gsap.set(logoRef.current, { opacity: 0, scale: 0.92 });

      gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          if (overlayRef.current) overlayRef.current.style.display = "none";
          announceDone();
        },
      })
        // logo aparece com a tela ainda fechada
        .to(logoRef.current, { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 0.15)
        // pequeno "hold" e a logo some junto com a cortina se abrindo
        .to(logoRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.85)
        .to(topRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 0.85)
        .to(bottomRef.current, { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, 0.85);
    };

    // Pré-carrega a logo antes de disparar, pra evitar "pulo" visual
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}logo.png`;
    if (img.complete) {
      runReveal();
      return;
    }
    img.onload = runReveal;
    const fallback = setTimeout(runReveal, 2500);
    return () => clearTimeout(fallback);
  }, [shouldRun]);

  if (!shouldRun) return <>{children}</>;

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      >
        <div ref={topRef} className="absolute inset-x-0 top-0" style={{ height: "50%", background: "#0B0E1A" }}>
          <div className="absolute inset-0" style={GRID_STYLE} />
          <div className="absolute inset-x-0 bottom-0" style={{ height: "1px", background: "#004BBE" }} />
        </div>
        <div ref={bottomRef} className="absolute inset-x-0 bottom-0" style={{ height: "50%", background: "#0B0E1A" }}>
          <div className="absolute inset-0" style={GRID_STYLE} />
          <div className="absolute inset-x-0 top-0" style={{ height: "1px", background: "#004BBE" }} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={logoRef}
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Genuína Peças Prime"
            style={{ width: "min(220px, 40vw)", filter: "brightness(0) invert(1)" }}
          />
        </div>
      </div>
      {children}
    </>
  );
}
