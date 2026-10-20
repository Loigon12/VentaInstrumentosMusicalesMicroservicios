import React from 'react';
import { gql, useQuery } from '@apollo/client';

const OBTENER_INSTRUMENTOS = gql`
  query ObtenerInstrumentosDeCuerda {
    instrumentosDeCuerda {
      id
      nombre
      marca
      accesorios {
        id
        nombre
        precio
      }
    }
  }
`;

function Instrumentos() {
  // Ejecutamos la consulta
  const { loading, error, data } = useQuery(OBTENER_INSTRUMENTOS);

  if (loading) return <p>Cargando instrumentos...</p>;
  if (error) return <p>Error al cargar: {error.message}</p>;

  return (
    <div>
      <h2>Instrumentos de Cuerda</h2>
      <ul>
        {data.instrumentosDeCuerda.map((instrumento) => (
          <li key={instrumento.id}>
            <strong>{instrumento.nombre}</strong> ({instrumento.marca})
            {/* Mostrar accesorios si existen */}
            {instrumento.accesorios && instrumento.accesorios.length > 0 && (
              <ul>
                {instrumento.accesorios.map((accesorio) => (
                  <li key={accesorio.id}>Accesorio: {accesorio.nombre}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Instrumentos;