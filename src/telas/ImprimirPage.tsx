"use client";

import Link from "next/link";
import { Digitos } from "../components/Digitos";
import { useColinha } from "../colinha";
import { SLOTS, slotLabel } from "../slots";

export function ImprimirPage() {
  const { escolhas, comentarios, suffix } = useColinha();

  return (
    <main className="pagina pagina-papel">
      <div className="acoes no-print">
        <Link href={`/${suffix}`}>Voltar</Link>
        <button type="button" onClick={() => window.print()}>
          Imprimir
        </button>
      </div>
      <header className="topo">
        <p className="marca">Colinha</p>
        <p className="sub">Amazonas · 1º turno · 4 de outubro de 2026</p>
      </header>
      <p className="papel-nota">
        Leve este papel. O celular não entra na cabine de votação.
      </p>
      <div className="lista">
        {SLOTS.map((slot) => {
          const candidato = escolhas[slot.id];
          return (
            <article className="cartao" key={slot.id}>
              <header className="cartao-topo">
                <span>{slotLabel(slot, candidato)}</span>
              </header>
              <div className="escolha">
                <Digitos
                  total={slot.digits}
                  valor={candidato?.numero ?? ""}
                  preenchido={Boolean(candidato)}
                />
                <span className="identidade">
                  <strong>{candidato?.nomeUrna ?? " "}</strong>
                  <span>{candidato?.sigla ?? ""}</span>
                </span>
              </div>
              {candidato && comentarios[slot.id] ? (
                <p className="comentario-papel">{comentarios[slot.id]}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}
