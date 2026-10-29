import { useState } from 'react';

const ENDPOINT = 'http://localhost:8081/graphql';

// Consulta individual por código: interfaz distinta a la del listado.
const CONSULTA_INSTRUMENTO = `
  query ConsultarInstrumentoPorCodigo($codigo: Int!) {
    instrumentoPorCodigo(codigo: $codigo) {
      id
      nombre
      precio
      fechaVenta
      numeroCuerdas
      numeroTrastes
      accesorio {
        id
        nombre
        precio
      }
    }
  }
`;

async function graphql(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.map(e => e.message).join('\n') || 'Error de conexión con el servidor.');
  }
  return json.data;
}

/** Consulta un único instrumento de cuerda por su ID (no lista todos los registros). */
export default function ConsultarInstrumentoCRUD() {
  const [idBuscar, setIdBuscar] = useState('');
  const [instrumento, setInstrumento] = useState(null);
  const [idConsultado, setIdConsultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const limpiar = () => {
    setIdBuscar('');
    setInstrumento(null);
    setIdConsultado(null);
    setError('');
  };

  const consultar = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInstrumento(null);
    setIdConsultado(null);

    const codigo = Number(idBuscar);
    if (!idBuscar.trim() || !Number.isInteger(codigo) || codigo <= 0) {
      setError('El ID debe ser un número entero positivo. Ejemplo: 101.');
      return;
    }

    setCargando(true);
    try {
      const data = await graphql(CONSULTA_INSTRUMENTO, { codigo });
      setInstrumento(data?.instrumentoPorCodigo ?? null);
      setIdConsultado(codigo);
    } catch (err) {
      setError(`No se pudo realizar la consulta: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const accesoriosVinculados = instrumento?.accesorio ?? [];

  return (
    <section style={styles.section}>
      <header style={styles.header}>
        <h2 style={styles.title}>Consultar instrumento de cuerda</h2>
        <span style={styles.badge}>Consulta individual</span>
      </header>
      <p style={styles.description}>
        Escribe el ID del instrumento y presiona <strong>Consultar</strong> (o la tecla Enter) para ver
        únicamente ese registro con todos sus datos.
      </p>

      <form onSubmit={consultar} style={styles.searchCard}>
        <label htmlFor="consulta-instrumento-id" style={styles.label}>ID del instrumento:</label>
        <div style={styles.searchRow}>
          <input
            id="consulta-instrumento-id"
            type="number"
            min="1"
            step="1"
            autoFocus
            placeholder="Ej: 101"
            value={idBuscar}
            onChange={e => setIdBuscar(e.target.value)}
            style={styles.field}
            aria-describedby="consulta-instrumento-ayuda"
          />
          <button type="submit" style={styles.button} disabled={cargando}>
            {cargando ? 'Consultando…' : 'Consultar'}
          </button>
          <button type="button" style={styles.buttonSecondary} onClick={limpiar} disabled={cargando}>
            Limpiar
          </button>
        </div>
        <p id="consulta-instrumento-ayuda" style={styles.hint}>
          Presiona Enter para consultar. El ID debe ser un entero positivo.
        </p>
      </form>

      {error && <div role="alert" style={styles.errorBox}>{error}</div>}

      {!error && idConsultado !== null && !cargando && !instrumento && (
        <div role="status" style={styles.notFoundBox}>
          No se encontró un instrumento de cuerda con el ID #{idConsultado}.
        </div>
      )}

      {!error && idConsultado === null && !cargando && (
        <div style={styles.emptyPrompt}>
          Ingresa un ID y presiona Consultar para ver el detalle de un instrumento de cuerda.
        </div>
      )}

      {instrumento && !error && (
        <article style={styles.detailCard}>
          <h3 style={styles.detailTitle}>{instrumento.nombre}</h3>
          <dl style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>ID</dt>
              <dd style={styles.detailValue}>#{instrumento.id}</dd>
            </div>
            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Precio</dt>
              <dd style={styles.detailPrice}>${Number(instrumento.precio ?? 0).toFixed(2)}</dd>
            </div>
            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Fecha de venta</dt>
              <dd style={styles.detailValue}>{instrumento.fechaVenta || 'Sin registrar'}</dd>
            </div>
            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Número de cuerdas</dt>
              <dd style={styles.detailValue}>{instrumento.numeroCuerdas ?? 'Sin registrar'}</dd>
            </div>
            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Número de trastes</dt>
              <dd style={styles.detailValue}>{instrumento.numeroTrastes ?? 'Sin registrar'}</dd>
            </div>
          </dl>

          <h4 style={styles.detailSubtitle}>Accesorios vinculados ({accesoriosVinculados.length})</h4>
          {accesoriosVinculados.length === 0 ? (
            <p style={styles.detailEmpty}>Este instrumento no tiene accesorios vinculados.</p>
          ) : (
            <ul style={styles.list}>
              {accesoriosVinculados.map(accesorio => (
                <li key={accesorio.id} style={styles.listItem}>
                  <span style={styles.listName}>{accesorio.nombre}</span>
                  <span style={styles.listMeta}>#{accesorio.id} · ${Number(accesorio.precio ?? 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}
    </section>
  );
}

const styles = {
  section: {
    padding: 24,
    maxWidth: 1100,
    margin: '0 auto',
    color: '#0f172a',
    background: '#ffffff',
    minHeight: 420,
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 16,
    marginBottom: 12,
    flexWrap: 'wrap'
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: '#172554' },
  badge: {
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600
  },
  description: { color: '#475569', fontSize: 14, lineHeight: 1.6, margin: '0 0 18px 0' },
  searchCard: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20
  },
  searchRow: { display: 'flex', gap: 10, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  field: {
    display: 'block',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 260,
    padding: 10,
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    fontSize: 14,
    background: '#ffffff',
    color: '#0f172a',
    outline: 'none'
  },
  hint: { margin: '10px 0 0 0', fontSize: 12, color: '#64748b' },
  button: {
    padding: '10px 20px',
    border: 0,
    borderRadius: 6,
    background: '#172554',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  },
  buttonSecondary: {
    padding: '10px 20px',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    background: '#ffffff',
    color: '#334155',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  },
  errorBox: {
    background: '#ffe8e8',
    color: '#8b0000',
    border: '1px solid #fca5a5',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    marginBottom: 16
  },
  notFoundBox: {
    background: '#fffbeb',
    border: '1px solid #fcd34d',
    color: '#b45309',
    padding: '14px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 16
  },
  emptyPrompt: {
    textAlign: 'center',
    padding: 40,
    color: '#64748b',
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
    fontSize: 14
  },
  detailCard: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 20,
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  detailTitle: { margin: '0 0 16px 0', fontSize: 18, color: '#172554' },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    margin: 0
  },
  detailItem: {
    background: '#eff6ff',
    border: '1px solid #dbeafe',
    borderRadius: 6,
    padding: '10px 12px'
  },
  detailLabel: { margin: 0, fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px' },
  detailValue: { margin: '4px 0 0 0', fontSize: 15, fontWeight: 500, color: '#0f172a' },
  detailPrice: { margin: '4px 0 0 0', fontSize: 15, fontWeight: 700, color: '#166534', fontFamily: 'monospace' },
  detailSubtitle: { margin: '22px 0 10px 0', fontSize: 14, fontWeight: 700, color: '#334155' },
  detailEmpty: { margin: 0, fontSize: 14, color: '#64748b' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 14,
    flexWrap: 'wrap'
  },
  listName: { fontWeight: 500, color: '#0f172a' },
  listMeta: { color: '#64748b', fontFamily: 'monospace' }
};
