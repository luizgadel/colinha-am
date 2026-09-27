"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BaseCandidatos, Candidato, CargoId } from "./types";

type Indice = {
  lista: Candidato[];
  geradoEm: string;
  fonte: string;
  porSq: Map<string, Candidato>;
  porNumero: Map<string, Candidato>;
};

const Contexto = createContext<Indice | null>(null);

export function ProvedorDados({ children }: { children: ReactNode }) {
  const [base, setBase] = useState<BaseCandidatos | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/data/candidatos.json", { cache: "no-store" })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Falha ao carregar candidaturas");
        return resposta.json() as Promise<BaseCandidatos>;
      })
      .then(setBase)
      .catch(() => setErro("Não foi possível carregar os dados do TSE."));
  }, []);

  const indice = useMemo<Indice | null>(() => {
    if (!base) return null;
    const porSq = new Map<string, Candidato>();
    const porNumero = new Map<string, Candidato>();
    for (const candidato of base.candidatos) {
      porSq.set(candidato.sq, candidato);
      porNumero.set(`${candidato.cargo}:${candidato.numero}`, candidato);
    }
    return {
      lista: base.candidatos,
      geradoEm: base.geradoEm,
      fonte: base.fonte,
      porSq,
      porNumero,
    };
  }, [base]);

  if (erro) {
    return <p className="aviso">{erro}</p>;
  }
  if (!indice) {
    return <p className="aviso">Carregando candidaturas…</p>;
  }
  return <Contexto.Provider value={indice}>{children}</Contexto.Provider>;
}

export function useDados() {
  const indice = useContext(Contexto);
  if (!indice) throw new Error("Dados ainda não carregados");
  return indice;
}

export function buscarPorNumero(indice: Indice, cargo: CargoId, numero: string) {
  return indice.porNumero.get(`${cargo}:${numero}`);
}
