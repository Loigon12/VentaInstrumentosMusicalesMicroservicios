import React, { useState } from 'react';

// Enum de tipos de accesorio para instrumento de cuerda
export const TipoAccesorio = Object.freeze({
  CUERDAS: 'Cuerdas',
  AFINADOR: 'Afinador',
  CAPO: 'Capocastro',
  PUA: 'Púa / Plectro',
  ESTUCHE: 'Estuche / Funda',
  CORREA: 'Correa / Tahalí',
  SOPORTE: 'Soporte',
  SORDINA: 'Sordina / Mute',
  OTRO: 'Otro'
});

export default function App() {
  // Estado principal de datos de accesorios
  const [accesorios, setAccesorios] = useState([
    { id: 1, nombre: 'Juego de Cuerdas Calibre 0.10', tipo: TipoAccesorio.CUERDAS, precio: 45500, marca: "D'Addario", idInstrumento: 101 },
    { id: 2, nombre: 'Afinador Clip Cromático', tipo: TipoAccesorio.AFINADOR, precio: 25000, marca: 'Snark', idInstrumento: 101 },
    { id: 3, nombre: 'Capo de Aluminio', tipo: TipoAccesorio.CAPO, precio: 18990, marca: 'Kyser', idInstrumento: 102 }
  ]);

  // Vistas: 'inicio' | 'adicionar' | 'eliminar' | 'listar' | 'actualizar' | 'consultar'
  const [vistaActual, setVistaActual] = useState('inicio');

  // Menú desplegable activo: null | 'archivo' | 'accesorio' | 'ayuda'
  const [menuDesplegado, setMenuDesplegado] = useState(null);

  // ID seleccionado para la vista de actualizar
  const [editandoId, setEditandoId] = useState(null);

  const cerrarMenus = () => setMenuDesplegado(null);

  const toggleMenu = (e, menu) => {
    e.stopPropagation();
    setMenuDesplegado(prev => prev === menu ? null : menu);
  };

  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setMenuDesplegado(null);
  };

  // Handlers CRUD
  const handleAdicionar = (nuevo) => {
    setAccesorios([...accesorios, nuevo]);
    cambiarVista('listar');
  };

  const handleEliminar = (id) => {
    if (window.confirm(`¿Está seguro de eliminar el accesorio con ID #${id}?`)) {
      setAccesorios(accesorios.filter(a => a.id !== id));
    }
  };

  const handleIniciarEdicion = (item) => {
    setEditandoId(item.id);
    cambiarVista('actualizar');
  };

  const handleGuardarActualizacion = (accesorioActualizado) => {
    setAccesorios(accesorios.map(a => a.id === accesorioActualizado.id ? accesorioActualizado : a));
    setEditandoId(null);
    cambiarVista('listar');
  };

  return (
    <div style={styles.windowFrame} onClick={cerrarMenus}>
      {/* 1. BARRA DE TÍTULO TIPO WINDOWS / MACOS */}
      <div style={styles.windowTitleBar}>
        <div style={styles.titleLeft}>
          <span style={styles.titleText}>Venta de Instrumentos de Cuerda</span>
        </div>
        <div style={styles.windowControls}>
          <button style={styles.controlBtn} title="Minimizar">─</button>
          <button style={styles.controlBtn} title="Maximizar">□</button>
          <button style={{ ...styles.controlBtn, ...styles.closeBtn }} title="Cerrar">✕</button>
        </div>
      </div>

      {/* 2. NAVBAR SUPERIOR CON MENÚS DESPLEGABLES (PERMANENTE) */}
      <nav style={styles.navbar} onClick={(e) => e.stopPropagation()}>
        {/* Opción Archivo */}
        <div style={styles.menuWrapper}>
          <button
            style={styles.navMenuBtn(menuDesplegado === 'archivo')}
            onClick={(e) => toggleMenu(e, 'archivo')}
          >
            Archivo <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
          </button>
          {menuDesplegado === 'archivo' && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('inicio')}>
                <span></span> Inicio
              </button>
              <div style={styles.dropdownDivider} />
              <button style={styles.dropdownOption} onClick={() => { if (window.confirm('¿Reiniciar la aplicación?')) window.location.reload(); }}>
                <span></span> Reiniciar App
              </button>
            </div>
          )}
        </div>

        {/* Opción AccesorioInstrumentoCuerda */}
        <div style={styles.menuWrapper}>
          <button
            style={styles.navMenuBtn(menuDesplegado === 'accesorio')}
            onClick={(e) => toggleMenu(e, 'accesorio')}
          >
            AccesorioInstrumentoCuerda <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
          </button>
          {menuDesplegado === 'accesorio' && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('adicionar')}>
                <span style={styles.iconAdd}></span> Adicionar Accesorio
              </button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('eliminar')}>
                <span style={styles.iconDelete}></span> Eliminar Accesorio
              </button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('listar')}>
                <span style={styles.iconList}></span> Listar Accesorio
              </button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('actualizar')}>
                <span style={styles.iconEdit}></span> Actualizar Accesorio
              </button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('consultar')}>
                <span style={styles.iconSearch}></span> Consulta Accesorio
              </button>
            </div>
          )}
        </div>

        {/* Opción Ayuda */}
        <div style={styles.menuWrapper}>
          <button
            style={styles.navMenuBtn(menuDesplegado === 'ayuda')}
            onClick={(e) => toggleMenu(e, 'ayuda')}
          >
            Ayuda <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
          </button>
          {menuDesplegado === 'ayuda' && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownOption} onClick={() => alert('Desarrollado por\nJuan Jose Cossio, Armando Antonio Lopez, Sebastian Londoño y Daniel Ayala.\n\nProyecto de Gestión de Accesorios de Instrumentos de Cuerda.\n\n© 2026 Todos los derechos reservados.')}>
                <span>ℹ</span> Acerca de...
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 3. ÁREA DE CONTENIDO DINÁMICO (NO QUITA EL NAVBAR) */}
      <main style={styles.contentArea}>
        {vistaActual === 'inicio' && <VistaInicio />}

        {vistaActual === 'adicionar' && (
          <VistaAdicionar
            accesorios={accesorios}
            onGuardar={handleAdicionar}
            onCancelar={() => cambiarVista('inicio')}
          />
        )}

        {vistaActual === 'eliminar' && (
          <VistaEliminar
            accesorios={accesorios}
            onEliminar={handleEliminar}
          />
        )}

        {vistaActual === 'listar' && (
          <VistaListar
            accesorios={accesorios}
          />
        )}

        {vistaActual === 'actualizar' && (
          <VistaActualizar
            accesorios={accesorios}
            editandoId={editandoId}
            onSeleccionarId={setEditandoId}
            onGuardar={handleGuardarActualizacion}
            onCancelar={() => cambiarVista('inicio')}
          />
        )}

        {vistaActual === 'consultar' && (
          <VistaConsultar
            accesorios={accesorios}
            onEditar={handleIniciarEdicion}
            onEliminar={handleEliminar}
          />
        )}
      </main>

      {/* 4. BARRA DE ESTADO INFERIOR */}
      <footer style={styles.statusBar}>
        <div style={styles.statusSection}>
          <span style={styles.statusDot} /> Vista Activa: <strong>{vistaActual.toUpperCase()}</strong>
        </div>
        <div style={styles.statusSection}>
          Registros en Base de Datos: <strong>{accesorios.length}</strong>
        </div>
      </footer>
    </div>
  );
}

