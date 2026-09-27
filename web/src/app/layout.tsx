import { Suspense, type ReactNode } from "react";
import { ProvedorDados } from "../data";
import "../styles.css";

export const metadata = {
  title: "Colinha \u00b7 Amazonas 2026",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ProvedorDados>
          <Suspense fallback={<p className="aviso">{"Carregando candidaturas\u2026"}</p>}>
            {children}
          </Suspense>
        </ProvedorDados>
      </body>
    </html>
  );
}
