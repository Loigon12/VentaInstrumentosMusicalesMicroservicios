export const ENDPOINT = 'http://localhost:8081/graphql';

/**
 * Ejecuta una consulta o mutación GraphQL y devuelve `data`.
 * Lanza un Error con un mensaje legible si no hay conexión, la respuesta es inválida
 * o el servidor devuelve errores de GraphQL.
 */
export async function graphql(query, variables = {}) {
  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor. Verifica que esté en ejecución en ${ENDPOINT}.`);
  }

  let json;
  try {
    json = await response.json();
  } catch {
    throw new Error(`El servidor respondió con un formato inesperado (HTTP ${response.status}).`);
  }

  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('\n'));
  if (!response.ok) throw new Error(`El servidor respondió con un error (HTTP ${response.status}).`);
  return json.data;
}
