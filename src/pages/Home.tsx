import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import PageLoadReveal from "../components/PageLoadReveal";
import embreagemProImg from "@/assets/products/embreagempro.png";
import bombaProImg from "@/assets/products/bombapro.png";
import geralProImg from "@/assets/products/geralpro.png";
import reparoProImg from "@/assets/products/reparopro.png";
import caixaProImg from "@/assets/products/caixapro2.png";
import cremaProImg from "@/assets/products/cremapro.png";
import mecaProImg from "@/assets/products/mecapro.png";
import reservaProImg from "@/assets/products/reservapro.png";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
// Atualiza a posição do brilho (--spot-x/--spot-y) direto no DOM via ref,
// sem re-render a cada movimento do mouse.
function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onMouseMove = (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };
  return { ref, onMouseMove };
}

// Leve inclinação 3D seguindo o cursor — usada no cartão de logo do hero.
// Escreve o transform direto no DOM (sem re-render) e respeita reduced-motion.
function useTilt<T extends HTMLElement>(max = 9) {
  const ref = useRef<T>(null);
  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (reduceMotion.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };
  return { ref, onMouseMove, onMouseLeave };
}

// Corte técnico genérico (sem marca de montadora) — linha fina no mesmo
// estilo dos ícones do site, com o losango da marca marcando a linha
// hidráulica. Camada decorativa revelada pelo mouse no Hero.
function CarCutaway({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 900 300" style={style} fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeWidth="2.5" d="M50,210 L50,190 C50,175 60,165 75,162 L170,150 C200,105 250,80 320,78 L470,78 C520,55 590,52 640,72 L700,90 C740,100 770,120 790,150 L830,162 C845,165 855,175 855,190 L855,210" />
      <line strokeWidth="2.5" x1="50" y1="210" x2="855" y2="210" />
      <circle strokeWidth="2.5" cx="190" cy="212" r="46" />
      <circle strokeWidth="1.5" cx="190" cy="212" r="18" />
      <circle strokeWidth="2.5" cx="700" cy="212" r="46" />
      <circle strokeWidth="1.5" cx="700" cy="212" r="18" />
      <path strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" d="M175,150 C210,115 250,95 320,92 L465,92 C505,80 555,80 595,95" />
      <path strokeWidth="1.5" strokeDasharray="2 6" d="M190,166 C300,140 400,185 450,150 C500,115 600,150 700,166" />
      <circle strokeWidth="1.5" cx="450" cy="150" r="10" />
      <rect width="8" height="8" fill="currentColor" stroke="none" x="446" y="146" transform="rotate(45 450 150)" />
      <line strokeWidth="1" x1="190" y1="270" x2="190" y2="280" />
      <line strokeWidth="1" x1="700" y1="270" x2="700" y2="280" />
      <line strokeWidth="1" strokeDasharray="3 3" x1="190" y1="275" x2="700" y2="275" />
    </svg>
  );
}

