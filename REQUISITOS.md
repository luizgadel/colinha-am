# Requisitos — colinha de votos AM 2026

Site de referência para montar e compartilhar a colinha da eleição de 2026 no Amazonas: o eleitor escolhe os candidatos, vê os números no formato da urna e a foto do candidato, anota um comentário em cada voto preenchido e manda o recado para a família. O front é Next.js, exportado como site estático.

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

### 13. Comentário sobre a escolha

**Status:** implementado

Depois que um dos seis votos está preenchido, o card ganha um campo de texto livre para o eleitor anotar o motivo daquela escolha. Card vazio não mostra o campo.

- [x] Um comentário por slot (`df`, `de`, `s1`, `s2`, `gov`, `pr`), independente dos outros.
- [x] **“limpar”** apaga o candidato e o comentário daquele voto.
- [x] O texto vai na mesma URL da colinha (feature 10), em parâmetros próprios: `cdf`, `cde`, `cs1`, `cs2`, `cgov`, `cpr`. Comentário vazio omite o parâmetro.
- [x] Cada texto cabe num parágrafo curto, para o link continuar abrindo no WhatsApp. O teto é de 210 caracteres.
- [x] A versão papel (feature 11) imprime o comentário embaixo do candidato daquele cargo.

### 14. Comentário sob demanda

**Status:** implementado

No card preenchido, o campo de texto não aparece sozinho. Há um controle **“comentar”**. O campo só abre depois do clique.

- [x] Card vazio continua sem “comentar” e sem campo.
- [x] Se o voto já tem comentário, o texto permanece visível e “comentar” abre o campo para editar.
- [x] Fechar o campo não apaga o texto. **“limpar”** continua apagando voto e comentário.

### 15. Fotos de deputado e senador

**Status:** implementado

A foto de deputado federal, deputado estadual e senador precisa aparecer no card e na ficha, como já acontece com governador e presidente. Imagem que não carrega não pode ficar quebrada: nesse caso, mostrar as iniciais.

- [x] Deputado federal, deputado estadual e senador mostram a foto no card e na ficha.
- [x] Se a imagem não carrega, o lugar da foto mostra as iniciais.

### 16. Cursor na digitação do número

**Status:** implementado

Ao clicar numa caixa de número ainda vazia, o cursor de texto fica visível nessa caixa, para indicar que a digitação vai acontecer ali.

- [x] O clique na caixa vazia mostra o cursor de texto na caixa que vai receber o próximo dígito.
- [x] Cada dígito digitado avança o cursor para a caixa vazia seguinte.

### 17. Limite do comentário em 210 caracteres

**Status:** implementado

O campo de comentário aceita no máximo 210 caracteres. O que passar disso não entra no campo nem na URL. Vale no lugar do teto de 200 da feature 13.

- [x] O campo recusa o que passar de 210 caracteres.
- [x] A URL guarda no máximo esses 210 caracteres.

---

## Fora desta imagem (backlog)

Não aparecem na captura; ficam para depois, se quisermos ir além da colinha:

- Patrimônio, doações e gastos de campanha na ficha
- Emendas, CEAPS e voto parlamentar (só incumbentes)
- Demais cargos/UFs além do recorte AM + presidente
- 2º turno (governador/presidente) em 25/10, se houver

---

## Plano: reescrever o front em Next.js

**Status:** implementado

As features 1–13 permanecem. A troca é só da ferramenta que serve e empacota o React: Next.js no lugar de Vite e `react-router`.

Ficam como estão o script `scripts/build-candidatos.mjs`, o `web/public/data/candidatos.json` e os PDFs em `web/public/propostas`. Não há backend novo.

### Forma alvo

- [x] Next.js com App Router e TypeScript, ainda dentro de `web/`. O Next trata `src` como raiz, então o App Router ficou em `web/src/app`. As telas saíram de `src/pages` (pasta reservada pelo Next) e foram para `web/src/telas`.
- [x] `output: 'export'`, para o resultado continuar um site estático (GitHub Pages, Cloudflare Pages ou equivalente).
- [x] Rotas: `src/app/page.tsx` (home), `src/app/candidato/[sq]/page.tsx`, `src/app/imprimir/page.tsx`.
- [x] Cards, busca, dígitos, comentário e leitura da URL em componentes com `"use client"`.
- [x] `public/` segue servindo `/data/candidatos.json` e `/propostas/*.pdf`.
- [x] `basePath` vazio, porque o site está na raiz do domínio. Se a publicação for em subcaminho (`/colinha-am` no GitHub Pages), configurar `basePath`.

### Passos

1. [x] Trocar dependências em `web/package.json`: sair `vite`, `@vitejs/plugin-react` e `react-router-dom`; entrar `next`.
2. [x] Mover as páginas para o App Router e remover `main.tsx`, `index.html`, `vite.config.ts` e o `App.tsx` que montava o `BrowserRouter`.
3. [x] Trocar `Link` e a leitura da query pelos equivalentes de `next/link` e `next/navigation`. Manter `df`, `de`, `s1`, `s2`, `gov`, `pr` e os parâmetros de comentário da feature 13.
4. [x] Continuar carregando `/data/candidatos.json` no cliente, para a colinha funcionar no export estático.
5. [x] Conferir no browser as features 1–13: seis cards, busca, senador repetido bloqueado, URL, impressão, PDF e comentário.
6. [x] Apontar `dev` e `build` para o Next e apagar a configuração do Vite.

### Fora deste plano

Não entra reescrita do script que monta os candidatos, nem troca para webpack, nem servidor próprio.
