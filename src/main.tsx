import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

// Depois de um novo deploy os arquivos com hash da versão anterior somem; uma aba aberta
// ainda aponta para eles. Recarrega uma vez para pegar a versão publicada.
window.addEventListener("vite:preloadError", () => {
  try {
    if (sessionStorage.getItem("recarregou-chunk")) return;
    sessionStorage.setItem("recarregou-chunk", "1");
  } catch {
    /* sem sessionStorage: recarrega mesmo assim */
  }
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
