"use client";

import { useState } from "react";
import { iniciais } from "../format";

export function Avatar({
  nome,
  foto,
  tamanho = "md",
}: {
  nome: string;
  foto: string;
  tamanho?: "md" | "lg";
}) {
  const [falhou, setFalhou] = useState(false);
  const classe = tamanho === "lg" ? "avatar avatar-lg" : "avatar";
  if (foto && !falhou) {
    return (
      <img
        className={classe}
        src={foto}
        alt=""
        onError={() => setFalhou(true)}
      />
    );
  }
  return <span className={`${classe} avatar-fallback`}>{iniciais(nome)}</span>;
}
