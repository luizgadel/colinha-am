import type { CargoId, Candidato, SlotId } from "./types";

export type Slot = {
  id: SlotId;
  cargo: CargoId;
  digits: number;
  vazio: string;
  masculino: string;
  feminino: string;
};

export const SLOTS: Slot[] = [
  {
    id: "df",
    cargo: "df",
    digits: 4,
    vazio: "DEPUTADO FEDERAL",
    masculino: "DEPUTADO FEDERAL",
    feminino: "DEPUTADA FEDERAL",
  },
  {
    id: "de",
    cargo: "de",
    digits: 5,
    vazio: "DEPUTADO ESTADUAL",
    masculino: "DEPUTADO ESTADUAL",
    feminino: "DEPUTADA ESTADUAL",
  },
  {
    id: "s1",
    cargo: "sen",
    digits: 3,
    vazio: "SENADOR · 1º VOTO",
    masculino: "SENADOR · 1º VOTO",
    feminino: "SENADORA · 1º VOTO",
  },
  {
    id: "s2",
    cargo: "sen",
    digits: 3,
    vazio: "SENADOR · 2º VOTO",
    masculino: "SENADOR · 2º VOTO",
    feminino: "SENADORA · 2º VOTO",
  },
  {
    id: "gov",
    cargo: "gov",
    digits: 2,
    vazio: "GOVERNADOR",
    masculino: "GOVERNADOR",
    feminino: "GOVERNADORA",
  },
  {
    id: "pr",
    cargo: "pres",
    digits: 2,
    vazio: "PRESIDENTE",
    masculino: "PRESIDENTE",
    feminino: "PRESIDENTA",
  },
];

export function slotById(id: SlotId) {
  const slot = SLOTS.find((item) => item.id === id);
  if (!slot) throw new Error(`Cargo desconhecido: ${id}`);
  return slot;
}

export function slotLabel(slot: Slot, candidato?: Candidato) {
  if (!candidato) return slot.vazio;
  return candidato.genero === "FEMININO" ? slot.feminino : slot.masculino;
}

export function cargoLabel(candidato: Candidato) {
  const slot = SLOTS.find((item) => item.cargo === candidato.cargo);
  if (!slot || slot.id === "s1" || slot.id === "s2") {
    return candidato.genero === "FEMININO" ? "SENADORA" : "SENADOR";
  }
  return candidato.genero === "FEMININO" ? slot.feminino : slot.masculino;
}
