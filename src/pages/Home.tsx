import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PageLoadReveal from "../components/PageLoadReveal";
import embreagemProImg from "@/assets/products/embreagempro.png";
import bombaProImg from "@/assets/products/bombapro.png";
import geralProImg from "@/assets/products/geralpro.png";
import reparoProImg from "@/assets/products/reparopro.png";
import caixaProImg from "@/assets/products/caixapro2.png";
import reservaProImg from "@/assets/products/reservapro.png";
import direcampLogo from "@/assets/clients-direcamp-white.png";
import sejaLogo from "@/assets/clients-seja-white.png";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
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

// Anima um valor tipo "500+" contando de 0 até o número quando entra na viewport.
function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const { ref, visible } = useInView(0.5);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const duration = 1100;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);

  return <span ref={ref}>{match ? n : ""}{suffix}</span>;
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
function IconPhone() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 5a1.5 1.5 0 011.5-1.5h2.1a1 1 0 01.97.76l.8 3.2a1 1 0 01-.27.96L7.3 9.7a12.5 12.5 0 006.9 6.9l1.28-1.3a1 1 0 01.96-.27l3.2.8a1 1 0 01.76.97V19a1.5 1.5 0 01-1.5 1.5h-1C9.7 20.5 3.5 14.3 3.5 6.5v-1.5z" />
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
function IconPin() {
  return (
    <svg {...iconProps} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5s7-6.3 7-11.7a7 7 0 10-14 0c0 5.4 7 11.7 7 11.7z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </svg>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────────
const ITEMS = ["CONTROLE EM CADA ETAPA", "SUPRIMENTO PARA SUA OPERAÇÃO", "GENUÍNA PEÇAS PRIME", "PRECISÃO NA SELEÇÃO"];

function Marquee({ dark, separator = "◆" }: { dark?: boolean; separator?: string }) {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div
      className="overflow-hidden py-3.5 flex items-center"
      style={{ background: dark ? "#004BBE" : "#0B0E1A" }}
    >
      <div className="flex animate-marquee whitespace-nowrap gap-0" style={{ width: "max-content" }}>
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

// ─── Clients marquee ────────────────────────────────────────────────────────
const CLIENT_LOGOS = [
  { name: "Direcamp Distribuidora de Peças", src: direcampLogo, scale: 1 },
  { name: "Seja Distribuidora", src: sejaLogo, scale: 1.25 },
];
// repete a lista pra preencher a faixa e permitir o loop contínuo
const CLIENT_SLOTS = Array.from({ length: 6 }, (_, i) => CLIENT_LOGOS[i % CLIENT_LOGOS.length]);

function ClientLogoTile({ logo }: { logo: { name: string; src: string; scale?: number } }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 mx-7"
      style={{ width: "104px", height: "48px" }}
    >
      <img
        src={logo.src}
        alt={logo.name}
        className="max-w-full max-h-full object-contain"
        style={{ transform: `scale(${logo.scale ?? 1})` }}
      />
    </div>
  );
}

function ClientsMarquee() {
  const doubled = [...CLIENT_SLOTS, ...CLIENT_SLOTS];
  return (
    <section className="relative overflow-hidden" style={{ background: "#0B0E1A" }}>
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
      <div className="relative max-w-screen-xl mx-auto px-8 lg:px-10 pt-16 pb-10">
        <Eyebrow>NOSSOS CLIENTES</Eyebrow>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "480px" }}>
          Parceiros que já contam com a Genuína Peças Prime em suas operações.
        </p>
      </div>
      <div className="relative overflow-hidden pb-16">
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((logo, i) => <ClientLogoTile key={i} logo={logo} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Orbital diagram (hero visual) ─────────────────────────────────────────────
// Círculos concêntricos + marcador orbital girando — sem o card/logo central,
// pra poder ser reaproveitado como decoração atrás de outros elementos. Ocupa
// 100% do elemento pai (o pai é quem define o tamanho real, em px).
function OrbitalRings({ duration = 26 }: { duration?: number }) {
  return (
    <>
      {[100, 76, 52].map((pct) => (
        <div
          key={pct}
          className="absolute rounded-full"
          style={{
            width: `${pct}%`, height: `${pct}%`,
            left: `${(100 - pct) / 2}%`, top: `${(100 - pct) / 2}%`,
            border: "1px dashed rgba(0,75,190,0.28)",
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ animation: `orbit ${duration}s linear infinite` }}>
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
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, aspectRatio: "1 / 1" }}>
        <div className="absolute inset-0">
          <OrbitalRings />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white flex items-center justify-center p-8"
            style={{ width: "58%", aspectRatio: "1 / 1", borderRadius: "20px", boxShadow: "0 24px 50px rgba(11,14,26,0.14)" }}
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
  return (
    <section className="relative flex flex-col" style={{ background: "#F5F6FA" }}>
      <div className="relative grid grid-cols-1 lg:grid-cols-[55%_45%] items-center max-w-screen-xl mx-auto px-8 lg:px-16 w-full pt-40 pb-24 gap-16">
        <img
          src={geralProImg}
          alt="Linha completa de produtos Genuína Peças Prime"
          className="hidden lg:block absolute object-contain pointer-events-none"
          style={{ left: "-320px", bottom: "70px", width: "360px", zIndex: 0 }}
        />
        <div className="relative animate-fade-up" style={{ animationDelay: "80ms", zIndex: 1 }}>
          <Eyebrow>DISTRIBUIÇÃO TÉCNICA / CAMPINAS – SP</Eyebrow>

          <h1
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 4.8vw, 3.75rem)", color: "#0B0E1A" }}
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
              className="label inline-flex items-center gap-2 px-6 py-3.5 transition-all duration-200 hover:opacity-90 hover:scale-105"
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
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className="py-10 px-8 lg:px-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="flex items-start justify-end mb-10" style={{ width: "22px", height: "22px", color: "#004BBE", marginLeft: "auto" }}>
        {icon}
      </div>
      <h4 className="font-bold mb-3" style={{ color: "#fff", fontSize: "1.15rem" }}>{title}</h4>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "26ch" }}>{text}</p>
    </div>
  );
}

// ─── Method step (usado em "Nosso Método") — entrada escalonada por índice ────
function MethodStep({ n, title, text, last, delay = 0 }: { n: string; title: string; text: string; last?: boolean; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className="flex items-start justify-between gap-6 py-6"
      style={{
        borderBottom: last ? "none" : "1px solid #E2E4EE",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      <div className="flex items-start gap-6">
        <span className="label pt-1" style={{ color: "#004BBE" }}>{n}</span>
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Diamond size={5} />
            <h4 className="font-bold" style={{ color: "#0B0E1A" }}>{title}</h4>
          </div>
          <p className="text-sm" style={{ color: "#5C6070" }}>{text}</p>
        </div>
      </div>
      <span aria-hidden style={{ color: "#9AA0B4" }}>→</span>
    </div>
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
    tag: "MEC", title: "Caixa de Direção",
    description: "Caixa de direção completa, pronta para instalação com precisão.",
    image: caixaProImg,
  },
];

const PRODUCT_CARD_WIDTH = 372;
const PRODUCT_CARD_GAP = 24;

function ProductSlide({ product, number }: { product: (typeof PRODUCTS)[number]; number: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex-shrink-0 p-6 flex flex-col transition-all duration-300"
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
  const total = PRODUCTS.length;
  const maxIndex = total - 1;
  const go = (dir: number) => setIndex((i) => Math.min(maxIndex, Math.max(0, i + dir)));

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: `${PRODUCT_CARD_GAP}px`,
            transform: `translateX(-${index * (PRODUCT_CARD_WIDTH + PRODUCT_CARD_GAP)}px)`,
            transition: "transform 600ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <ProductSlide key={p.title} product={p} number={String(i + 1).padStart(2, "0")} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 mt-8">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Produto anterior"
          className="flex items-center justify-center transition-all duration-200 hover:opacity-70"
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E4EE", color: "#004BBE", opacity: index === 0 ? 0.35 : 1 }}
        >
          <span aria-hidden>←</span>
        </button>
        <span className="label" style={{ color: "#9AA0B4" }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          onClick={() => go(1)}
          disabled={index === maxIndex}
          aria-label="Próximo produto"
          className="flex items-center justify-center transition-all duration-200 hover:opacity-70"
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E4EE", color: "#004BBE", opacity: index === maxIndex ? 0.35 : 1 }}
        >
          <span aria-hidden>→</span>
        </button>
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
            <label className="label mb-2 block" style={{ color: "#5C6070" }}>SEU NOME</label>
            <input
              name="nome" required type="text" placeholder="Como podemos chamar você?"
              disabled={status === "sending"}
              className="w-full px-4 py-3 text-sm outline-none bg-white placeholder:opacity-40"
              style={{ border: "1px solid #E2E4EE", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <label className="label mb-2 block" style={{ color: "#5C6070" }}>E-MAIL PROFISSIONAL</label>
            <input
              name="email" required type="email" placeholder="nome@empresa.com.br"
              disabled={status === "sending"}
              className="w-full px-4 py-3 text-sm outline-none bg-white placeholder:opacity-40"
              style={{ border: "1px solid #E2E4EE", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
        <label className="label mb-2 block" style={{ color: "#5C6070" }}>COMO PODEMOS AJUDAR?</label>
        <textarea
          name="mensagem" required rows={4} placeholder="Descreva sua necessidade, aplicação ou linha de interesse."
          disabled={status === "sending"}
          className="w-full px-4 py-3 text-sm outline-none bg-white placeholder:opacity-40 resize-none mb-6"
          style={{ border: "1px solid #E2E4EE", fontFamily: "'Inter', sans-serif" }}
        />

        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            disabled={status === "sending"}
            className="label inline-flex items-center gap-2 px-8 py-4 transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "#004BBE", color: "white", borderRadius: "6px", opacity: status === "sending" ? 0.6 : 1 }}
          >
            {status === "sending" ? "Enviando..." : "Enviar mensagem"} <span aria-hidden>→</span>
          </button>
          {status === "success" && (
            <span className="text-sm" style={{ color: "#004BBE" }}>Mensagem enviada — retornamos em breve.</span>
          )}
          {status === "error" && (
            <span className="text-sm" style={{ color: "#c0392b" }}>Não deu pra enviar agora. Tenta de novo em instantes.</span>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Testimonial carousel (prévia de layout — exemplos, não depoimentos reais) ─
const TESTIMONIALS = [
  { role: "Oficina Mecânica", place: "Campinas / SP", quote: "Atendimento rápido e peça certa logo na primeira consulta. Facilita muito o dia a dia da oficina." },
  { role: "Distribuidor de Autopeças", place: "Interior de SP", quote: "Comunicação clara sobre prazo e disponibilidade — sem surpresa na hora da entrega." },
  { role: "Frota de Veículos Leves", place: "Região de Campinas", quote: "Padrão de qualidade consistente em todas as compras que fizemos até agora." },
  { role: "Oficina de Direção Hidráulica", place: "Campinas / SP", quote: "Equipe entende tecnicamente o que está vendendo — isso faz diferença na hora de decidir." },
  { role: "Retífica e Manutenção", place: "Interior de SP", quote: "Processo de compra direto e objetivo, sem enrolação." },
];

// clona o primeiro no final — permite avançar sem nunca "voltar" visualmente
const TESTIMONIALS_LOOP = [...TESTIMONIALS, TESTIMONIALS[0]];

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => clearInterval(id);
  }, [paused]);

  // ao chegar no clone (último item), espera a transição terminar e realinha
  // pro índice 0 real sem animação — o clone é idêntico, então o salto é invisível
  useEffect(() => {
    if (index !== TESTIMONIALS.length) return;
    const t = setTimeout(() => {
      setInstant(true);
      setIndex(0);
    }, 700);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (!instant) return;
    const raf = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(raf);
  }, [instant]);

  const activeDot = index % TESTIMONIALS.length;

  return (
    <div>
      <p className="label mb-6" style={{ color: "#9AA0B4" }}>DEPOIMENTOS</p>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: instant ? "none" : "transform 700ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {TESTIMONIALS_LOOP.map((t, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              <div
                className="relative p-8 flex flex-col"
                style={{ background: "#fff", border: "1px solid #E2E4EE", height: "220px" }}
              >
                <p className="text-base leading-relaxed mb-6 line-clamp-3" style={{ color: "#5C6070" }}>“{t.quote}”</p>
                <div className="flex items-center gap-3 pt-4 mt-auto" style={{ borderTop: "1px solid #E2E4EE" }}>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#F5F6FA" }}
                  >
                    <Diamond size={8} color="#9AA0B4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#0B0E1A" }}>{t.role}</p>
                    <p className="text-xs" style={{ color: "#9AA0B4" }}>{t.place}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setInstant(false); setIndex(i); }}
            aria-label={`Ver exemplo ${i + 1}`}
            style={{
              width: i === activeDot ? "18px" : "6px",
              height: "6px",
              background: i === activeDot ? "#004BBE" : "#E2E4EE",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <PageLoadReveal>
    <div id="top" style={{ background: "#ffffff" }}>

      <Hero />

      {/* ═══ QUEM SOMOS ══════════════════════════════════════════════════════ */}
      <section id="quem-somos" className="relative overflow-hidden" style={{ background: "#fff", borderBottom: "1px solid #E2E4EE" }}>
        <img
          src={embreagemProImg}
          alt="Kit de embreagem Genuína Peças Prime"
          className="hidden lg:block absolute object-contain pointer-events-none"
          style={{ left: "64px", bottom: "0", width: "220px" }}
        />
        <div className="relative max-w-screen-xl mx-auto px-8 lg:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start mb-14">
            <div>
              <Eyebrow>01 / QUEM SOMOS</Eyebrow>
              <h2
                className="font-display font-bold leading-tight"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
              >
                Distribuir é assumir<br /><span className="text-shine">responsabilidade técnica.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed lg:pt-3" style={{ color: "#9AA0B4" }}>
              Uma nova marca independente, criada para tornar a rotina de oficinas, distribuidores e profissionais mais previsível.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {[
              { value: "10+", label: "Anos de experiência da equipe no setor automotivo" },
              { value: "500+", label: "Produtos disponíveis no catálogo" },
              { value: "2", label: "Linhas especializadas: hidráulica e mecânica" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 transition-transform duration-300 ease-out hover:-translate-y-2"
                style={{ background: "#F5F6FA", border: "1px solid #E2E4EE" }}
              >
                <p className="font-display font-bold mb-1.5" style={{ fontSize: "1.5rem", color: "#004BBE" }}><CountUp value={stat.value} /></p>
                <p className="text-xs leading-snug" style={{ color: "#5C6070" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 pt-10" style={{ borderTop: "1px solid #E2E4EE" }}>
            <p className="font-medium leading-snug" style={{ color: "#0B0E1A", fontSize: "1.35rem" }}>
              Não somos apenas um ponto entre a indústria e a oficina. Somos o{" "}
              <span className="text-shine">critério</span> que organiza essa escolha.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <p className="text-sm leading-relaxed" style={{ color: "#5C6070" }}>
                A Genuína Peças Prime nasce em Campinas para atender o mercado automotivo com um olhar direto sobre o que realmente importa: aplicação correta, informação clara e produto em que se pode confiar.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#5C6070" }}>
                Nosso trabalho começa antes do pedido e continua depois da entrega. Ouvimos a necessidade, entendemos o cenário e orientamos cada decisão com linguagem técnica, sem atalhos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-14 pt-6" style={{ borderTop: "1px solid #E2E4EE" }}>
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
      <section id="o-que-nos-move" className="relative overflow-hidden" style={{ background: "#0B0E1A" }}>
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
        <div className="relative max-w-screen-xl mx-auto px-8 lg:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start mb-14">
            <div>
              <Eyebrow>02 / O QUE NOS MOVE</Eyebrow>
              <h2
                className="font-display font-bold leading-tight"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#fff" }}
              >
                Confiança não é discurso.<br />É processo.
              </h2>
            </div>
            <p className="text-sm leading-relaxed lg:pt-3" style={{ color: "rgba(255,255,255,0.4)" }}>
              Quatro compromissos orientam cada contato, cada seleção e cada etapa da nossa distribuição.
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
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
      <section id="especialidades" style={{ borderBottom: "1px solid #E2E4EE" }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start mb-12">
            <div>
              <Eyebrow>03 / ESPECIALIDADES</Eyebrow>
              <h2
                className="font-display font-bold leading-tight"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
              >
                Produtos com critério.<br /><span className="text-shine">Um padrão de exigência.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed lg:pt-3" style={{ color: "#9AA0B4" }}>
              Alguns itens das nossas linhas hidráulica e mecânica. A seleção é o começo da conversa, não um catálogo de compra.
            </p>
          </div>

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
      <section id="nosso-metodo" className="relative overflow-hidden" style={{ borderBottom: "1px solid #E2E4EE" }}>
        <img
          src={bombaProImg}
          alt="Bomba hidráulica Genuína Peças Prime"
          className="hidden lg:block absolute object-contain pointer-events-none"
          style={{ right: "64px", bottom: "0", width: "220px" }}
        />
        <div className="relative max-w-screen-xl mx-auto px-8 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Eyebrow>04 / NOSSO MÉTODO</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
            >
              Menos ruído.<br /><span className="text-shine">Mais controle.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C6070", maxWidth: "360px" }}>
              Uma abordagem consultiva para transformar uma demanda técnica em uma decisão bem fundamentada.
            </p>
          </div>

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

      {/* ═══ EM CONSTRUÇÃO ═══════════════════════════════════════════════════ */}
      <section id="em-construcao" style={{ background: "#EEF1FB" }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>RELAÇÕES QUE IMPORTAM</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "#0B0E1A" }}
            >
              Depoimentos<br />feitos por <span className="text-shine">parcerias reais.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C6070", maxWidth: "440px" }}>
              A Genuína Peças Prime está construindo sua rede com compromisso e responsabilidade.Este painel reune parceiros e depoimentos autorizados.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      <ClientsMarquee />

      {/* ═══ VAMOS CONVERSAR ═════════════════════════════════════════════════ */}
      <section id="contato" className="relative overflow-hidden" style={{ background: "#fff", borderTop: "1px solid #E2E4EE" }}>
        {/* 1/4 do anel orbital espiando do canto inferior esquerdo */}
        <div
          className="hidden lg:block absolute pointer-events-none"
          style={{ width: "544px", height: "544px", left: "-272px", bottom: "-272px", zIndex: 0 }}
        >
          <OrbitalRings duration={30} />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-8 lg:px-10 py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" style={{ zIndex: 1 }}>
          <div>
            <Eyebrow>05 / VAMOS CONVERSAR</Eyebrow>
            <h2
              className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", color: "#0B0E1A" }}
            >
              Sua operação<br />pede <span className="text-shine">precisão</span>?
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: "#5C6070", maxWidth: "420px" }}>
              Conte o que você precisa. Nossa equipe está pronta para entender sua aplicação e indicar o próximo passo com objetividade.
            </p>

            <div className="space-y-5 pt-6" style={{ borderTop: "1px solid #E2E4EE" }}>
              {[
                { icon: <IconPhone />, label: "Telefone", value: "(19) 3515-2040" },
                { icon: <IconChat />, label: "WhatsApp", value: "Falar pelo WhatsApp", href: "https://wa.me/5519999999999" },
                { icon: <IconMail />, label: "E-mail", value: "contato@genuinapecasprime.com.br" },
                { icon: <IconPin />, label: "Localização", value: "Campinas — São Paulo" },
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
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
    </PageLoadReveal>
  );
}
