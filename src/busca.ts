import type { Candidato, CargoId } from "./types";
import { normalizar } from "./format";

export function filtrarCandidatos(
  lista: Candidato[],
  cargo: CargoId,
  consulta: string,
) {
  const termo = normalizar(consulta);
  if (!termo) return [];
  const soNumero = /^\d+$/.test(termo);
  return lista
    .filter((candidato) => candidato.cargo === cargo)
    .filter((candidato) => {
      if (soNumero) return candidato.numero.startsWith(termo);
      return (
        normalizar(candidato.nomeUrna).includes(termo) ||
        normalizar(candidato.nome).includes(termo)
      );
    })
    .sort((a, b) => {
      if (soNumero) return a.numero.localeCompare(b.numero);
      const aComeca = normalizar(a.nomeUrna).startsWith(termo) ? 0 : 1;
      const bComeca = normalizar(b.nomeUrna).startsWith(termo) ? 0 : 1;
      if (aComeca !== bComeca) return aComeca - bComeca;
      return a.nomeUrna.localeCompare(b.nomeUrna, "pt");
    })
    .slice(0, 40);
}
