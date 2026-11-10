using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace POCInstrumentoCuerda
{
    /// <summary>
    /// Validaciones del cliente. Cada método lanza una excepción con un mensaje claro cuando el dato
    /// no es válido y devuelve el valor ya convertido cuando sí lo es.
    ///
    /// "campo" se escribe con artículo en minúscula ("el ID", "la marca") y "contexto" describe la
    /// operación ("crear un instrumento", "consultar un accesorio"), de modo que los mensajes quedan
    /// como "No se puede crear un instrumento sin ID." o "El ID no puede ser negativo.".
    /// </summary>
    internal static class Validaciones
    {
        public static int Id(string valor, string contexto)
        {
            return Id(valor, "el ID", contexto);
        }

        public static int Id(string valor, string campo, string contexto)
        {
            return EnteroMayorQueCero(valor, campo, contexto);
        }

        public static int EnteroMayorQueCero(string valor, string campo, string contexto)
        {
            return Entero(valor, campo, contexto, true);
        }

        public static int EnteroNoNegativo(string valor, string campo, string contexto)
        {
            return Entero(valor, campo, contexto, false);
        }
        public static void VerificarIdDuplicado(int id, IEnumerable<int> idsExistentes)
        {
            if (idsExistentes != null && idsExistentes.Contains(id))
            {
                throw new InvalidOperationException("El ID ya existe.");
            }
        }
        public static double Precio(string valor, string contexto)
        {
            if (string.IsNullOrWhiteSpace(valor)) throw Faltante("el precio", contexto);
            double precio;
            if (!TryParseDouble(valor, out precio)) throw new ArgumentException("El precio debe ser un número válido.");
            if (precio < 0) throw new ArgumentException("El precio no puede ser negativo.");
            if (precio == 0) throw new ArgumentException("El precio debe ser mayor que cero.");
            return precio;
        }

        /// <summary>Filtro opcional de precio máximo: vacío significa "sin filtro".</summary>
        public static double? PrecioMaximoOpcional(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor)) return null;
            double precio;
            if (!TryParseDouble(valor, out precio)) throw new ArgumentException("El precio máximo debe ser un número válido.");
            if (precio < 0) throw new ArgumentException("El precio máximo no puede ser negativo.");
            return precio;
        }

        public static string TextoObligatorio(string valor, string campo, string contexto)
        {
            if (string.IsNullOrWhiteSpace(valor)) throw Faltante(campo, contexto);
            return valor.Trim();
        }

        /// <summary>Texto para mostrar al usuario a partir de cualquier excepción.</summary>
        /// <summary>Texto para mostrar al usuario a partir de cualquier excepción.</summary>
        public static string MensajeDeError(Exception ex)
        {
            if (ex == null) return "Ocurrió un error inesperado.";

            // 1. Interceptar errores de duplicidad
            if (!string.IsNullOrWhiteSpace(ex.Message))
            {
                string msg = ex.Message.ToLowerInvariant();

                bool errorMongoDb = msg.Contains("e11000") || msg.Contains("duplicate key");
                bool errorGraphQl = msg.Contains("ya existe") || msg.Contains("already exists");

                // Atrapa el error genérico oculto
                bool errorGenericoOculto = msg.Contains("internal_error for");

                if (errorMongoDb || errorGraphQl || errorGenericoOculto)
                {
                    return "El ID ya existe.";
                }
            }

            // 2. Errores de validación propios locales
            if (ex is ArgumentException || ex is InvalidOperationException) return ex.Message;

            // 3. Problemas de red
            for (Exception actual = ex; actual != null; actual = actual.InnerException)
            {
                string tipo = actual.GetType().Name;
                if (tipo == "HttpRequestException" || tipo == "WebException" || tipo == "SocketException" ||
                    tipo == "TaskCanceledException" || tipo == "TimeoutException" || tipo == "GraphQLHttpRequestException")
                {
                    return "No se pudo conectar con el servidor. Verifique que esté en ejecución.";
                }
            }
            return string.IsNullOrWhiteSpace(ex.Message) ? "Ocurrió un error inesperado." : ex.Message;
        }


        private static int Entero(string valor, string campo, string contexto, bool soloPositivo)
        {
            if (string.IsNullOrWhiteSpace(valor)) throw Faltante(campo, contexto);

            string texto = valor.Trim();
            int numero;
            if (!int.TryParse(texto, NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture, out numero))
            {
                if (Regex.IsMatch(texto, @"^[+-]?\d+$"))
                {
                    throw new ArgumentException(texto.StartsWith("-")
                        ? Capitalizar(campo) + " no puede ser negativo."
                        : Capitalizar(campo) + " es demasiado grande.");
                }
                throw new ArgumentException(Capitalizar(campo) + " debe ser un número entero.");
            }

            if (numero < 0) throw new ArgumentException(Capitalizar(campo) + " no puede ser negativo.");
            if (soloPositivo && numero == 0) throw new ArgumentException(Capitalizar(campo) + " debe ser mayor que cero.");
            return numero;
        }

        private static bool TryParseDouble(string valor, out double resultado)
        {
            string texto = valor.Trim();
            return double.TryParse(texto, NumberStyles.Number, CultureInfo.CurrentCulture, out resultado) ||
                   double.TryParse(texto, NumberStyles.Number, CultureInfo.InvariantCulture, out resultado);
        }

        private static ArgumentException Faltante(string campo, string contexto)
        {
            return new ArgumentException("No se puede " + contexto + " sin " + SinArticulo(campo) + ".");
        }

        private static string SinArticulo(string campo)
        {
            foreach (string articulo in new[] { "el ", "la ", "los ", "las " })
            {
                if (campo.StartsWith(articulo, StringComparison.OrdinalIgnoreCase)) return campo.Substring(articulo.Length);
            }
            return campo;
        }

        private static string Capitalizar(string texto)
        {
            return string.IsNullOrEmpty(texto) ? texto : char.ToUpper(texto[0]) + texto.Substring(1);
        }
    }
}
