"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [posicao, setPosicao] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [comentarioAberto, setComentarioAberto] = useState(false);
  const caixa = useRef<HTMLInputElement>(null);
  const repetirFoco = useRef(false);
  const chaveCandidato = candidato?.sq ?? "";
  const [visto, setVisto] = useState(chaveCandidato);
  if (chaveCandidato !== visto) {
    setVisto(chaveCandidato);
    if (candidato) {
      setRascunho("");
      setErro("");
      setPosicao(null);
    }
  }

  useEffect(() => {
    if (!candidato) setComentarioAberto(false);
  }, [candidato]);

  useLayoutEffect(() => {
    if (!repetirFoco.current) return;
    const alvo = caixa.current;
    if (!alvo) return;
    alvo.focus();
    const aguardandoCandidato =
      rascunho.length === slot.digits && !candidato && !erro;
    if (aguardandoCandidato) return;
    repetirFoco.current = false;
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
    const emCandidato = Boolean(candidato) && posicao === null && rascunho === "";
    repetirFoco.current = true;
    if (tecla === "Backspace") {
      const base = emCandidato && candidato ? candidato.numero : rascunho;
      if (!base) {
        setPosicao(0);
        setErro("");
        return;
      }
      const restante = base.slice(0, -1);
      if (emCandidato) {
        setPosicao(base.length - 1);
      } else {
        const cursor = posicao ?? base.length;
        const naCaixaVazia = cursor >= base.length;
        setPosicao(naCaixaVazia ? restante.length : Math.max(0, restante.length - 1));
      }
      setRascunho(restante);
      setErro("");
      if (emCandidato) onLimpar();
      return;
    }
    if (emCandidato) return;
    if (/^\d$/.test(tecla) && rascunho.length < slot.digits) {
      const proximo = rascunho + tecla;
      setPosicao(proximo.length >= slot.digits ? slot.digits - 1 : proximo.length);
      setRascunho(proximo);
    }
  }

  const editando = !candidato || posicao !== null || rascunho !== "";

  return (
    <article className="cartao">
      <header className="cartao-topo">
        <span>{slotLabel(slot, candidato)}</span>
        {candidato && !editando ? (
          <button type="button" className="limpar" onClick={onLimpar}>
            limpar ×
          </button>
        ) : null}
      </header>
            {candidato && !editando ? (
        <div className="preenchido">
          <div className="escolha">
            <span className="escolha-urna">
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
                  valor={candidato.numero}
                  preenchido
                  cursor={candidato.numero.length - 1}
                  rotulo={`Digite o número de ${slot.vazio.toLowerCase()}`}
                  entrada={caixa}
                  onTecla={aoDigitar}
                />
              </div>
              <Link
                className="escolha-link"
                href={`/candidato/${candidato.sq}${suffix}`}
              >
                <Avatar nome={candidato.nomeUrna} foto={candidato.foto} />
              </Link>
            </span>
            <Link
              className="escolha-link identidade"
              href={`/candidato/${candidato.sq}${suffix}`}
            >
              <strong>{candidato.nomeUrna}</strong>
              <span>{candidato.sigla}</span>
            </Link>
          </div>
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
              cursor={posicao ?? rascunho.length}
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
