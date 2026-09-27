"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buscarPorNumero, useDados } from "../data";
import { slotLabel, type Slot } from "../slots";
import type { Candidato } from "../types";
import { Avatar } from "./Avatar";
import { Digitos } from "./Digitos";

export function CartaoVoto({
  slot,
  candidato,
  comentario,
  bloqueado,
  onEscolher,
  onLimpar,
  onComentar,
  onBuscar,
}: {
  slot: Slot;
  candidato?: Candidato;
  comentario: string;
  bloqueado?: Candidato;
  onEscolher: (candidato: Candidato) => void;
  onLimpar: () => void;
  onComentar: (texto: string) => void;
  onBuscar: () => void;
}) {
  const indice = useDados();
  const consulta = useSearchParams().toString();
  const suffix = consulta ? `?${consulta}` : "";
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
        <div className="preenchido">
          <Link
            className="escolha"
            href={`/candidato/${candidato.sq}${suffix}`}
          >
            <Digitos total={slot.digits} valor={candidato.numero} preenchido />
            <Avatar nome={candidato.nomeUrna} foto={candidato.foto} />
            <span className="identidade">
              <strong>{candidato.nomeUrna}</strong>
              <span>{candidato.sigla}</span>
            </span>
          </Link>
          <label className="comentario">
            <span>Comentário</span>
            <textarea
              maxLength={200}
              rows={3}
              value={comentario}
              placeholder="Por que essa escolha?"
              onChange={(evento) => onComentar(evento.target.value)}
            />
          </label>
        </div>
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
