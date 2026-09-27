import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const csvDir = path.join(root, "dados", "tse", "csv");
const fotoDir = path.join(root, "dados", "tse", "fotos");
const outDir = path.join(root, "web", "public", "data");
const propostaOut = path.join(root, "web", "public", "propostas");
const propostaSrc = "C:/Users/Luiz/Downloads/proposta_governo_2026_AM (1)/AM";

const CARGOS = {
  "DEPUTADO FEDERAL": { id: "df", digits: 4 },
  "DEPUTADO ESTADUAL": { id: "de", digits: 5 },
  SENADOR: { id: "sen", digits: 3 },
  GOVERNADOR: { id: "gov", digits: 2 },
  PRESIDENTE: { id: "pres", digits: 2 },
};

function splitCsvLine(line) {
  const cols = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if (ch === ";" && !quoted) {
      cols.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cols.push(cur);
  return cols;
}

function readCsv(file) {
  const text = new TextDecoder("latin1").decode(fs.readFileSync(file));
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    header.forEach((key, index) => {
      row[key] = cols[index] ?? "";
    });
    return row;
  });
}

function clean(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "#NULO" || text === "#NE" || text === "-1") return "";
  return text;
}

function money(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "-1" || text === "#NULO" || text === "#NE") return null;
  const normalized = text.includes(",")
    ? text.replace(/\./g, "").replace(",", ".")
    : text;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function padNumero(value, digits) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .padStart(digits, "0");
}

function indexBySq(rows) {
  const map = new Map();
  for (const row of rows) map.set(row.SQ_CANDIDATO, row);
  return map;
}

function groupBySq(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.SQ_CANDIDATO;
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }
  return map;
}

