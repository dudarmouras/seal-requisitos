import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Artifact,
  Board,
  Contract,
  DocFile,
  Endpoint,
  Hu,
  Integration,
  Module,
  Screen,
  System,
} from "./types";

interface Dataset {
  systems: System[];
  modules: Module[];
  hus: Hu[];
  boards: Board[];
  screens: Screen[];
  integrations: Integration[];
  documents: DocFile[];
  artifacts: Artifact[];
  endpoints: Endpoint[];
  contracts: Contract[];
}

interface DataState extends Dataset {
  localMode: boolean;
  loading: boolean;
  loadError: string | null;
  huById: Map<string, Hu>;
  screenById: Map<string, Screen>;
  integrationById: Map<string, Integration>;
  systemById: Map<string, System>;
  /** `HU-*` -> ids dos fluxogramas em que a HU aparece */
  huBoards: Map<string, string[]>;
  /** `RN-*`, `ENT-*`, `INT-*`, `MSG-*`, `DIV-*`, `Q-*` -> onde é definido */
  artifactById: Map<string, Artifact>;
  /** `<sistema>/<arquivo>` -> arquivo da leitura integral */
  documentByKey: Map<string, DocFile>;
  /** Qualquer id -> DIV/Q que o citam */
  issuesCiting: Map<string, Artifact[]>;
  reload: () => void;
}

const DataContext = createContext<DataState | null>(null);

const EMPTY: Dataset = {
  systems: [],
  modules: [],
  hus: [],
  boards: [],
  screens: [],
  integrations: [],
  documents: [],
  artifacts: [],
  endpoints: [],
  contracts: [],
};

/* Os dados vêm só de data/requisitos.json, gerado de docs/ por `npm run data:gerar`.
   Não há banco nem login: o app é estático. */

async function loadLocalData(): Promise<Dataset> {
  const raw = (await import("../../data/requisitos.json")) as unknown as {
    default?: Dataset;
  } & Dataset;
  const data = raw.default ?? raw;
  return {
    systems: data.systems ?? [],
    modules: data.modules ?? [],
    hus: data.hus ?? [],
    // O JSON pode ter sido gerado antes da prancha desenhada existir.
    boards: (data.boards ?? []).map((b) => ({
      ...b,
      nodes: b.nodes ?? [],
      edges: b.edges ?? [],
      groups: b.groups ?? [],
    })),
    screens: data.screens ?? [],
    integrations: data.integrations ?? [],
    documents: data.documents ?? [],
    // O JSON pode ter sido gerado antes de `fields` existir.
    artifacts: (data.artifacts ?? []).map((a) => ({ ...a, fields: a.fields ?? {} })),
    endpoints: data.endpoints ?? [],
    contracts: data.contracts ?? [],
  };
}


export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [data, setData] = useState<Dataset>(EMPTY);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    loadLocalData()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message || "erro desconhecido");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const huById = useMemo(
    () => new Map(data.hus.map((h) => [h.docId, h])),
    [data.hus]
  );
  const screenById = useMemo(
    () => new Map(data.screens.map((s) => [s.docId, s])),
    [data.screens]
  );
  const integrationById = useMemo(
    () => new Map(data.integrations.map((i) => [i.id, i])),
    [data.integrations]
  );
  const systemById = useMemo(
    () => new Map(data.systems.map((s) => [s.id, s])),
    [data.systems]
  );
  const huBoards = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const board of data.boards) {
      for (const huId of board.hus) {
        const list = map.get(huId);
        if (list) list.push(board.docId);
        else map.set(huId, [board.docId]);
      }
    }
    /* Do mais específico para o mais amplo. Uma HU costuma aparecer no fluxo
       do seu processo e também num swimlane que cobre a esteira inteira — o
       `FLX-OF-02` sozinho declara 121 HUs. Sem ordenar, o swimlane viraria a
       aba padrão em "Onde entra no fluxo", e a resposta seria justamente a
       menos útil. Quantidade de HUs é a medida de amplitude que já temos. */
    const amplitude = new Map(data.boards.map((b) => [b.docId, b.hus.length]));
    for (const lista of map.values()) {
      lista.sort((a, b) => (amplitude.get(a) ?? 0) - (amplitude.get(b) ?? 0));
    }
    return map;
  }, [data.boards]);

  const artifactById = useMemo(
    () => new Map(data.artifacts.map((a) => [a.id, a])),
    [data.artifacts]
  );
  const documentByKey = useMemo(
    () => new Map(data.documents.map((d) => [`${d.system}/${d.file}`, d])),
    [data.documents]
  );
  const issuesCiting = useMemo(() => {
    const map = new Map<string, Artifact[]>();
    for (const a of data.artifacts) {
      if (a.kind !== "DIV" && a.kind !== "Q") continue;
      for (const id of a.cites) {
        const list = map.get(id);
        if (list) list.push(a);
        else map.set(id, [a]);
      }
    }
    return map;
  }, [data.artifacts]);

  const value = useMemo(
    () => ({
      ...data,
      localMode: true,
      loading,
      loadError,
      huById,
      screenById,
      integrationById,
      systemById,
      huBoards,
      artifactById,
      documentByKey,
      issuesCiting,
      reload,
    }),
    [
      data, loading, loadError, huById, screenById,
      integrationById, systemById, huBoards, artifactById,
      documentByKey, issuesCiting, reload,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData deve ser usado dentro de DataProvider");
  return ctx;
}

const NUMERAIS = [
  "zero", "um", "dois", "três", "quatro", "cinco",
  "seis", "sete", "oito", "nove", "dez",
];

/**
 * "Os dois sistemas" da home, da barra lateral e dos fluxogramas sai da
 * contagem, não de texto fixo: um sistema novo em `scripts/gerar-requisitos-json.mjs`
 * acerta a conta sozinho.
 */
export function porExtenso(n: number): string {
  return NUMERAIS[n] ?? String(n);
}
