import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProvedorDados } from "./data";
import { CandidatoPage } from "./pages/CandidatoPage";
import { HomePage } from "./pages/HomePage";
import { ImprimirPage } from "./pages/ImprimirPage";

export function App() {
  return (
    <BrowserRouter>
      <ProvedorDados>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candidato/:sq" element={<CandidatoPage />} />
          <Route path="/imprimir" element={<ImprimirPage />} />
        </Routes>
      </ProvedorDados>
    </BrowserRouter>
  );
}