function pdfPages(file) {
  try {
    const output = execFileSync("pdfinfo", [file], { encoding: "utf8" });
    const match = output.match(/Pages:\s+(\d+)/);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

function loadFotos() {
  const fotos = new Map();
  const governador = JSON.parse(
    fs.readFileSync(path.join(fotoDir, "candidato-foto-governador.json"), "utf8"),
  );
  for (const [numero, url] of Object.entries(governador.estados?.am ?? {})) {
    fotos.set(`gov:${String(numero).padStart(2, "0")}`, fotoOriginal(url));
  }
  const presidente = JSON.parse(
    fs.readFileSync(path.join(fotoDir, "candidato-foto-presidente.json"), "utf8"),
  );
  for (const [numero, url] of Object.entries(presidente)) {
    fotos.set(`pres:${String(numero).padStart(2, "0")}`, fotoOriginal(url));
  }
  return fotos;
}

function loadFotosTse() {
  const fotos = new Map();
  const zip = path.join(fotoDir, "foto_cand2026_AM_div.zip");
  const publicDir = path.join(root, "web", "public", "fotos");
  if (fs.existsSync(zip)) {
    fs.mkdirSync(publicDir, { recursive: true });
    execFileSync("tar", ["-xf", zip, "-C", publicDir]);
    const leiame = path.join(publicDir, "leiame.pdf");
    if (fs.existsSync(leiame)) fs.unlinkSync(leiame);
  }
  if (!fs.existsSync(publicDir)) return fotos;
  for (const name of fs.readdirSync(publicDir)) {
    const match = name.match(/^FAM(\d+)_div\.jpg$/i);
    if (match) fotos.set(match[1], `/fotos/${name}`);
  }
  return fotos;
}

function fotoOriginal(url) {
  return String(url);
}

function propostasPorCandidato() {
  const map = new Map();
  if (!fs.existsSync(propostaSrc)) return map;
  fs.mkdirSync(propostaOut, { recursive: true });
  for (const name of fs.readdirSync(propostaSrc)) {
    const match = name.match(/^2026AM(\d+)_(\d+)\.pdf$/i);
    if (!match) continue;
    const sq = match[1];
    const ordem = match[2];
    const source = path.join(propostaSrc, name);
    const filename = `${sq}_${ordem}.pdf`;
    fs.copyFileSync(source, path.join(propostaOut, filename));
    const list = map.get(sq) ?? [];
    list.push({
      arquivo: `/propostas/${filename}`,
      ordem: Number(ordem),
      paginas: pdfPages(source),
    });
    map.set(sq, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.ordem - b.ordem);
  return map;
}

const am = readCsv(path.join(csvDir, "consulta_cand_2026_AM.csv"));
const br = readCsv(path.join(csvDir, "consulta_cand_2026_BR.csv"));
const complementar = indexBySq([
  ...readCsv(path.join(csvDir, "consulta_cand_complementar_2026_AM.csv")),
  ...readCsv(path.join(csvDir, "consulta_cand_complementar_2026_BR.csv")),
]);
const bens = groupBySq([
  ...readCsv(path.join(csvDir, "bem_candidato_2026_AM.csv")),
  ...readCsv(path.join(csvDir, "bem_candidato_2026_BR.csv")),
]);
const redes = groupBySq([
  ...readCsv(path.join(csvDir, "rede_social_candidato_2026_AM.csv")),
  ...readCsv(path.join(csvDir, "rede_social_candidato_2026_BR.csv")),
]);
const fotos = loadFotos();
const fotosTse = loadFotosTse();
const propostas = propostasPorCandidato();

const candidatos = [];
for (const row of [...am, ...br]) {
  const cargo = CARGOS[row.DS_CARGO];
  if (!cargo) continue;
  const extra = complementar.get(row.SQ_CANDIDATO) ?? {};
  const numero = padNumero(row.NR_CANDIDATO, cargo.digits);
  const itens = (bens.get(row.SQ_CANDIDATO) ?? [])
    .map((bem) => ({
      tipo: clean(bem.DS_TIPO_BEM_CANDIDATO),
      descricao: clean(bem.DS_BEM_CANDIDATO),
      valor: money(bem.VR_BEM_CANDIDATO),
    }))
    .filter((bem) => bem.tipo || bem.descricao || bem.valor != null);
  const links = (redes.get(row.SQ_CANDIDATO) ?? [])
    .map((rede) => clean(rede.DS_URL))
    .filter(Boolean);

  candidatos.push({
    sq: row.SQ_CANDIDATO,
    numero,
    nome: clean(row.NM_CANDIDATO),
    nomeUrna: clean(row.NM_URNA_CANDIDATO) || clean(row.NM_CANDIDATO),
    nomeSocial: clean(row.NM_SOCIAL_CANDIDATO),
    cargo: cargo.id,
    genero: clean(row.DS_GENERO),
    sigla: clean(row.SG_PARTIDO),
    partido: clean(row.NM_PARTIDO),
    federacao: clean(row.SG_FEDERACAO),
    federacaoNome: clean(row.NM_FEDERACAO),
    composicaoFederacao: clean(row.DS_COMPOSICAO_FEDERACAO),
    coligacao: clean(row.NM_COLIGACAO),
    composicaoColigacao: clean(row.DS_COMPOSICAO_COLIGACAO),
    julgamento: clean(extra.DS_SITUACAO_JULGAMENTO),
    ocupacao: clean(row.DS_OCUPACAO),
    instrucao: clean(row.DS_GRAU_INSTRUCAO),
    nascimento: clean(row.DT_NASCIMENTO),
    idade: Number(clean(extra.NR_IDADE_DATA_POSSE)) || null,
    naturalidade: clean(extra.NM_MUNICIPIO_NASCIMENTO),
    ufNascimento: clean(row.SG_UF_NASCIMENTO),
    corRaca: clean(row.DS_COR_RACA),
    reeleicao: clean(extra.ST_REELEICAO),
    limiteGastos: money(extra.VR_DESPESA_MAX_CAMPANHA),
    prestouContas: clean(extra.ST_PREST_CONTAS) || "N",
    uf: clean(row.SG_UF),
    foto: fotos.get(`${cargo.id}:${numero}`) || fotosTse.get(row.SQ_CANDIDATO) || "",
    bens: itens,
    redes: links,
    propostas: propostas.get(row.SQ_CANDIDATO) ?? [],
  });
}

candidatos.sort((a, b) => a.nomeUrna.localeCompare(b.nomeUrna, "pt"));

const payload = {
  geradoEm: am[0]?.DT_GERACAO ?? "",
  fonte: "TSE, conjunto Candidatos 2026 (espelho pùblico). Propostas de governo: pacote AM do TSE.",
  candidatos,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "candidatos.json"),
  JSON.stringify(payload),
);
const porCargo = {};
for (const candidato of candidatos) {
  porCargo[candidato.cargo] = (porCargo[candidato.cargo] ?? 0) + 1;
}
console.log(JSON.stringify({ total: candidatos.length, porCargo, propostas: propostas.size }));