// -----------------------------------------------------------------------------
// COMPONENTES DE VISTA INDIVIDUALES
// -----------------------------------------------------------------------------

function VistaInicio() {
  return (
    <div style={styles.welcomeContainer}>
      <div style={styles.welcomeBanner}>
        <h1 style={styles.welcomeTitle}>Bienvenido a la tienda de Instrumentos</h1>
        <p style={styles.welcomeSubtitle}>Módulo de Gestión de Accesorios de Cuerda</p>
      </div>
      <div style={styles.welcomeCard}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}></div>
        <p style={styles.welcomeText}>¡Qué gusto verte por aquí! Tómate tu tiempo y siéntete como en casa.</p>
        <p style={styles.welcomeHint}>Selecciona una opción del menú superior <strong>AccesorioInstrumentoCuerda</strong> para comenzar.</p>
      </div>
    </div>
  );
}

function VistaAdicionar({ accesorios, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    tipo: TipoAccesorio.CUERDAS,
    precio: '',
    marca: '',
    idInstrumento: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const idNum = form.id ? parseInt(form.id) : Date.now();
    if (accesorios.some(a => a.id === idNum)) {
      alert('El ID ingresado ya existe. Por favor ingrese uno diferente.');
      return;
    }
    onGuardar({
      id: idNum,
      nombre: form.nombre,
      tipo: form.tipo,
      precio: parseFloat(form.precio),
      marca: form.marca,
      idInstrumento: parseInt(form.idInstrumento)
    });
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Adicionar Accesorio de Cuerda</h2>
        
      </div>
      <form onSubmit={handleSubmit} style={styles.formLayout}>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID (Número entero):</label>
            <input
              type="number"
              required
              placeholder="Ej: 104"
              value={form.id}
              onChange={e => setForm({ ...form, id: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre del Accesorio:</label>
            <input
              type="text"
              required
              placeholder="Ej: Cuerdas de Nylon High Tension"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipo / Categoría:</label>
            <select
              value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value })}
              style={styles.select}
            >
              {Object.values(TipoAccesorio).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Precio ($ COP):</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ej: 25500"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Marca Fabricante:</label>
            <input
              type="text"
              required
              placeholder="Ej: Savarez / D'Addario"
              value={form.marca}
              onChange={e => setForm({ ...form, marca: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID Instrumento Asociado:</label>
            <input
              type="number"
              required
              placeholder="Ej: 101"
              value={form.idInstrumento}
              onChange={e => setForm({ ...form, idInstrumento: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.btnPrimary}> Guardar Registro</button>
          <button type="button" onClick={onCancelar} style={styles.btnSecondary}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

function VistaEliminar({ accesorios, onEliminar }) {
  const [idBuscar, setIdBuscar] = useState('');
  const accesorioEncontrado = accesorios.find(a => a.id.toString() === idBuscar.trim());

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Eliminar Accesorio</h2>
        
      </div>

      <div style={styles.filterCard}>
        <label style={styles.label}>Buscar por ID para eliminar:</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <input
            type="number"
            placeholder="Ingrese ID..."
            value={idBuscar}
            onChange={e => setIdBuscar(e.target.value)}
            style={{ ...styles.input, maxWidth: '240px' }}
          />
        </div>
      </div>

      {idBuscar !== '' && (
        <div style={{ marginTop: '16px' }}>
          {accesorioEncontrado ? (
            <div style={styles.deleteConfirmBox}>
              <h4 style={{ margin: '0 0 10px 0', color: '#991b1b' }}>Accesorio localizado:</h4>
              <p style={styles.detailText}><strong>ID:</strong> #{accesorioEncontrado.id}</p>
              <p style={styles.detailText}><strong>Nombre:</strong> {accesorioEncontrado.nombre}</p>
              <p style={styles.detailText}><strong>Marca:</strong> {accesorioEncontrado.marca}</p>
              <p style={styles.detailText}><strong>Precio:</strong> ${accesorioEncontrado.precio.toFixed(2)}</p>
              <button
                onClick={() => { onEliminar(accesorioEncontrado.id); setIdBuscar(''); }}
                style={styles.btnDanger}
              >
                 Confirmar Eliminación Permanente
              </button>
            </div>
          ) : (
            <div style={styles.notFoundBox}>No se encontró ningún registro con el ID "{idBuscar}".</div>
          )}
        </div>
      )}

      <h3 style={{ marginTop: '28px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tabla de eliminación directa:</h3>
      <TablaGeneral lista={accesorios} onEliminar={onEliminar} soloEliminar />
    </div>
  );
}

function VistaListar({ accesorios }) {
  const [filtros, setFiltros] = useState({ nombre: '', tipo: '', marca: '', idInstrumento: '' });

  const filtrados = accesorios.filter(a => {
    const matchNombre = a.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const matchTipo = filtros.tipo === '' || a.tipo === filtros.tipo;
    const matchMarca = a.marca.toLowerCase().includes(filtros.marca.toLowerCase());
    const matchInst = filtros.idInstrumento === '' || a.idInstrumento.toString() === filtros.idInstrumento;
    return matchNombre && matchTipo && matchMarca && matchInst;
  });

  return (
    <div>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Listar por Parámetros</h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} elementos encontrados</span>
      </div>

      <div style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder=" Filtrar por Nombre..."
            value={filtros.nombre}
            onChange={e => setFiltros({ ...filtros, nombre: e.target.value })}
            style={styles.input}
          />
          <select
            value={filtros.tipo}
            onChange={e => setFiltros({ ...filtros, tipo: e.target.value })}
            style={styles.select}
          >
            <option value="">-- Todos los Tipos --</option>
            {Object.values(TipoAccesorio).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder=" Filtrar Marca..."
            value={filtros.marca}
            onChange={e => setFiltros({ ...filtros, marca: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder=" ID Instrumento..."
            value={filtros.idInstrumento}
            onChange={e => setFiltros({ ...filtros, idInstrumento: e.target.value })}
            style={styles.input}
          />
        </div>
      </div>

      <TablaGeneral lista={filtrados}/>
    </div>
  );
}

function VistaActualizar({ accesorios, editandoId, onSeleccionarId, onGuardar, onCancelar }) {
  const accesorioSeleccionado = accesorios.find(a => a.id === editandoId);

  const [form, setForm] = useState(accesorioSeleccionado || {
    id: '',
    nombre: '',
    tipo: TipoAccesorio.CUERDAS,
    precio: '',
    marca: '',
    idInstrumento: ''
  });

  React.useEffect(() => {
    if (accesorioSeleccionado) {
      setForm(accesorioSeleccionado);
    }
  }, [editandoId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      ...form,
      precio: parseFloat(form.precio),
      idInstrumento: parseInt(form.idInstrumento)
    });
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Actualizar Accesorio</h2>
        <span style={styles.viewBadge}>Edición de Registro</span>
      </div>

      <div style={styles.filterCard}>
        <label style={styles.label}>Seleccione el ID a editar:</label>
        <select
          value={editandoId || ''}
          onChange={e => onSeleccionarId(e.target.value ? parseInt(e.target.value) : null)}
          style={{ ...styles.select, maxWidth: '320px', marginTop: '6px' }}
        >
          <option value="">-- Seleccionar registro --</option>
          {accesorios.map(a => (
            <option key={a.id} value={a.id}>ID #{a.id} - {a.nombre}</option>
          ))}
        </select>
      </div>

      {accesorioSeleccionado ? (
        <form onSubmit={handleSubmit} style={{ ...styles.formLayout, marginTop: '20px' }}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID (Bloqueado):</label>
              <input type="number" disabled value={form.id} style={{ ...styles.input, backgroundColor: '#f1f5f9', color: '#64748b' }} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre:</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tipo / Categoría:</label>
              <select
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
                style={styles.select}
              >
                {Object.values(TipoAccesorio).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Precio ($ USD):</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Marca Fabricante:</label>
              <input
                type="text"
                required
                value={form.marca}
                onChange={e => setForm({ ...form, marca: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Instrumento:</label>
              <input
                type="number"
                required
                value={form.idInstrumento}
                onChange={e => setForm({ ...form, idInstrumento: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.buttonRow}>
            <button type="submit" style={styles.btnPrimary}> Aplicar Cambios</button>
            <button type="button" onClick={onCancelar} style={styles.btnSecondary}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div style={styles.emptyPrompt}>Seleccione un ID en el desplegable superior para cargar el formulario de edición.</div>
      )}
    </div>
  );
}

function VistaConsultar({ accesorios, onEditar, onEliminar }) {
  const [consulta, setConsulta] = useState({ id: '', nombre: '' });

  const resultados = accesorios.filter(a => {
    const matchId = consulta.id === '' || a.id.toString() === consulta.id;
    const matchNombre = consulta.nombre === '' || a.nombre.toLowerCase().includes(consulta.nombre.toLowerCase());
    return (consulta.id !== '' || consulta.nombre !== '') && matchId && matchNombre;
  });

  return (
    <div>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Consulta por Parámetros</h2>
      </div>

      <div style={styles.filterCard}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Buscar por ID Exacto:</label>
            <input
              type="number"
              placeholder="Ej: 1"
              value={consulta.id}
              onChange={e => setConsulta({ ...consulta, id: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Buscar por Nombre o Coincidencia:</label>
            <input
              type="text"
              placeholder="Ej: Cuerdas..."
              value={consulta.nombre}
              onChange={e => setConsulta({ ...consulta, nombre: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {consulta.id === '' && consulta.nombre === '' ? (
        <div style={styles.emptyPrompt}> Ingrese un ID o un nombre en el panel superior para realizar la consulta.</div>
      ) : (
        <TablaGeneral lista={resultados} />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// TABLA REUTILIZABLE CON DISEÑO DATA GRID MODERNO
// -----------------------------------------------------------------------------

function TablaGeneral({ lista = false }) {
  if (lista.length === 0) {
    return <div style={styles.emptyPrompt}>No se encontraron registros que coincidan con los criterios.</div>;
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nombre del Accesorio</th>
            <th style={styles.th}>Tipo / Categoría</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Marca</th>
            <th style={styles.th}>ID Inst.</th>
            
          </tr>
        </thead>
        <tbody>
          {lista.map(item => (
            <tr key={item.id} style={styles.tr}>
              <td style={styles.tdId}>#{item.id}</td>
              <td style={styles.tdName}>{item.nombre}</td>
              <td style={styles.td}>
                <span style={styles.pillBadge}>{item.tipo}</span>
              </td>
              <td style={styles.tdPrice}>${item.precio.toFixed(2)}</td>
              <td style={styles.td}>{item.marca}</td>
              <td style={styles.td}>#{item.idInstrumento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SISTEMA DE ESTILOS INLINE - ESCRITORIO MODERNO (FLUENT / WINUI 3)
// -----------------------------------------------------------------------------

const styles = {
  windowFrame: {
    maxWidth: '1050px',
    margin: '20px auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.18)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#0f172a',
    overflow: 'hidden',
    minHeight: '620px',
    display: 'flex',
    flexDirection: 'column'
  },
  windowTitleBar: {
    height: '36px',
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '14px',
    userSelect: 'none'
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  appBadge: {
    fontSize: '13px'
  },
  titleText: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#f8fafc',
    letterSpacing: '0.2px'
  },
  windowControls: {
    display: 'flex',
    height: '100%'
  },
  controlBtn: {
    width: '42px',
    height: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer'
  },
  closeBtn: {
    color: '#f8fafc'
  },
  navbar: {
    backgroundColor: '#1e293b',
    display: 'flex',
    padding: '0 8px',
    borderBottom: '1px solid #334155',
    position: 'relative',
    zIndex: 100
  },
  menuWrapper: {
    position: 'relative'
  },
  navMenuBtn: (activo) => ({
    padding: '8px 16px',
    backgroundColor: activo ? '#2563eb' : 'transparent',
    color: '#ffffff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.15s ease'
  }),
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '220px',
    padding: '6px',
    zIndex: 200
  },
  dropdownOption: {
    padding: '9px 12px',
    backgroundColor: 'transparent',
    color: '#1e293b',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    outline: 'none'
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '4px 0'
  },
  contentArea: {
    padding: '24px',
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '24px'
  },
  welcomeBanner: {
    background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '24px 36px',
    textAlign: 'center',
    width: '90%',
    boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.25)'
  },
  welcomeTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600'
  },
  welcomeSubtitle: {
    margin: '6px 0 0 0',
    fontSize: '14px',
    color: '#93c5fd'
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '40px 30px',
    textAlign: 'center',
    width: '90%',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  welcomeText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  welcomeHint: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  cardContainer: {
    maxWidth: '750px',
    margin: '0 auto'
  },
  headerBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  viewTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#0f172a'
  },
  viewBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '20px'
  },
  filterCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '10px'
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155'
  },
  input: {
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#ffffff'
  },
  select: {
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#ffffff'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '14px'
  },
  btnPrimary: {
    padding: '9px 18px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
  },
  btnSecondary: {
    padding: '9px 18px',
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  btnDanger: {
    padding: '9px 16px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px'
  },
  deleteConfirmBox: {
    padding: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px'
  },
  detailText: {
    margin: '4px 0',
    fontSize: '13px',
    color: '#7f1d1d'
  },
  notFoundBox: {
    padding: '12px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '6px',
    fontSize: '13px'
  },
  tableWrapper: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px'
  },
  tableHeaderRow: {
    backgroundColor: '#f1f5f9',
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    padding: '10px 14px',
    fontWeight: '600',
    color: '#475569',
    fontSize: '12px'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9'
  },
  td: {
    padding: '10px 14px',
    color: '#334155'
  },
  tdId: {
    padding: '10px 14px',
    fontWeight: '600',
    color: '#2563eb'
  },
  tdName: {
    padding: '10px 14px',
    fontWeight: '500',
    color: '#0f172a'
  },
  tdPrice: {
    padding: '10px 14px',
    fontWeight: '600',
    color: '#15803d'
  },
  pillBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  btnActionEdit: {
    marginRight: '6px',
    padding: '4px 8px',
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer'
  },
  btnActionDelete: {
    padding: '4px 8px',
    backgroundColor: '#ffffff',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer'
  },
  emptyPrompt: {
    padding: '30px',
    textAlign: 'center',
    color: '#64748b',
    backgroundColor: '#ffffff',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    fontSize: '13px'
  },
  statusBar: {
    height: '28px',
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
    fontSize: '11px',
    color: '#94a3b8'
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statusDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#22c55e',
    borderRadius: '50%'
  }
};