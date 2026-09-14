import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const NAV = [
  { label: "Quem somos", to: "/#quem-somos" },
  { label: "Especialidades", to: "/#especialidades" },
  { label: "Nosso método", to: "/#nosso-metodo" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid #E2E4EE" : "1px solid transparent",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 h-16 grid grid-cols-[1fr_auto_1fr] items-center">

        {/* Logo — versão reduzida */}
        <Link
          to="/"
          className="flex items-center group flex-shrink-0 justify-self-start"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Genuína Peças Prime"
            className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav — centralizado */}
        <nav className="hidden md:flex items-center gap-8 justify-self-center">
          {NAV.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="label transition-colors duration-200 hover:text-[#004BBE]"
              style={{ color: "#5C6070" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA — direita */}
        <div className="hidden md:flex justify-self-end">
          <Link
            to="/#contato"
            className="label inline-flex items-center gap-2 px-5 py-2.5 transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "#004BBE", color: "white", borderRadius: "6px" }}
          >
            Fale com a equipe
            <span aria-hidden>↗</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 justify-self-end col-start-3"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "#0B0E1A",
                transform:
                  open && i === 0 ? "rotate(45deg) translate(3.5px,3.5px)"
                  : open && i === 1 ? "scaleX(0)"
                  : open && i === 2 ? "rotate(-45deg) translate(3.5px,-3.5px)"
                  : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? "280px" : "0",
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(16px)",
          borderTop: open ? "1px solid #E2E4EE" : "none",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col gap-5">
          {NAV.map(({ label, to }) => (
            <Link key={to} to={to} className="label text-[#0B0E1A]">{label}</Link>
          ))}
          <Link
            to="/#contato"
            className="label px-5 py-3 text-center mt-1 inline-flex items-center justify-center gap-2"
            style={{ background: "#004BBE", color: "white", borderRadius: "6px" }}
          >
            Fale com a equipe ↗
          </Link>
        </div>
      </div>
    </header>
  );
}
