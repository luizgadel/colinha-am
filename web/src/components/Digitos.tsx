import type { Ref } from "react";

export function Digitos({
  total,
  valor,
  preenchido,
  cursor,
  rotulo,
  entrada,
  onTecla,
}: {
  total: number;
  valor: string;
  preenchido: boolean;
  cursor?: number;
  rotulo?: string;
  entrada?: Ref<HTMLInputElement>;
  onTecla?: (tecla: string) => void;
}) {
  const caracteres = valor.padEnd(total, " ").slice(0, total).split("");
  return (
    <span className="digitos" aria-hidden={rotulo ? undefined : true}>
      {caracteres.map((caractere, indice) => {
        const vazio = caractere === " ";
        const ativo = cursor === indice;
        const numpad = /^Numpad(\d)$/;
        return (
          <span
            key={indice}
            className={
              preenchido || !vazio ? "digito digito-cheio" : "digito"
            }
          >
            {vazio ? "" : caractere}
            {ativo ? (
              <input
                ref={entrada}
                className="cursor-caixa"
                inputMode="numeric"
                aria-label={rotulo}
                value=""
                onChange={() => {}}
                onKeyDown={(evento) => {
                  const peloCodigo = numpad.exec(evento.code);
                  const tecla =
                    evento.key === "Backspace"
                      ? "Backspace"
                      : /^\d$/.test(evento.key)
                        ? evento.key
                        : peloCodigo
                          ? peloCodigo[1]
                          : "";
                  if (!tecla) return;
                  evento.preventDefault();
                  onTecla?.(tecla);
                }}
              />
            ) : null}
          </span>
        );
      })}
    </span>
  );
}
