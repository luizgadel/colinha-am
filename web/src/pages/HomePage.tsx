import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BuscaNome } from "../components/BuscaNome";
import { CartaoVoto } from "../components/CartaoVoto";
import { useColinha } from "../colinha";
import { useDados } from "../data";
import { SLOTS, type Slot } from "../slots";
import type { SlotId } from "../types";

export function HomePage() {
  const { escolhas, comentarios, definir, comentar } = useColinha();
  const { geradoEm } = useDados();
  const location = useLocation();
  const [aberto, setAberto] = useState<SlotId | null>(null);
  const [copiado, setCopiado] = useState(false);
  const slotAberto = SLOTS.find((slot) => slot.id === aberto);

  function outroSenador(slot: Slot) {
    if (slot.id === "s1") return escolhas.s2;
    if (slot.id === "s2") return escolhas.s1;
    return undefined;
  }

  async function copiar() {
    const url = `${window.location.origin}/${location.search}`;
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <main className="pagina">
      <header className="topo">
        <p className="marca">Colinha</p>
        <p className="sub">Amazonas · 1º turno · 4 de outubro de 2026</p>
      </header>
      <div className="lista">
        {SLOTS.map((slot) => (
          <CartaoVoto
            key={slot.id}
            slot={slot}
            candidato={escolhas[slot.id]}
            comentario={comentarios[slot.id]}
            bloqueado={outroSenador(slot)}
            onEscolher={(candidato) => {
              definir(slot.id, candidato);
              setAberto(null);
            }}
            onLimpar={() => definir(slot.id, null)}
            onComentar={(texto) => comentar(slot.id, texto)}
            onBuscar={() => setAberto(slot.id)}
          />
        ))}
      </div>
      <div className="acoes no-print">
        <button type="button" onClick={() => void copiar()}>
          {copiado ? "Link copiado" : "Copiar link"}
        </button>
        <Link to={{ pathname: "/imprimir", search: location.search }}>
          Imprimir
        </Link>
      </div>
      <p className="rodape">
        Números na ordem da urna. Base do TSE de {geradoEm}. O celular não entra
        na cabine: imprima ou anote.
      </p>
      {slotAberto ? (
        <BuscaNome
          slot={slotAberto}
          bloqueado={outroSenador(slotAberto)}
          onFechar={() => setAberto(null)}
          onEscolher={(candidato) => {
            definir(slotAberto.id, candidato);
            setAberto(null);
          }}
        />
      ) : null}
    </main>
  );
}
