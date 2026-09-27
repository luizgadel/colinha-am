"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buscarPorNumero, useDados } from "./data";
import { SLOTS, paramComentario } from "./slots";
import type { Candidato, SlotId } from "./types";

export function useColinha() {
  const indice = useDados();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const escolhas = useMemo(() => {
    const mapa = {} as Record<SlotId, Candidato | undefined>;
    for (const slot of SLOTS) {
      const numero = params.get(slot.id) ?? "";
      mapa[slot.id] = numero
        ? buscarPorNumero(indice, slot.cargo, numero.padStart(slot.digits, "0"))
        : undefined;
    }
    return mapa;
  }, [indice, params]);

  const comentarios = useMemo(() => {
    const mapa = {} as Record<SlotId, string>;
    for (const slot of SLOTS) {
      mapa[slot.id] = (params.get(paramComentario(slot.id)) ?? "").slice(0, 200);
    }
    return mapa;
  }, [params]);

  const consulta = params.toString();
  const suffix = consulta ? `?${consulta}` : "";

  function escrever(proximo: URLSearchParams, modo: "push" | "replace") {
    const texto = proximo.toString();
    const href = texto ? `${pathname}?${texto}` : pathname;
    if (modo === "replace") router.replace(href);
    else router.push(href);
  }

  function definir(slot: SlotId, candidato: Candidato | null) {
    const proximo = new URLSearchParams(params);
    if (!candidato) {
      proximo.delete(slot);
      proximo.delete(paramComentario(slot));
    } else proximo.set(slot, candidato.numero);
    escrever(proximo, "push");
  }

  function comentar(slot: SlotId, texto: string) {
    const proximo = new URLSearchParams(params);
    const limitado = texto.slice(0, 200);
    const chave = paramComentario(slot);
    if (!limitado) proximo.delete(chave);
    else proximo.set(chave, limitado);
    escrever(proximo, "replace");
  }

  return { escolhas, comentarios, definir, comentar, suffix };
}
