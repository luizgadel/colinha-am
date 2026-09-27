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
        const ativo = cursor === indice && vazio;
        return (
          <span
            key={indice}
            className={
              preenchido || !vazio ? "digito digito-cheio" : "digito"
            }
          >
            {ativo ? (
              <input
                ref={entrada}
                className="cursor-caixa"
                inputMode="numeric"
                aria-label={rotulo}
                value=""
                onChange={() => {}}
                onKeyDown={(evento) => {
                  if (evento.key === "Backspace" || /^\d$/.test(evento.key)) {
                    evento.preventDefault();
                    onTecla?.(evento.key);
                  }
                }}
              />
            ) : vazio ? (
              ""
            ) : (
              caractere
            )}
          </span>
        );
      })}
    </span>
  );
}
