import fs from "node:fs";
import path from "node:path";
import { CandidatoPage } from "../../../telas/CandidatoPage";

export function generateStaticParams() {
  const arquivo = path.join(process.cwd(), "public", "data", "candidatos.json");
  const base = JSON.parse(fs.readFileSync(arquivo, "utf8")) as {
    candidatos: { sq: string }[];
  };
  return base.candidatos.map((candidato) => ({ sq: candidato.sq }));
}

export default function Page() {
  return <CandidatoPage />;
}
