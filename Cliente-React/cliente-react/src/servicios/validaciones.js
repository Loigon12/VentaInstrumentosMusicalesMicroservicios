// Validaciones del cliente. Cada función lanza un Error con un mensaje claro cuando el dato
// no es válido, y devuelve el valor ya convertido cuando sí lo es.
//
// `campo` se escribe con artículo en minúscula ("el ID", "la marca") y `contexto` describe la
// operación ("crear un instrumento", "consultar un accesorio"), de modo que los mensajes quedan
// como "No se puede crear un instrumento sin ID." o "El ID no puede ser negativo."

const sinArticulo = (campo) => campo.replace(/^(el|la|los|las)\s+/i, '');
const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);
const estaVacio = (valor) => valor === undefined || valor === null || String(valor).trim() === '';
const faltante = (campo, contexto) => new Error(`No se puede ${contexto} sin ${sinArticulo(campo)}.`);

/** Entero obligatorio. Con soloPositivo = true el cero también se rechaza. */
export function validarEntero(valor, campo, contexto, soloPositivo = true) {
  if (estaVacio(valor)) throw faltante(campo, contexto);
  const texto = String(valor).trim();
  if (!/^-?\d+$/.test(texto)) throw new Error(`${capitalizar(campo)} debe ser un número entero.`);
  const numero = Number(texto);
  if (numero < 0) throw new Error(`${capitalizar(campo)} no puede ser negativo.`);
  if (soloPositivo && numero === 0) throw new Error(`${capitalizar(campo)} debe ser mayor que cero.`);
  if (!Number.isSafeInteger(numero) || numero > 2147483647) throw new Error(`${capitalizar(campo)} es demasiado grande.`);
  return numero;
}

export const validarId = (valor, contexto, campo = 'el ID') => validarEntero(valor, campo, contexto, true);

export function validarPrecio(valor, contexto) {
  if (estaVacio(valor)) throw faltante('el precio', contexto);
  const numero = Number(String(valor).trim().replace(',', '.'));
  if (!Number.isFinite(numero)) throw new Error('El precio debe ser un número válido.');
  if (numero < 0) throw new Error('El precio no puede ser negativo.');
  if (numero === 0) throw new Error('El precio debe ser mayor que cero.');
  return numero;
}

export function validarTexto(valor, campo, contexto) {
  if (estaVacio(valor)) throw faltante(campo, contexto);
  return String(valor).trim();
}

export function validarFecha(valor, contexto) {
  if (estaVacio(valor)) throw faltante('la fecha de venta', contexto);
  const texto = String(valor).trim();
  const fecha = new Date(`${texto}T00:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto) || Number.isNaN(fecha.getTime())) {
    throw new Error('La fecha de venta no es válida.');
  }
  return texto;
}

/** Texto para mostrar al usuario a partir de cualquier error. */
export function mensajeDeError(error) {
  return error?.message || 'Ocurrió un error inesperado.';
}
