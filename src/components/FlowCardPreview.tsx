import { useEffect, useRef, useState } from "react";
import FlowBoard from "./FlowBoard";
import type { Board } from "../lib/types";

/*
 * Prévia da prancha no cartão do índice, montada só quando entra na viewport.
 *
 * O índice lista as 81 pranchas de uma vez. Montar 81 instâncias do React Flow
 * na primeira pintura trava a página — cada uma abre observers e um store
 * próprio. Aqui o cartão nasce vazio e vira canvas quando chega perto da tela;
 * uma vez montado, fica, para não piscar ao rolar de volta.
 */
export default function FlowCardPreview({ board }: { board: Board }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo || visivel) return;

    // Sem IntersectionObserver (jsdom, navegador antigo), monta direto: melhor
    // uma página pesada do que uma página em branco.
    if (typeof IntersectionObserver === "undefined") {
      setVisivel(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((x) => x.isIntersecting)) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [visivel]);

  return (
    <div ref={ref} className="flow-card-preview" style={{ pointerEvents: "none" }}>
      {visivel && <FlowBoard board={board} mini />}
    </div>
  );
}
