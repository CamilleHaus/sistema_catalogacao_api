export function buildCollectionCode(
  numeroManual: string,
  codigoCliente: string,
) {
  return `${numeroManual.trim()}_${codigoCliente}`;
}