// Máscara circular com leve inércia (lerp por frame) que revela a camada
// de contraste total do corte técnico só ao redor do cursor.
function useCursorReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -9999, y: -9999 });
  const current = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf: number;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;
      if (maskRef.current) {
        maskRef.current.style.clipPath = `circle(170px at ${current.current.x}px ${current.current.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return { containerRef, maskRef, onMouseMove };
}

// Bloco de título de seção (Eyebrow + heading + parágrafo) que entra com
// fade + leve translação ao rolar até ele — dá movimento à página sem
// depender de scroll-jacking. Só anima transform/opacity (Motion já cuida
// de rodar isso fora do main thread) e respeita prefers-reduced-motion.
function Reveal({
  children, className = "", style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Título que entra desfocado e ganha foco ao rolar até ele — inspirado na
// referência que o usuário trouxe (digitaera.com), aplicado só nos títulos
// de seção (o Hero já tem sua própria entrada, tocada ao carregar a página,
// não ao rolar).
function BlurIn({
  children, className = "", style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={className}
      style={{ ...style, display: "inline-block" }}
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(14px)", y: 14 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}

// Losango — mesma assinatura visual do marcador orbital do hero, reaproveitada
// como bullet/separador em outros pontos do site.
function Diamond({ size = 6, color = "#004BBE" }: { size?: number; color?: string }) {
  return (
    <span
      className="inline-block flex-shrink-0"
      style={{ width: size, height: size, background: color, transform: "rotate(45deg)" }}
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-px" style={{ background: "#004BBE" }} />
      <p className="label" style={{ color: "#004BBE" }}>{children}</p>
    </div>
  );
}

// ─── icons (linha fina, minimalistas) ──────────────────────────────────────────
const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;

function IconSliders() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" /><circle cx="9" cy="6" r="1.8" />
      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" /><circle cx="15" cy="12" r="1.8" />
      <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" /><circle cx="11" cy="18" r="1.8" />
    </svg>
  );
}
function IconGauge() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <path strokeLinecap="round" d="M4 16a8 8 0 0116 0" />
      <path strokeLinecap="round" d="M12 16l4-5" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <rect x="3" y="7" width="18" height="12" rx="1.5" />
      <path strokeLinecap="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 11.5a8 8 0 01-8 8 7.9 7.9 0 01-3.9-1L4 20l1.1-4.5a7.9 7.9 0 01-1-3.9 8 8 0 018-8h.4a8 8 0 018 7.6v.3z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 6.5l8.5 6 8.5-6" />
    </svg>
  );
}
// ─── Marquee strip ────────────────────────────────────────────────────────────
const ITEMS = ["CONTROLE EM CADA ETAPA", "SUPRIMENTO PARA SUA OPERAÇÃO", "GENUÍNA PEÇAS PRIME", "PRECISÃO NA SELEÇÃO"];

function Marquee({ dark, separator = "◆" }: { dark?: boolean; separator?: string }) {
  const doubled = [...ITEMS, ...ITEMS];
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="overflow-hidden py-3.5 flex items-center marquee-fade"
      style={{ background: dark ? "#004BBE" : "#0B0E1A" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex animate-marquee whitespace-nowrap gap-0"
        style={{ width: "max-content", animationPlayState: paused ? "paused" : "running" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="label inline-flex items-center gap-6 px-6" style={{ color: "white" }}>
            {item}
            <span style={{ color: dark ? "rgba(255,255,255,0.4)" : "#004BBE" }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Orbital diagram (hero visual) ─────────────────────────────────────────────
// Círculos concêntricos + marcador orbital girando — sem o card/logo central,
// pra poder ser reaproveitado como decoração atrás de outros elementos. Ocupa
// 100% do elemento pai (o pai é quem define o tamanho real, em px).
function OrbitalRings({ duration = 26 }: { duration?: number }) {
  return (
    <>
      {[100, 76, 52].map((pct, i) => (
        <div
          key={pct}
          className="absolute rounded-full orbit-ring"
          style={{
            width: `${pct}%`, height: `${pct}%`,
            left: `${(100 - pct) / 2}%`, top: `${(100 - pct) / 2}%`,
            border: "1px dashed rgba(0,75,190,0.28)",
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
            "--ring-duration": `${duration * (2.6 - i * 0.6)}s`,
          } as React.CSSProperties}
        />
      ))}
      <div className="absolute inset-0 orbit-marker" style={{ "--orbit-duration": `${duration}s` } as React.CSSProperties}>
        <div
          className="absolute"
          style={{
            top: 0, left: "50%", width: "14px", height: "14px",
            background: "#004BBE", transform: "translate(-50%, -50%) rotate(45deg)",
            boxShadow: "0 0 0 6px rgba(0,75,190,0.12)",
          }}
        />
      </div>
    </>
  );
}

// Logo em 3 partes que caem de fora da tela e pousam na posição final, em
// sequência: "Peças Prime" primeiro, depois "Genuína", e o "G" por último.
function AnimatedLogo() {
  const gRef = useRef<HTMLImageElement>(null);
  const genuinaRef = useRef<HTMLImageElement>(null);
  const pecasRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const els = [pecasRef.current, genuinaRef.current, gRef.current];
    if (els.some((el) => !el)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(els, { yPercent: -240, opacity: 0 });

    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      tl = gsap.timeline();
      tl.to(pecasRef.current, { yPercent: 0, opacity: 1, duration: 0.8, ease: "back.out(1.6)" })
        .to(genuinaRef.current, { yPercent: 0, opacity: 1, duration: 0.8, ease: "back.out(1.6)" }, "-=0.35")
        .to(gRef.current, { yPercent: 0, opacity: 1, duration: 0.8, ease: "back.out(1.6)" }, "-=0.35");
    };

    // Só começa a cair depois que a cortina de carregamento (PageLoadReveal)
    // termina — senão a animação corre inteira escondida atrás do overlay.
    if ((window as unknown as { __gppRevealDone?: boolean }).__gppRevealDone) {
      play();
    } else {
      window.addEventListener("gpp:reveal-done", play, { once: true });
    }

    return () => {
      window.removeEventListener("gpp:reveal-done", play);
      tl?.kill();
    };
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "662 / 377" }} role="img" aria-label="Genuína Peças Prime">
      <img ref={gRef} src={`${import.meta.env.BASE_URL}logo-g.png`} alt="" className="absolute" style={{ left: "41.69%", top: "10.08%", width: "20.24%" }} />
      <img ref={genuinaRef} src={`${import.meta.env.BASE_URL}logo-genuina.png`} alt="" className="absolute" style={{ left: "14.65%", top: "39.52%", width: "74.47%" }} />
      <img ref={pecasRef} src={`${import.meta.env.BASE_URL}logo-pecasprime.png`} alt="" className="absolute" style={{ left: "12.08%", top: "69.23%", width: "75.38%" }} />
    </div>
  );
}

function OrbitalDiagram() {
  const size = "min(546px, 90vw)";
  const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>();
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, aspectRatio: "1 / 1" }}>
        <div className="absolute inset-0">
          <OrbitalRings />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={tiltRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="bg-white flex items-center justify-center p-8"
            style={{
              width: "58%", aspectRatio: "1 / 1", borderRadius: "20px",
              boxShadow: "var(--shadow-block)",
              transition: "transform 0.35s ease-out",
              transformStyle: "preserve-3d",
            }}
          >
            <AnimatedLogo />
          </div>
        </div>
      </div>
      <p className="label mt-6 text-center" style={{ color: "#9AA0B4" }}>
        Sistema de distribuição / identidade Prime
      </p>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { containerRef, maskRef, onMouseMove } = useCursorReveal();
  return (
    <section className="relative flex flex-col bg-grain" style={{ background: "#F5F6FA" }}>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        className="relative grid grid-cols-1 lg:grid-cols-[55%_45%] items-center max-w-screen-xl mx-auto px-8 lg:px-16 w-full pt-40 pb-24 gap-16"
      >
        {/* corte técnico revelado pelo cursor — camada base quase invisível
            + camada de contraste total recortada por um círculo que segue
            o mouse com leve inércia */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none" style={{ color: "#004BBE", opacity: 0.05, zIndex: 0 }}>
          <CarCutaway style={{ position: "absolute", width: "760px", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }} />
        </div>
        <div
          ref={maskRef}
          className="hidden lg:block absolute inset-0 pointer-events-none"
          style={{ color: "#004BBE", opacity: 0.6, zIndex: 0, clipPath: "circle(0px at -999px -999px)" }}
        >
          <CarCutaway style={{ position: "absolute", width: "760px", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }} />
        </div>
        <img
          src={geralProImg}
          alt="Linha completa de produtos Genuína Peças Prime"
          className="hidden lg:block absolute object-contain pointer-events-none"
          style={{ left: "-320px", bottom: "70px", width: "360px", zIndex: 0 }}
        />
        <div className="relative animate-fade-up" style={{ animationDelay: "80ms", zIndex: 1 }}>
          <h1
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "var(--text-display-hero)", color: "#0B0E1A" }}
          >
            Original em qualidade,<br />
            <span className="text-shine">Genuína em confiança.</span>
          </h1>

          <p className="text-base leading-relaxed mb-10" style={{ color: "#5C6070", maxWidth: "480px" }}>
            Componentes hidráulicos e mecânicos selecionados para quem trabalha com precisão. A Genuína Peças Prime conecta especialização, controle e abastecimento confiável em uma operação feita para o profissional automotivo.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-16">
            <a
              href="#especialidades"
              className="btn-shine label inline-flex items-center gap-2 px-6 py-3.5 transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-100"
              style={{ background: "#004BBE", color: "white", borderRadius: "6px" }}
            >
              Conheça nossas linhas <span aria-hidden>↘</span>
            </a>
            <a
              href="#contato"
              className="label inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#004BBE" }}
            >
              Falar com um consultor <span aria-hidden>→</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="label" style={{ color: "#004BBE" }}>01 / 04</span>
            <span className="label" style={{ color: "#9AA0B4" }}>OPERAÇÃO INDEPENDENTE</span>
            <span className="label" style={{ color: "#9AA0B4" }}>CAMPINAS, SP</span>
          </div>
        </div>

        <div className="hidden lg:flex animate-fade-up" style={{ animationDelay: "220ms" }}>
          <OrbitalDiagram />
        </div>
      </div>

      <Marquee separator="·" />
    </section>
  );
}

// ─── Differential item (usado em "O que nos move") ────────────────────────────
function DiffItem({ icon, title, text, delay = 0 }: { icon: React.ReactNode; title: string; text: string; delay?: number }) {
  const { ref: spotRef, onMouseMove } = useSpotlight<HTMLDivElement>();
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={spotRef}
      onMouseMove={onMouseMove}
      className="spotlight-card py-10 px-8 lg:px-10"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-end mb-10" style={{ width: "22px", height: "22px", color: "#004BBE", marginLeft: "auto" }}>
        {icon}
      </div>
      <h4 className="font-bold mb-3" style={{ color: "#fff", fontSize: "1.15rem" }}>{title}</h4>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "26ch" }}>{text}</p>
    </motion.div>
  );
}

// ─── Method step (usado em "Nosso Método") — entrada escalonada por índice ────
function MethodStep({ n, title, text, last, delay = 0 }: { n: string; title: string; text: string; last?: boolean; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="group flex items-start justify-between gap-6 py-7"
      style={{ borderBottom: last ? "none" : "1px solid #E2E4EE" }}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start gap-6">
        <span
          className="font-display font-bold transition-colors duration-300 text-[#E2E4EE] group-hover:text-[#004BBE]"
          style={{ fontSize: "2.25rem", lineHeight: 1 }}
        >
          {n}
        </span>
        <div className="pt-1.5">
          <div className="flex items-center gap-2.5 mb-1">
            <Diamond size={5} />
            <h4 className="font-bold" style={{ color: "#0B0E1A" }}>{title}</h4>
          </div>
          <p className="text-sm" style={{ color: "#5C6070" }}>{text}</p>
        </div>
      </div>
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: "#9AA0B4" }}
      >
        →
      </span>
    </motion.div>
  );
}

// ─── Specialty card (usado em "Especialidades") ───────────────────────────────
// ─── Product carousel (usado em "Especialidades") — faixa contínua, navegação por seta ─
const PRODUCTS = [
  {
    tag: "HID", title: "Bomba de Direção Hidráulica",
    description: "Pressão e resposta consistente para o acionamento do sistema de direção.",
    image: bombaProImg,
  },
  {
    tag: "MEC", title: "Kit de Embreagem",
    description: "Conjunto completo para transmitir e controlar o movimento do veículo.",
    image: embreagemProImg,
  },
  {
    tag: "HID", title: "Kit de Reparo da Caixa de Direção",
    description: "Vedações e componentes para o reparo completo do sistema de direção.",
    image: reparoProImg,
  },
  {
    tag: "HID", title: "Reservatório de Fluido",
    description: "Reservatório para o fluido do sistema de direção hidráulica.",
    image: reservaProImg,
  },
  {
    tag: "HID", title: "Caixa de Direção Hidráulica",
    description: "Caixa de direção hidráulica completa, pronta para instalação com precisão.",
    image: caixaProImg,
  },
  {
    tag: "HID", title: "Cremalheira de Direção",
    description: "Eixo de precisão para o funcionamento correto da caixa de direção.",
    image: cremaProImg,
  },
  {
    tag: "MEC", title: "Caixa de Direção Mecânica",
    description: "Caixa de direção mecânica completa, para sistemas elétricos, pronta para instalação com precisão.",
    image: mecaProImg,
  },
];

const PRODUCT_CARD_WIDTH = 372;
const PRODUCT_CARD_GAP = 24;

function ProductSlide({ product, number }: { product: (typeof PRODUCTS)[number]; number: string }) {
  const [hovered, setHovered] = useState(false);
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="spotlight-card relative flex-shrink-0 p-6 flex flex-col transition-all duration-300"
      style={{
        width: `${PRODUCT_CARD_WIDTH}px`,
        background: "#fff",
        border: "1px solid #E2E4EE",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 32px rgba(11,14,26,0.1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="label" style={{ color: "#9AA0B4" }}>PRODUTO / {number}</p>
        <span className="label px-2 py-1" style={{ border: "1px solid #E2E4EE", color: "#5C6070" }}>{product.tag}</span>
      </div>
      <div className="relative flex items-center justify-center mb-6" style={{ height: "140px" }}>
        <img
          src={product.image}
          alt={product.title}
          className="object-contain"
          style={{
            maxHeight: "140px", maxWidth: "100%",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
      <h3 className="font-display font-bold leading-tight mb-2" style={{ fontSize: "1.2rem", color: "#0B0E1A" }}>{product.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "#5C6070" }}>{product.description}</p>
    </div>
  );
}

function ProductCarousel() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const total = PRODUCTS.length;
  // último índice que ainda mostra a faixa completa até a borda, sem sobrar
  // espaço vazio depois do último card
  const maxIndex = Math.max(0, total - visibleCount);

  useEffect(() => {
    if (!containerRef.current) return;
    const step = PRODUCT_CARD_WIDTH + PRODUCT_CARD_GAP;
    const measure = () => {
      const width = containerRef.current?.offsetWidth ?? 0;
      setVisibleCount(Math.max(1, Math.round((width + PRODUCT_CARD_GAP) / step)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const go = (dir: number) => {
    setIndex((i) => {
      const next = i + dir;
      if (next > maxIndex) return 0;
      if (next < 0) return maxIndex;
      return next;
    });
  };

  // auto-rolagem a cada 2s — pausa no hover e desliga com prefers-reduced-motion
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => go(1), 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, reduceMotion, maxIndex]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: `${PRODUCT_CARD_GAP}px`,
            transform: `translateX(-${Math.min(index, maxIndex) * (PRODUCT_CARD_WIDTH + PRODUCT_CARD_GAP)}px)`,
            transition: "transform 600ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <ProductSlide key={p.title} product={p} number={String(i + 1).padStart(2, "0")} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 mt-8">
        <motion.button
          onClick={() => go(-1)}
          aria-label="Produto anterior"
          className="flex items-center justify-center transition-colors duration-200 hover:border-[#004BBE] hover:bg-[#F5F6FA]"
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E4EE", color: "#004BBE" }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span aria-hidden>←</span>
        </motion.button>
        <span className="label" style={{ color: "#9AA0B4" }}>
          {String(Math.min(index, maxIndex) + 1).padStart(2, "0")} / {String(maxIndex + 1).padStart(2, "0")}
        </span>
        <motion.button
          onClick={() => go(1)}
          aria-label="Próximo produto"
          className="flex items-center justify-center transition-colors duration-200 hover:border-[#004BBE] hover:bg-[#F5F6FA]"
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E4EE", color: "#004BBE" }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span aria-hidden>→</span>
        </motion.button>
      </div>
    </div>
  );
}

// ─── Contact form (envio real via Web3Forms) ──────────────────────────────────
const WEB3FORMS_ACCESS_KEY = "b67d4d4f-e982-4cb6-892c-2a1908299ef1";

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nome = String(data.get("nome") ?? "");

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: (() => {
          data.append("access_key", WEB3FORMS_ACCESS_KEY);
          data.append("subject", `Novo contato via site — ${nome}`);
          data.append("from_name", "Site Genuína Peças Prime");
          return data;
        })(),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="p-8 lg:p-10" style={{ background: "#F5F6FA", border: "1px solid #E2E4EE" }}>
      <p className="label mb-6" style={{ color: "#9AA0B4" }}>FORMULÁRIO DE CONTATO / RESPOSTA DIRETA</p>
      <form onSubmit={handleSubmit}>
        {/* honeypot anti-spam — invisível pra gente, bots costumam preencher */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="contato-nome" className="label mb-2 block" style={{ color: "#5C6070" }}>SEU NOME</label>
            <input
              id="contato-nome"
              name="nome" required type="text" placeholder="Como podemos chamar você?"
              autoComplete="name"
              disabled={status === "sending"}
              className="w-full px-4 py-3 text-sm bg-white placeholder:opacity-40 transition-colors duration-200"
              style={{ border: "1px solid #E2E4EE", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <label htmlFor="contato-email" className="label mb-2 block" style={{ color: "#5C6070" }}>E-MAIL PROFISSIONAL</label>
            <input
              id="contato-email"
              name="email" required type="email" placeholder="nome@empresa.com.br"
              autoComplete="email" spellCheck={false}
              disabled={status === "sending"}
              className="w-full px-4 py-3 text-sm bg-white placeholder:opacity-40 transition-colors duration-200"
              style={{ border: "1px solid #E2E4EE", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
        <label htmlFor="contato-mensagem" className="label mb-2 block" style={{ color: "#5C6070" }}>COMO PODEMOS AJUDAR?</label>
        <textarea
          id="contato-mensagem"
          name="mensagem" required rows={4} placeholder="Descreva sua necessidade, aplicação ou linha de interesse."
          disabled={status === "sending"}
          className="w-full px-4 py-3 text-sm bg-white placeholder:opacity-40 resize-none mb-6 transition-colors duration-200"
          style={{ border: "1px solid #E2E4EE", fontFamily: "'Inter', sans-serif" }}
        />

        <div className="flex items-center gap-4 flex-wrap">
          <motion.button
            type="submit"
            disabled={status === "sending"}
            className="btn-shine label inline-flex items-center gap-2 px-8 py-4 transition-opacity duration-200 hover:opacity-90"
            style={{ background: "#004BBE", color: "white", borderRadius: "6px", opacity: status === "sending" ? 0.6 : 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            {status === "sending" ? "Enviando…" : "Enviar mensagem"} <span aria-hidden>→</span>
          </motion.button>
          {status === "success" && (
            <span className="text-sm" role="status" aria-live="polite" style={{ color: "#004BBE" }}>Mensagem enviada — retornamos em breve.</span>
          )}
          {status === "error" && (
            <span className="text-sm" role="status" aria-live="polite" style={{ color: "#c0392b" }}>Não deu pra enviar agora. Tenta de novo em instantes.</span>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
    <PageLoadReveal>
    <div id="top" style={{ background: "#ffffff" }}>

      <Hero />

      {/* ═══ QUEM SOMOS ══════════════════════════════════════════════════════ */}
      <section id="quem-somos" className="relative overflow-hidden bg-grain" style={{ background: "#fff", borderBottom: "1px solid #E2E4EE" }}>
        <img
          src={embreagemProImg}
          alt="Kit de embreagem Genuína Peças Prime"
          className="hidden lg:block absolute object-contain pointer-events-none"
          style={{ left: "64px", bottom: "0", width: "220px" }}
        />
        <div className="relative container-gpp section-gpp">
          <Reveal className="text-center mb-14" style={{ maxWidth: "720px", marginInline: "auto" }}>
            <div className="flex justify-center">
              <Eyebrow>01 / QUEM SOMOS</Eyebrow>
            </div>
            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
            >
              <BlurIn>Toda peça carrega<br /><span className="text-shine">nosso compromisso.</span></BlurIn>
            </h2>
            <p className="font-medium leading-snug mt-6" style={{ color: "#0B0E1A", fontSize: "1.35rem" }}>
              Não vendemos apenas peças. Entregamos <span className="text-shine">segurança</span> e{" "}
              <span className="text-shine">qualidade</span> em cada escolha.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card-gpp p-8">
              <p className="text-sm leading-snug" style={{ color: "#5C6070" }}>
                Uma nova marca independente, criada para tornar a rotina de oficinas, distribuidores e profissionais mais previsível.
              </p>
            </div>
            <div className="card-gpp p-8">
              <p className="text-sm leading-snug" style={{ color: "#5C6070" }}>
                A Genuína Peças Prime nasce em Campinas para atender o mercado automotivo com um olhar direto sobre o que realmente importa: aplicação correta, informação clara e produto em que se pode confiar.
              </p>
            </div>
            <div className="card-gpp p-8">
              <p className="text-sm leading-snug" style={{ color: "#5C6070" }}>
                Nosso trabalho começa antes do pedido e continua depois da entrega. Ouvimos a necessidade, entendemos o cenário e orientamos cada decisão com linguagem técnica, sem atalhos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-14 pt-6" style={{ borderTop: "1px solid #E2E4EE" }}>
            <span className="label" style={{ color: "#004BBE" }}>GPP / OPERAÇÃO</span>
            <Diamond size={5} />
            <span className="label" style={{ color: "#9AA0B4" }}>HIDRÁULICA E MECÂNICA</span>
            <Diamond size={5} color="#E2E4EE" />
            <span className="label" style={{ color: "#9AA0B4" }}>ATENDIMENTO CONSULTIVO</span>
            <Diamond size={5} color="#E2E4EE" />
            <span className="label" style={{ color: "#9AA0B4" }}>SELEÇÃO RESPONSÁVEL</span>
          </div>
        </div>
      </section>

      {/* ═══ O QUE NOS MOVE ══════════════════════════════════════════════════ */}
      <section id="o-que-nos-move" className="relative overflow-hidden bg-grain" style={{ background: "#0B0E1A" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,75,190,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(0,75,190,0.14) 1px, transparent 1px)`,
            backgroundSize: "104px 104px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 15% 0%, rgba(0,75,190,0.14) 0%, transparent 55%)" }}
        />
        <div className="relative container-gpp section-gpp">
          <Reveal className="mb-14" style={{ maxWidth: "620px" }}>
            <Eyebrow>02 / O QUE NOS MOVE</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#fff" }}
            >
              <BlurIn>Confiança não é discurso.<br />É processo.</BlurIn>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "48ch" }}>
              Quatro compromissos orientam cada contato, cada seleção e cada etapa da nossa distribuição.
            </p>
          </Reveal>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-white/10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <DiffItem icon={<IconSliders />} title="Seleção criteriosa" text="Portfólio construído com atenção à aplicação, procedência e consistência do componente." delay={0} />
            <DiffItem icon={<IconGauge />} title="Conhecimento técnico" text="A conversa começa no problema real, não em uma lista genérica de itens." delay={80} />
            <DiffItem icon={<IconShieldCheck />} title="Controle e clareza" text="Informação objetiva para reduzir ruído e dar segurança à sua decisão." delay={160} />
            <DiffItem icon={<IconBriefcase />} title="Abastecimento confiável" text="Uma operação organizada para apoiar o ritmo de quem precisa manter tudo em movimento." delay={240} />
          </div>
        </div>
      </section>

      {/* ═══ ESPECIALIDADES ══════════════════════════════════════════════════ */}
      <section id="especialidades" className="relative overflow-hidden bg-grain" style={{ borderBottom: "1px solid #E2E4EE" }}>
        <div className="relative container-gpp section-gpp">
          <Reveal className="mb-12" style={{ maxWidth: "620px" }}>
            <Eyebrow>03 / ESPECIALIDADES</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
            >
              <BlurIn>Produtos com critério.<br /><span className="text-shine">Um padrão de exigência.</span></BlurIn>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#9AA0B4", maxWidth: "48ch" }}>
              Alguns itens das nossas linhas hidráulica e mecânica. A seleção é o começo da conversa, não um catálogo de compra.
            </p>
          </Reveal>

          <div className="relative">
            {/* anel orbital espiando por trás da faixa de produtos */}
            <div
              className="hidden lg:block absolute pointer-events-none"
              style={{ width: "380px", height: "380px", top: "30%", left: "-190px", zIndex: 0 }}
            >
              <OrbitalRings duration={22} />
            </div>
            <div className="relative" style={{ zIndex: 1 }}>
              <ProductCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NOSSO MÉTODO ════════════════════════════════════════════════════ */}
      <section id="nosso-metodo" className="relative overflow-hidden bg-grain" style={{ borderBottom: "1px solid #E2E4EE" }}>
        <img
          src={bombaProImg}
          alt="Bomba hidráulica Genuína Peças Prime"
          className="hidden lg:block absolute object-contain pointer-events-none"
          style={{ right: "64px", bottom: "0", width: "220px" }}
        />
        <div className="relative container-gpp section-gpp grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <Eyebrow>04 / NOSSO MÉTODO</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
            >
              <BlurIn>Menos ruído.<br /><span className="text-shine">Mais controle.</span></BlurIn>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C6070", maxWidth: "360px" }}>
              Uma abordagem consultiva para transformar uma demanda técnica em uma decisão bem fundamentada.
            </p>
          </Reveal>

          <div>
            {[
              ["01", "Escutamos a aplicação", "Entendemos a necessidade técnica, o veículo e o contexto da sua operação."],
              ["02", "Orientamos com clareza", "Organizamos as informações para que a escolha seja segura e objetiva."],
              ["03", "Selecionamos com critério", "A linha é composta para atender com consistência, sem excesso ou improviso."],
              ["04", "Acompanhamos o fluxo", "Mantemos uma relação próxima para que o abastecimento acompanhe seu ritmo."],
            ].map(([n, title, text], i) => (
              <MethodStep key={n} n={n} title={title} text={text} last={i === 3} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VAMOS CONVERSAR ═════════════════════════════════════════════════ */}
      <section id="contato" className="relative overflow-hidden bg-grain" style={{ background: "#fff", borderTop: "1px solid #E2E4EE" }}>
        {/* 1/4 do anel orbital espiando do canto inferior esquerdo */}
        <div
          className="hidden lg:block absolute pointer-events-none"
          style={{ width: "544px", height: "544px", left: "-272px", bottom: "-272px", zIndex: 0 }}
        >
          <OrbitalRings duration={30} />
        </div>

        <div className="relative container-gpp section-gpp grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" style={{ zIndex: 1 }}>
          <Reveal>
            <Eyebrow>05 / VAMOS CONVERSAR</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", color: "#0B0E1A" }}
            >
              <BlurIn>Sua operação<br />pede <span className="text-shine">precisão</span>?</BlurIn>
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: "#5C6070", maxWidth: "420px" }}>
              Conte o que você precisa. Nossa equipe está pronta para entender sua aplicação e indicar o próximo passo com objetividade.
            </p>

            <div className="space-y-5 pt-6" style={{ borderTop: "1px solid #E2E4EE" }}>
              {[
                { icon: <IconChat />, label: "WhatsApp", value: "Falar pelo WhatsApp", href: "https://wa.me/5519999999999" },
                { icon: <IconMail />, label: "E-mail", value: "contato@genuinapecasprime.com.br" },
              ].map((item) => {
                const Tag = item.href ? "a" : "div";
                return (
                  <Tag
                    key={item.label}
                    {...(item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 group"
                    style={item.href ? { cursor: "pointer" } : undefined}
                  >
                    <div style={{ width: "20px", height: "20px", color: "#004BBE" }}>{item.icon}</div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#0B0E1A" }}>{item.label}</p>
                      <p
                        className="text-sm transition-colors duration-200"
                        style={{ color: item.href ? "#004BBE" : "#5C6070" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </Tag>
                );
              })}
            </div>
          </Reveal>

          <ContactForm />
        </div>
      </section>
    </div>
    </PageLoadReveal>
    </MotionConfig>
  );
}
