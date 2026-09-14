export default function Footer() {
  return (
    <footer style={{ background: "#0B0E1A" }}>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Genuína Peças Prime"
          className="h-12 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>
          Genuína Peças Prime / Campinas — SP / Distribuição técnica
        </p>
        <a
          href="#top"
          className="label inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          VOLTAR AO TOPO <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
