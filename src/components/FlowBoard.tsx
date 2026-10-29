import { useCallback, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { boardToFlow, type FlowNodeData } from "../lib/flow";
import type { Board } from "../lib/types";
import { nodeTypes } from "./FlowNodes";

/** Abaixo disso o rótulo de 11px deixa de ser legível. */
const ZOOM_MINIMO_LEGIVEL = 0.7;

interface FlowBoardProps {
  board: Board;
  /** Modo compacto: sem controles, sem minimapa, sem zoom por scroll. */
  mini?: boolean;
  /** HU em destaque — pinta os nós dela e, no mini, enquadra só eles. */
  highlightHuId?: string;
  onHuClick?: (huId: string) => void;
}

/*
 * O canvas da prancha. O grafo é 100% derivado do `Board`: não há estado de
 * nós, nada é arrastável, nada persiste posição. Editar o fluxograma é editar
 * o bloco ```board da documentação.
 */
export default function FlowBoard({
  board,
  mini = false,
  highlightHuId,
  onHuClick,
}: FlowBoardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useMemo(
    () => boardToFlow(board, { highlightHuId, onHuClick }),
    [board, highlightHuId, onHuClick]
  );

  /* `fitView` só vale na inicialização da instância do React Flow, e o mesmo
     canvas é reaproveitado quando a prancha muda (aba de "Onde entra no fluxo",
     pager da tela cheia) ou quando o destaque muda. Sem remontar, a viewport
     antiga fica de pé: uma prancha rasa que herda o enquadramento de uma funda
     abre em branco, com o desenho inteiro fora da janela. Remontar é barato e
     não perde nada — o grafo é derivado do `Board`, não há estado de canvas. */
  const enquadramento = `${board.docId}|${highlightHuId ?? ""}`;

  /* Enquadramento de abertura, na tela cheia.

     Cabe inteira? Abre inteira, sem esticar além de 100%.
     Não cabe? Abre no menor zoom ainda legível e ancora no canto — o texto
     do nó tem 11px, e abaixo de ~70% vira borrão. Aí a leitura passa a ser
     navegando, com o minimapa e os controles. É a mesma escolha que já
     valia para os diagramas Mermaid: melhor rolar do que não conseguir ler.

     Só `setViewport` é usado aqui; tipar o mínimo evita arrastar os
     genéricos de nó e aresta do React Flow para dentro deste componente. */
  const enquadrar = useCallback(
    (instancia: { setViewport: (v: { x: number; y: number; zoom: number }) => void }) => {
      const caixa = wrapRef.current?.getBoundingClientRect();
      if (!caixa || !nodes.length) return;

      let x1 = Infinity;
      let y1 = Infinity;
      let x2 = -Infinity;
      let y2 = -Infinity;
      for (const n of nodes) {
        x1 = Math.min(x1, n.position.x);
        y1 = Math.min(y1, n.position.y);
        x2 = Math.max(x2, n.position.x + (n.width ?? 0));
        y2 = Math.max(y2, n.position.y + (n.height ?? 0));
      }

      // Folga generosa de propósito: o chip de HU flutua para fora da caixa
      // do nó e não entra no cálculo dos limites. Com pouca margem, o chip
      // de um nó na borda nasce cortado.
      const folga = 170;
      const largura = x2 - x1;
      const altura = y2 - y1;
      const cabe = Math.min(
        (caixa.width - folga) / largura,
        (caixa.height - folga) / altura,
        1
      );
      const zoom = Math.max(cabe, ZOOM_MINIMO_LEGIVEL);
      const coube = zoom === cabe;

      instancia.setViewport({
        x: coube ? (caixa.width - largura * zoom) / 2 - x1 * zoom : folga / 2 - x1 * zoom,
        y: coube ? (caixa.height - altura * zoom) / 2 - y1 * zoom : folga / 2 - y1 * zoom,
        zoom,
      });
    },
    [nodes]
  );

  // Na prévia com HU destacada, a viewport enquadra só os nós daquela HU —
  // é o que faz a miniatura responder a pergunta "onde isso entra no fluxo".
  const fitViewOptions = useMemo(() => {
    if (mini && highlightHuId) {
      const foco = nodes.filter((n) => (n.data as FlowNodeData).highlighted);
      if (foco.length) {
        return { padding: 1.2, nodes: foco.map((n) => ({ id: n.id })), maxZoom: 0.9 };
      }
    }
    return { padding: mini ? 0.08 : 0.15 };
  }, [mini, highlightHuId, nodes]);

  return (
    <div ref={wrapRef} className={"rf-wrap" + (mini ? " mini" : "")}>
      <ReactFlow
        key={enquadramento}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        onInit={mini ? undefined : enquadrar}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={!mini}
        zoomOnScroll={!mini}
        panOnScroll={mini}
        zoomOnDoubleClick={!mini}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} color="#dcdcd4" gap={22} size={1.4} />
        {!mini && <Controls showInteractive={false} />}
        {!mini && (
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => (n.type === "sialGroup" ? "#e4e9f8" : "#99a8dd")}
          />
        )}
      </ReactFlow>
    </div>
  );
}
