import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import type { Board } from "../lib/types";

/*
 * Os fluxogramas vêm do Markdown já em Mermaid (`04-fluxogramas.md`), então o
 * app renderiza a própria fonte em vez de manter uma segunda representação em
 * coordenadas: o diagrama nunca sai de sincronia com a documentação.
 *
 * O tema é configurado uma vez, com as cores da identidade do app.
 */
let initialized = false;

function initMermaid() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    fontFamily: "Poppins, -apple-system, sans-serif",
    theme: "base",
    themeVariables: {
      primaryColor: "#eef1fb",
      primaryTextColor: "#23262e",
      primaryBorderColor: "#17339b",
      lineColor: "#7a8090",
      secondaryColor: "#fbfbf9",
      tertiaryColor: "#f5f5f1",
      fontSize: "13px",
      clusterBkg: "#f6f8fe",
      clusterBorder: "#c7d0ef",
    },
    flowchart: { curve: "basis", nodeSpacing: 40, rankSpacing: 50, useMaxWidth: false },
    sequence: { useMaxWidth: false },
    state: { useMaxWidth: false },
  });
}

interface MermaidBoardProps {
  board: Board;
  /** Modo compacto: sem controles de zoom, sem interação. */
  mini?: boolean;
}

export default function MermaidBoard({ board, mini = false }: MermaidBoardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  // Tamanho intrínseco do SVG; a caixa ocupa o tamanho já escalado, não o original.
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const source = board.mermaid;
    const host = hostRef.current;
    if (!host) return;
    if (!source) {
      host.innerHTML = "";
      setError("Este fluxograma não tem diagrama na documentação de origem.");
      return;
    }

    initMermaid();
    setError(null);
    // O id precisa ser único por render: o Mermaid deriva dele os ids dos
    // <defs>, marcadores e nós, e dois diagramas com o mesmo id na mesma
    // página disputariam os mesmos marcadores de seta.
    const id = `mmd-${board.docId.replace(/[^a-zA-Z0-9]/g, "")}-${mini ? "mini" : "full"}`;

    mermaid
      .render(id, source)
      .then(({ svg }) => {
        if (cancelled || !hostRef.current || !viewportRef.current) return;
        hostRef.current.innerHTML = svg;
        const el = hostRef.current.querySelector("svg");
        if (!el) return;

        // O Mermaid entrega o SVG com `max-width` e sem altura, contando com um
        // container de largura definida. Aqui o host é shrink-to-fit dentro de
        // uma viewport com scroll, então o SVG precisa da largura intrínseca do
        // viewBox — sem ela colapsa para zero.
        const [, , vbW, vbH] = (el.getAttribute("viewBox") ?? "0 0 0 0")
          .split(/\s+/)
          .map(Number);
        if (!vbW || !vbH) return;
        el.style.maxWidth = "none";
        el.setAttribute("width", String(vbW));
        el.setAttribute("height", String(vbH));
        setSize({ w: vbW, h: vbH });

        // Zoom inicial. Na prévia o diagrama inteiro precisa caber no cartão;
        // na tela cheia o ajuste é só pela largura, e a altura fica no scroll —
        // fluxos verticais longos são a maioria e encolhê-los até caber na
        // altura deixaria o texto ilegível. Diagramas menores que a área
        // disponível ficam em 100% em vez de esticar.
        const { clientWidth, clientHeight } = viewportRef.current;
        const padding = mini ? 24 : 40;
        const fit = mini
          ? Math.min(1, (clientWidth - padding) / vbW, (clientHeight - padding) / vbH)
          : Math.min(1, (clientWidth - padding) / vbW);
        setZoom(fit > 0 ? fit : 1);
        setPan({ x: 0, y: 0 });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        // O Mermaid deixa o elemento temporário no DOM quando a análise falha.
        document.getElementById(id)?.remove();
        setError(err.message || "não foi possível renderizar o diagrama");
      });

    return () => {
      cancelled = true;
    };
  }, [board.docId, board.mermaid, mini]);

  function onPointerDown(ev: React.PointerEvent) {
    if (mini) return;
    dragRef.current = { x: ev.clientX, y: ev.clientY, panX: pan.x, panY: pan.y };
    ev.currentTarget.setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    setPan({
      x: drag.panX + (ev.clientX - drag.x),
      y: drag.panY + (ev.clientY - drag.y),
    });
  }

  function onPointerUp(ev: React.PointerEvent) {
    dragRef.current = null;
    ev.currentTarget.releasePointerCapture(ev.pointerId);
  }

  if (error) {
    return <div className="mermaid-error">{error}</div>;
  }

  return (
    <div className={"mermaid-wrap" + (mini ? " mini" : "")}>
      <div
        ref={viewportRef}
        className="mermaid-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* O `transform` não muda o espaço que o host ocupa no layout; sem a caixa com o tamanho
            escalado, um diagrama largo reduzido a 25% deixava a altura original vazia embaixo. */}
        <div className="mermaid-sizer" style={size ? { width: size.w * zoom, height: size.h * zoom } : undefined}>
          <div
            ref={hostRef}
            className="mermaid-host"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          />
        </div>
      </div>
      {!mini && (
        <div className="mermaid-controls">
          <button type="button" onClick={() => setZoom((z) => Math.min(z * 1.25, 6))} title="Aproximar">
            +
          </button>
          <button type="button" onClick={() => setZoom((z) => Math.max(z / 1.25, 0.2))} title="Afastar">
            −
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Redefinir"
          >
            ⟲
          </button>
          <span className="mermaid-zoom">{Math.round(zoom * 100)}%</span>
        </div>
      )}
    </div>
  );
}
