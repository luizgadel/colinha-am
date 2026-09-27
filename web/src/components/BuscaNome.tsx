import { useEffect, useRef, useState } from "react";
import { filtrarCandidatos } from "../busca";
import { useDados } from "../data";
import type { Slot } from "../slots";
import type { Candidato } from "../types";
import { Avatar } from "./Avatar";

export function BuscaNome({
  slot,
  bloqueado,
  onFechar,
  onEscolher,
}: {
  slot: Slot;
  bloqueado?: Candidato;
  onFechar: () => void;
  onEscolher: (candidato: Candidato) => void;
}) {
  const { lista } = useDados();
  const [consulta, setConsulta] = useState("");
  const [erro, setErro] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const resultados = filtrarCandidatos(lista, slot.cargo, consulta);
  const soNumero = /^\d+$/.test(consulta.trim());
  const numeroCompleto = soNumero && consulta.trim().length === slot.digits;

  useEffect(() => {
    campo.current?.focus();
  }, []);

  function escolher(candidato: Candidato) {
    if (bloqueado && bloqueado.sq === candidato.sq) {
      setErro("Esta pessoa já está no outro voto de senador.");
      return;
    }
    onEscolher(candidato);
  }

  return (
    <div className="busca-fundo" role="presentation" onClick={onFechar}>
      <div
        className="busca"
        role="dialog"
        aria-modal="true"
        aria-label={`Buscar ${slot.vazio.toLowerCase()}`}
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="busca-topo">
          <strong>{slot.vazio}</strong>
          <button type="button" className="limpar" onClick={onFechar}>
            fechar
          </button>
        </header>
        <input
          ref={campo}
          value={consulta}
          placeholder="Nome ou número"
          onChange={(evento) => {
            setConsulta(evento.target.value);
            setErro("");
          }}
          onKeyDown={(evento) => {
            if (evento.key === "Escape") onFechar();
            if (evento.key === "Enter" && resultados.length === 1) {
              escolher(resultados[0]);
            }
          }}
        />
        {erro ? <p className="erro">{erro}</p> : null}
        {numeroCompleto && resultados.length === 0 ? (
          <p className="erro">Esse número não está registrado para este cargo.</p>
        ) : null}
        <ul className="resultados">
          {resultados.map((candidato) => (
            <li key={candidato.sq}>
              <button type="button" onClick={() => escolher(candidato)}>
                <span className="resultado-numero">{candidato.numero}</span>
                <Avatar nome={candidato.nomeUrna} foto={candidato.foto} />
                <span className="identidade">
                  <strong>{candidato.nomeUrna}</strong>
                  <span>{candidato.sigla}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {consulta.trim() && !numeroCompleto && resultados.length === 0 ? (
          <p className="mudo">Nenhum candidato com esse nome.</p>
        ) : null}
      </div>
    </div>
  );
}
