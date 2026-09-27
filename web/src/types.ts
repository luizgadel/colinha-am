export type CargoId = "df" | "de" | "sen" | "gov" | "pres";

export type SlotId = "df" | "de" | "s1" | "s2" | "gov" | "pr";

export type Bem = {
  tipo: string;
  descricao: string;
  valor: number | null;
};

export type Proposta = {
  arquivo: string;
  ordem: number;
  paginas: number | null;
};

export type Candidato = {
  sq: string;
  numero: string;
  nome: string;
  nomeUrna: string;
  nomeSocial: string;
  cargo: CargoId;
  genero: string;
  sigla: string;
  partido: string;
  federacao: string;
  federacaoNome: string;
  composicaoFederacao: string;
  coligacao: string;
  composicaoColigacao: string;
  julgamento: string;
  ocupacao: string;
  instrucao: string;
  nascimento: string;
  idade: number | null;
  naturalidade: string;
  ufNascimento: string;
  corRaca: string;
  reeleicao: string;
  limiteGastos: number | null;
  prestouContas: string;
  uf: string;
  foto: string;
  bens: Bem[];
  redes: string[];
  propostas: Proposta[];
};

export type BaseCandidatos = {
  geradoEm: string;
  fonte: string;
  candidatos: Candidato[];
};
