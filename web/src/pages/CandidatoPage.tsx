import { Link, useLocation, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Digitos } from "../components/Digitos";
import { useDados } from "../data";
import { brl, hrefRede } from "../format";
import { SLOTS, cargoLabel } from "../slots";

export function CandidatoPage() {
  const { sq = "" } = useParams();
  const { porSq, geradoEm } = useDados();
  const location = useLocation();
  const candidato = porSq.get(sq);

  if (!candidato) {
    return (
      <main className="pagina">
        <p className="aviso">Candidatura não encontrada nesta base.</p>
        <Link to={{ pathname: "/", search: location.search }}>Voltar à colinha</Link>
      </main>
    );
  }

  const slot = SLOTS.find((item) => item.cargo === candidato.cargo);
  const totalBens = candidato.bens.reduce((soma, bem) => soma + (bem.valor ?? 0), 0);
  const executivo = candidato.cargo === "gov" || candidato.cargo === "pres";

  return (
    <main className="pagina ficha">
      <Link className="voltar" to={{ pathname: "/", search: location.search }}>
        Colinha
      </Link>
      <p className="olho">{cargoLabel(candidato)}</p>
      <div className="ficha-cabeca">
        <Avatar nome={candidato.nomeUrna} foto={candidato.foto} tamanho="lg" />
        <div>
          <h1>{candidato.nomeUrna}</h1>
          <p className="partido">
            {candidato.sigla}
            {candidato.partido ? ` · ${candidato.partido}` : ""}
          </p>
        </div>
      </div>
      {slot ? (
        <Digitos total={slot.digits} valor={candidato.numero} preenchido />
      ) : null}
      <p className="nome-civil">{candidato.nome}</p>
      {candidato.julgamento ? (
        <p className="status">{candidato.julgamento}</p>
      ) : null}

      <section>
        <h2>Registro</h2>
        <dl>
          <Item termo="Ocupação" valor={candidato.ocupacao} />
          <Item termo="Escolaridade" valor={candidato.instrucao} />
          <Item
            termo="Idade na posse"
            valor={candidato.idade ? `${candidato.idade} anos` : ""}
          />
          <Item
            termo="Nascimento"
            valor={[candidato.nascimento, candidato.naturalidade, candidato.ufNascimento]
              .filter(Boolean)
              .join(" · ")}
          />
          <Item termo="Cor/raça" valor={candidato.corRaca} />
          <Item termo="Coligação" valor={candidato.coligacao} />
          <Item termo="Composição" valor={candidato.composicaoColigacao} />
          <Item
            termo="Federação"
            valor={
              candidato.federacao
                ? [candidato.federacao, candidato.composicaoFederacao]
                    .filter(Boolean)
                    .join(" · ")
                : ""
            }
          />
          <Item
            termo="Reeleição"
            valor={
              candidato.reeleicao === "S"
                ? "Sim"
                : candidato.reeleicao === "N"
                  ? "Não"
                  : ""
            }
          />
        </dl>
      </section>

      <section>
        <h2>Patrimônio declarado</h2>
        {candidato.bens.length === 0 ? (
          <p className="mudo">Nenhum bem declarado.</p>
        ) : (
          <>
            <p className="total">{brl(totalBens)}</p>
            <ul className="bens">
              {candidato.bens.map((bem, indice) => (
                <li key={`${bem.descricao}-${indice}`}>
                  <span>
                    <strong>{bem.tipo || "Bem"}</strong>
                    {bem.descricao ? <em>{bem.descricao}</em> : null}
                  </span>
                  <span>{bem.valor == null ? "—" : brl(bem.valor)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2>Contas de campanha</h2>
        <dl>
          <Item
            termo="Limite de gastos"
            valor={candidato.limiteGastos == null ? "" : brl(candidato.limiteGastos)}
          />
          <Item
            termo="Prestação de contas"
            valor={
              candidato.prestouContas === "S"
                ? "Entregue nesta extração"
                : "Ainda não consta nesta extração"
            }
          />
        </dl>
        <p className="mudo">
          Receitas e despesas linha a linha ficam no DivulgaCandContas. Esta base
          é de {geradoEm}.
        </p>
        <a
          href="https://divulgacandcontas.tse.jus.br/divulga/"
          target="_blank"
          rel="noreferrer"
        >
          Abrir o DivulgaCandContas
        </a>
      </section>

      {executivo ? (
        <section>
          <h2>Proposta de governo</h2>
          {candidato.propostas.length === 0 ? (
            <p className="mudo">
              O TSE não anexou PDF de proposta para esta candidatura no pacote
              que temos.
            </p>
          ) : (
            <ul className="propostas">
              {candidato.propostas.map((proposta) => (
                <li key={proposta.arquivo}>
                  <a href={proposta.arquivo} target="_blank" rel="noreferrer">
                    Documento {proposta.ordem}
                    {proposta.paginas ? ` · ${proposta.paginas} páginas` : ""}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section>
          <h2>Proposta de governo</h2>
          <p className="mudo">
            O TSE só exige esse PDF de quem disputa presidente ou governador.
          </p>
        </section>
      )}

      {candidato.redes.length > 0 ? (
        <section>
          <h2>Redes declaradas</h2>
          <ul className="redes">
            {candidato.redes.map((rede) => (
              <li key={rede}>
                <a href={hrefRede(rede)} target="_blank" rel="noreferrer">
                  {rede}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

function Item({ termo, valor }: { termo: string; valor: string }) {
  if (!valor) return null;
  return (
    <div>
      <dt>{termo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
