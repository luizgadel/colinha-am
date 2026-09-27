# Requisitos — colinha de votos AM 2026

Site de referência para montar e compartilhar a colinha da eleição de 2026 no Amazonas: o eleitor escolhe os candidatos, vê os números no formato da urna e manda o recado para a família.

Referência visual da home: captura de [minhacolinha.com.br](https://minhacolinha.com.br) (seis votos na ordem da urna).

---

## 1. Home: cards de busca por cargo

Ao acessar o site, o usuário vê **cards de voto**, um por cargo pedido na urna de 2026, e pode procurar candidatos **pelo número** (e também pelo nome; ver feature 3).

Ordem e tamanho dos números (como na urna e na imagem):

| Card | Dígitos |
| --- | --- |
| Deputado(a) federal | 4 |
| Deputado(a) estadual | 5 |
| Senador · 1º voto | 3 |
| Senador · 2º voto | 3 |
| Governador | 2 |
| Presidente | 2 |

Observação: são **cinco cargos** e **seis votos** (dois senadores). A home segue os seis slots da imagem, não cinco cards.

Escopo inicial: eleições gerais 2026, circunscrição Amazonas (presidente é nacional).

---

## Features visíveis na imagem (a implementar)

### 2. Caixinhas no formato da urna

Cada card mostra círculos/caixas vazias na quantidade certa de dígitos. Quando o candidato está escolhido, os dígitos preenchidos aparecem grandes, um por caixa (ex.: `1 5 1 3`, `1 5 5`, `5 0 0`).

### 3. Busca pelo nome

Nos cards ainda vazios, o atalho **“Busque pelo nome”** abre busca por nome de urna ou nome civil, além da digitação do número.

### 4. Confirmação visual do candidato

Com alguém selecionado, o card mostra:

- foto oficial (TSE)
- nome de urna
- partido

Exemplo da captura: VANDA WITOTO / MDB, EDUARDO BRAGA / MDB, PROFESSORA EVANY / PSOL.

### 5. Limpar escolha

Link **“limpar”** no canto do card preenchido, para desfazer só aquele voto sem zerar o resto da colinha.

### 6. Dois votos de senador independentes

Dois cards separados (**1º voto** e **2º voto**), cada um com seu número. Não permitir o mesmo candidato nos dois slots.

### 7. Rótulo do cargo flexível (gênero)

O título do card acompanha quem foi escolhido: **DEPUTADA FEDERAL** / **DEPUTADO FEDERAL**, **SENADORA** / **SENADOR**. Vazio: forma neutra ou masculina padrão da urna.

### 8. Dois estados por card

- **Vazio:** só caixas + “Busque pelo nome”.
- **Preenchido:** dígitos + foto + nome + partido + “limpar”.

---

## Features implícitas na mesma tela (vale implementar)

Estas não têm botão próprio na captura, mas a tela só funciona como colinha se existirem:

### 9. Página do candidato

Foto, nome e número levam à ficha do candidato (dados TSE: partido, situação, ocupação, bens, contas de campanha). Senador: o que houver. Governador/presidente: proposta de governo em PDF quando o TSE tiver anexo.

### 10. Colinha persistente e compartilhável

A escolha dos seis votos precisa poder ser reaberta e enviada à família (URL com os números, ou similar). Sem isso, a home é só um buscador.

### 11. Imprimir / versão papel

A urna não aceita celular na cabina. Exportar a colinha na ordem dos cards, com as caixinhas e os nomes, para imprimir ou copiar.

### 12. Validação do número

Só aceitar número que exista para aquele cargo/UF em 2026. Número incompleto continua em digitação; número inválido não “finge” candidato.

---

## Fora desta imagem (backlog)

Não aparecem na captura; ficam para depois, se quisermos ir além da colinha:

- Patrimônio, doações e gastos de campanha na ficha
- Emendas, CEAPS e voto parlamentar (só incumbentes)
- Demais cargos/UFs além do recorte AM + presidente
- 2º turno (governador/presidente) em 25/10, se houver
