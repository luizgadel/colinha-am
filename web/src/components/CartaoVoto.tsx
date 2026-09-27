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
  const [comentarioAberto, setComentarioAberto] = useState(false);
  const caixa = useRef<HTMLInputElement>(null);
  const repetirFoco = useRef(false);

  useEffect(() => {
    if (candidato) {
      setRascunho("");
      setErro("");
    }
  }, [candidato]);

  useEffect(() => {
    if (!candidato) setComentarioAberto(false);
  }, [candidato]);

  useEffect(() => {
    if (!repetirFoco.current) return;
    repetirFoco.current = false;
    caixa.current?.focus();
  });

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
    repetirFoco.current = true;
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
          {comentario && !comentarioAberto ? (
            <p className="comentario-salvo">{comentario}</p>
          ) : null}
          <button
            type="button"
            className="comentar"
            onClick={() => setComentarioAberto((aberto) => !aberto)}
          >
            {comentarioAberto ? "fechar" : "comentar"}
          </button>
          {comentarioAberto ? (
            <label className="comentario">
              <span>Comentário</span>
              <textarea
                maxLength={210}
                rows={3}
                value={comentario}
                placeholder="Por que essa escolha?"
                onChange={(evento) => onComentar(evento.target.value)}
              />
            </label>
          ) : null}
        </div>
      ) : (
        <div className="vazio">
          <div
            className="caixas"
            onMouseDown={(evento) => {
              if (evento.target === caixa.current) return;
              evento.preventDefault();
              caixa.current?.focus();
            }}
          >
            <Digitos
              total={slot.digits}
              valor={rascunho}
              preenchido={false}
              cursor={rascunho.length}
              rotulo={`Digite o número de ${slot.vazio.toLowerCase()}`}
              entrada={caixa}
              onTecla={aoDigitar}
            />
          </div>
          <button type="button" className="buscar" onClick={onBuscar}>
            Busque pelo nome
          </button>
          {erro ? <p className="erro">{erro}</p> : null}
        </div>
      )}
    </article>
  );
}
