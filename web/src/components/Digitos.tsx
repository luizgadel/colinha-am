export function Digitos({
  total,
  valor,
  preenchido,
}: {
  total: number;
  valor: string;
  preenchido: boolean;
}) {
  const caracteres = valor.padEnd(total, " ").slice(0, total).split("");
  return (
    <span className="digitos" aria-hidden="true">
      {caracteres.map((caractere, indice) => {
        const vazio = caractere === " ";
        return (
          <span
            key={indice}
            className={
              preenchido || !vazio ? "digito digito-cheio" : "digito"
            }
          >
            {vazio ? "" : caractere}
          </span>
        );
      })}
    </span>
  );
}
