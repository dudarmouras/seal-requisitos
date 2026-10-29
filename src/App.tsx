import { Navigate, Route, Routes } from "react-router-dom";
import { DataProvider, useData } from "./lib/data";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SystemPage from "./pages/SystemPage";
import ModulePage from "./pages/ModulePage";
import HuPage from "./pages/HuPage";
import FlowsPage from "./pages/FlowsPage";
import FlowBoardPage from "./pages/FlowBoardPage";
import ScreensPage from "./pages/ScreensPage";
import ScreenPage from "./pages/ScreenPage";
import DocPage from "./pages/DocPage";
import ArtifactPage from "./pages/ArtifactPage";
import CatalogPage from "./pages/CatalogPage";
import ApiPage from "./pages/ApiPage";
import DecisoesPage from "./pages/DecisoesPage";
import RequisitosPage from "./pages/RequisitosPage";
import BacklogPage from "./pages/BacklogPage";

function Shell() {
  const { loading, loadError, hus } = useData();

  if (loadError) {
    return (
      <div className="splash">
        <p>Falha ao carregar os dados: {loadError}</p>
      </div>
    );
  }

  if (loading || hus.length === 0) {
    return (
      <div className="splash">
        <div className="spinner" />
        Carregando requisitos…
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sistema/:systemId" element={<SystemPage />} />
        <Route path="/sistema/:systemId/modulo/:moduleId" element={<ModulePage />} />
        <Route path="/hu/:huId" element={<HuPage />} />
        <Route path="/fluxos" element={<FlowsPage />} />
        <Route path="/telas" element={<ScreensPage />} />
        <Route path="/telas/:screenId" element={<ScreenPage />} />
        <Route path="/doc/:systemId/:file" element={<DocPage />} />
        <Route path="/id/:id" element={<ArtifactPage />} />
        <Route path="/sistema/:systemId/catalogo/:kind" element={<CatalogPage />} />
        <Route path="/sistema/:systemId/api" element={<ApiPage />} />
        <Route path="/decisoes" element={<DecisoesPage />} />
        <Route path="/requisitos" element={<RequisitosPage />} />
        <Route path="/backlog" element={<BacklogPage />} />
        <Route path="/arquitetura" element={<DocPage key="arquitetura" systemId="geral" file="arquitetura" />} />
        <Route path="/infraestrutura" element={<DocPage key="infra" systemId="geral" file="infraestrutura-e-custos" />} />
        <Route path="/adocao" element={<DocPage key="adocao" systemId="geral" file="adocao-gradual" />} />
        <Route path="/escalabilidade" element={<DocPage key="escala" systemId="geral" file="escalabilidade" />} />
      </Route>
      <Route path="/fluxos/:boardId" element={<FlowBoardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Shell />
    </DataProvider>
  );
}
