export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function normalizar(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function hrefRede(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export function iniciais(nome: string) {
  const partes = nome
    .split(/\s+/)
    .filter((parte) => parte.length > 1);
  const letras = (partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "");
  return letras.toUpperCase() || nome.slice(0, 2).toUpperCase();
}
