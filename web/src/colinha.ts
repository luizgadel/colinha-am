import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { buscarPorNumero, useDados } from "./data";
import { SLOTS } from "./slots";
import type { Candidato, SlotId } from "./types";

export function useColinha() {
  const indice = useDados();
  const [params, setParams] = useSearchParams();

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

  function definir(slot: SlotId, candidato: Candidato | null) {
    const proximo = new URLSearchParams(params);
    if (!candidato) proximo.delete(slot);
    else proximo.set(slot, candidato.numero);
    setParams(proximo);
  }

  return { escolhas, definir, params };
}
