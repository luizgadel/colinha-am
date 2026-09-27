import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { buscarPorNumero, useDados } from "../data";
import { slotLabel, type Slot } from "../slots";
import type { Candidato } from "../types";
import { Avatar } from "./Avatar";
import { Digitos } from "./Digitos";

export function CartaoVoto({
  slot,
  candidato,
  bloqueado,
  onEscolher,
  onLimpar,
  onBuscar,
}: {
  slot: Slot;
  candidato?: Candidato;
  bloqueado?: Candidato;
  onEscolher: (candidato: Candidato) => void;
  onLimpar: () => void;
  onBuscar: () => void;
}) {
  const indice = useDados();
  const [rascunho, setRascunho] = useState("");
  const [erro, setErro] = useState("");
  const caixa = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (candidato) {
      setRascunho("");
      setErro("");
    }
  }, [candidato]);

  useEffect(() => {
    if (candidato || rascunho.length !== slot.digits) return;
    const encontrado = buscarPorNumero(indice, slot.cargo, rascunho);
    if (!encontrado) {
      setErro("Esse número não está registrado para este cargo.");
      return;
    }
    if (bloqueado && bloqueado.sq === encontrado.sq) {
      setErro("Esta pessoa já está no outro voto de senador.");
      return;
    }
    setErro("");
    onEscolher(encontrado);
  }, [bloqueado, candidato, indice, onEscolher, rascunho, slot.cargo, slot.digits]);

  function aoDigitar(tecla: string) {
    if (candidato) return;
    if (tecla === "Backspace") {
      setRascunho((atual) => atual.slice(0, -1));
      setErro("");
      return;
    }
    if (/^\d$/.test(tecla) && rascunho.length < slot.digits) {
      setRascunho((atual) => atual + tecla);
    }
  }

  return (
    <article className="cartao">
      <header className="cartao-topo">
        <span>{slotLabel(slot, candidato)}</span>
        {candidato ? (
          <button type="button" className="limpar" onClick={onLimpar}>
            limpar ×
          </button>
        ) : null}
      </header>
      {candidato ? (
        <Link
          className="escolha"
          to={{ pathname: `/candidato/${candidato.sq}`, search: window.location.search }}
        >
          <Digitos total={slot.digits} valor={candidato.numero} preenchido />
          <Avatar nome={candidato.nomeUrna} foto={candidato.foto} />
          <span className="identidade">
            <strong>{candidato.nomeUrna}</strong>
            <span>{candidato.sigla}</span>
          </span>
        </Link>
      ) : (
        <div className="vazio">
          <button
            ref={caixa}
            type="button"
            className="caixas"
            aria-label={`Digite o número de ${slot.vazio.toLowerCase()}`}
            onKeyDown={(evento) => {
              if (evento.key === "Backspace" || /^\d$/.test(evento.key)) {
                evento.preventDefault();
                aoDigitar(evento.key);
              }
            }}
          >
            <Digitos total={slot.digits} valor={rascunho} preenchido={false} />
          </button>
          <button type="button" className="buscar" onClick={onBuscar}>
            Busque pelo nome
          </button>
          {erro ? <p className="erro">{erro}</p> : null}
        </div>
      )}
    </article>
  );
}
