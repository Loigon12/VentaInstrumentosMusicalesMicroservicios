using System.Collections.Generic;
using System.Linq;

namespace POCInstrumentoCuerda
{
    /// <summary>Contrato para las ventanas que deben actualizarse cuando cambian los datos.</summary>
    public interface ICambiable
    {
        void Cambio();
    }

    /// <summary>
    /// Implementación del patrón Observer para las ventanas abiertas del cliente.
    /// Notifica cambios confirmados por el servidor GraphQL.
    /// </summary>
    internal static class ServicioObserver
    {
        private static readonly object Sync = new object();
        private static readonly HashSet<ICambiable> Observadores = new HashSet<ICambiable>();

        public static void Agregar(ICambiable observador)
        {
            if (observador == null) return;
            lock (Sync) Observadores.Add(observador);
        }

        public static void Eliminar(ICambiable observador)
        {
            if (observador == null) return;
            lock (Sync) Observadores.Remove(observador);
        }

        public static void NotificarCambio()
        {
            ICambiable[] copia;
            lock (Sync) copia = Observadores.ToArray();
            foreach (var observador in copia)
            {
                try { observador.Cambio(); }
                catch { /* Un formulario cerrado no debe impedir notificar a los demás. */ }
            }
        }
    }
}
