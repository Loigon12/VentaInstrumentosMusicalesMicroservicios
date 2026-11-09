// Patrón Observer del cliente React (equivalente a ServicioObserver / ICambiable del cliente C#).
//
// Los componentes que muestran listados se registran como observadores (una función "cambio").
// Cada vez que una operación confirmada por el servidor modifica los datos
// (adicionar, actualizar o eliminar) se llama a notificarCambio() y todos los observadores
// registrados vuelven a consultar sus datos.

const observadores = new Set();

export const ServicioObserver = {
  /** Registra un observador. Devuelve una función para darlo de baja. */
  agregar(observador) {
    if (typeof observador !== 'function') return () => {};
    observadores.add(observador);
    return () => ServicioObserver.eliminar(observador);
  },

  eliminar(observador) {
    observadores.delete(observador);
  },

  /** Avisa a todos los observadores que los datos del servidor cambiaron. */
  notificarCambio() {
    Array.from(observadores).forEach((observador) => {
      try {
        observador();
      } catch (error) {
        // Un observador defectuoso no debe impedir notificar a los demás.
        console.error('Error en un observador:', error);
      }
    });
  }
};
