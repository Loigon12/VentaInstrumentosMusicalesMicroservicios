import React, { useState, useEffect } from 'react';
import InstrumentosCRUD from './InstrumentosCRUD';
import InstrumentosVientoCRUD from './InstrumentosVientoCRUD';
import { graphql } from '../servicios/graphqlClient';
import { ServicioObserver } from '../servicios/ServicioObserver';
import { validarId, validarPrecio, validarTexto, mensajeDeError } from '../servicios/validaciones';

// Enum de tipos de accesorio para coincidir EXACTAMENTE con el schema.graphqls
export const TipoAccesorio = Object.freeze({
  CUERDAPULSADA: 'CUERDAPULSADA',
  CUERDAFROTADA: 'CUERDAFROTADA'
});

export default function AccesorioCRUD({ vistaInicial = 'inicio', embebido = false }) {
  const [accesorios, setAccesorios] = useState([]);
  const [vistaActual, setVistaActual] = useState(vistaInicial);
  const [menuDesplegado, setMenuDesplegado] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [operacionInstrumentos, setOperacionInstrumentos] = useState('listar');
  const [operacionViento, setOperacionViento] = useState('listar');
  const [errorCarga, setErrorCarga] = useState('');

  // 1. CARGAR ACCESORIOS (Query). Además de cargar al abrir, el componente se registra como
  //    observador: cuando otra operación notifica un cambio la lista se vuelve a consultar.
  useEffect(() => {
    const cargarAccesorios = async () => {
      try {
        const data = await graphql(`query { accesorio { id nombre tipo precio marca idInstrumento } }`);
        if (data?.accesorio) setAccesorios(data.accesorio);
        setErrorCarga('');
      } catch (error) {
        console.error('Error al consultar los accesorios:', error);
        setErrorCarga(`No se pudieron cargar los accesorios: ${mensajeDeError(error)}`);
      }
    };
    cargarAccesorios();
    return ServicioObserver.agregar(cargarAccesorios);
  }, []);

  const recargarAccesorios = async () => {
    const data = await graphql(`query { accesorio { id nombre tipo precio marca idInstrumento } }`);
    const lista = data.accesorio || [];
    setAccesorios(lista);
    setErrorCarga('');
    return lista;
  };

  const cerrarMenus = () => setMenuDesplegado(null);

  const toggleMenu = (e, menu) => {
    e.stopPropagation();
    setMenuDesplegado(prev => prev === menu ? null : menu);
  };

  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setMenuDesplegado(null);
  };

  // 2. ADICIONAR ACCESORIO (Mutation). 
  const handleAdicionar = async (nuevo) => {
    // Verificación final de ID duplicado antes de enviar la mutación (Doble capa de seguridad)
    const dataVerificacion = await graphql(`query { accesorio { id } }`);
    const listaActualizada = dataVerificacion?.accesorio || [];
    if (listaActualizada.some(a => String(a.id) === String(nuevo.id))) {
      throw new Error(`Ya existe un accesorio registrado con el ID ${nuevo.id}. Ingrese un ID diferente.`);
    }

    const data = await graphql(
      `mutation AddAccesorio($input: AccesorioCuerdaInput!) {
        addAccesorio(input: $input) { id nombre tipo precio marca idInstrumento }
      }`,
      {
        input: {
          id: String(nuevo.id),
          nombre: nuevo.nombre,
          tipo: nuevo.tipo,
          precio: Number(nuevo.precio),
          marca: nuevo.marca,
          idInstrumento: String(nuevo.idInstrumento)
        }
      }
    );

    const creado = data?.addAccesorio;
    if (!creado) throw new Error('El servidor no devolvió el accesorio creado.');
    setAccesorios(prev => [...prev.filter(a => String(a.id) !== String(creado.id)), creado]);
    ServicioObserver.notificarCambio();
    cambiarVista('listar');
  };

  // 3. ELIMINAR ACCESORIO (Mutation)
  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Está seguro de eliminar el accesorio con ID #${id}?`)) return;
    try {
      const idValido = validarId(id, 'eliminar un accesorio');
      await graphql(
        `mutation DelAccesorio($input: Int!) { delAccesorio(input: $input) { id } }`,
        { input: idValido }
      );
      setAccesorios(prev => prev.filter(a => String(a.id) !== String(id)));
      ServicioObserver.notificarCambio();
    } catch (error) {
      alert(`No se pudo eliminar el accesorio: ${mensajeDeError(error)}`);
    }
  };

  const handleIniciarEdicion = (item) => {
    setEditandoId(item.id);
    cambiarVista('actualizar');
  };

  // 4. ACTUALIZAR ACCESORIO (Mutation). 
  const handleGuardarActualizacion = async (accesorioActualizado) => {
    const data = await graphql(
      `mutation EditAccesorio($input: AccesorioCuerdaInput!) {
        editAccesorio(input: $input) { id nombre tipo precio marca idInstrumento }
      }`,
      {
        input: {
          id: String(accesorioActualizado.id),
          nombre: accesorioActualizado.nombre,
          tipo: accesorioActualizado.tipo,
          precio: Number(accesorioActualizado.precio),
          marca: accesorioActualizado.marca,
          idInstrumento: String(accesorioActualizado.idInstrumento)
        }
      }
    );

    const actualizado = data?.editAccesorio;
    if (!actualizado) throw new Error('El servidor no devolvió el accesorio actualizado.');
    setAccesorios(prev => prev.map(a => String(a.id) === String(actualizado.id)
      ? { ...a, ...accesorioActualizado, ...actualizado }
      : a));
    ServicioObserver.notificarCambio();
    setEditandoId(null);
    cambiarVista('listar');
  };

  return (
    <div style={embebido ? styles.embeddedFrame : styles.windowFrame} onClick={cerrarMenus}>
      {!embebido && <>
      <div style={styles.windowTitleBar}>
        <div style={styles.titleLeft}>
          <span style={styles.titleText}>Venta de Instrumentos Musicales</span>
        </div>
        <div style={styles.windowControls}>
          <button style={styles.controlBtn} title="Minimizar">─</button>
          <button style={styles.controlBtn} title="Maximizar">□</button>
          <button style={{ ...styles.controlBtn, ...styles.closeBtn }} title="Cerrar">✕</button>
        </div>
      </div>

      <nav style={styles.navbar} onClick={(e) => e.stopPropagation()}>
        <button type="button" style={styles.navMenuBtn(false)} onClick={() => cambiarVista('inicio')}>Inicio</button>

        <button
          type="button"
          style={styles.navMenuBtn(false)}
          onClick={() => alert('Desarrollado por Juan Jose Cossio, Armando Antonio Lopez, Daniel Ayala y Sebastian Londoño.\n\nSistema de gestión conectado mediante GraphQL.\n© 2026 Todos los derechos reservados.')}
        >Acerca de</button>

        <div style={styles.menuWrapper}>
          <button type="button" style={styles.navMenuBtn(menuDesplegado === 'instrumento')} onClick={(e) => toggleMenu(e, 'instrumento')}>
            Instrumentos de cuerda <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
          </button>
          {menuDesplegado === 'instrumento' && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownOption} onClick={() => { setOperacionInstrumentos('adicionar'); cambiarVista('instrumentos'); }}>Adicionar instrumento</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionInstrumentos('listar'); cambiarVista('instrumentos'); }}>Listar instrumentos</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionInstrumentos('consultar'); cambiarVista('instrumentos'); }}>Consultar instrumento</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionInstrumentos('actualizar'); cambiarVista('instrumentos'); }}>Actualizar instrumento</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionInstrumentos('eliminar'); cambiarVista('instrumentos'); }}>Eliminar instrumento</button>
            </div>
          )}
        </div>

        <div style={styles.menuWrapper}>
          <button type="button" style={styles.navMenuBtn(menuDesplegado === 'viento')} onClick={(e) => toggleMenu(e, 'viento')}>
            Instrumentos de viento <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
          </button>
          {menuDesplegado === 'viento' && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownOption} onClick={() => { setOperacionViento('adicionar'); cambiarVista('viento'); }}>Adicionar instrumento</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionViento('listar'); cambiarVista('viento'); }}>Listar instrumentos</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionViento('consultar'); cambiarVista('viento'); }}>Consultar instrumento</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionViento('actualizar'); cambiarVista('viento'); }}>Actualizar instrumento</button>
              <button style={styles.dropdownOption} onClick={() => { setOperacionViento('eliminar'); cambiarVista('viento'); }}>Eliminar instrumento</button>
            </div>
          )}
        </div>

        <div style={styles.menuWrapper}>
          <button type="button" style={styles.navMenuBtn(menuDesplegado === 'accesorio')} onClick={(e) => toggleMenu(e, 'accesorio')}>
            Accesorios de cuerda <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
          </button>
          {menuDesplegado === 'accesorio' && (
            <div style={styles.dropdownMenu}>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('adicionar')}>Adicionar accesorio</button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('listar')}>Listar accesorios</button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('consultar')}>Consultar accesorio</button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('actualizar')}>Actualizar accesorio</button>
              <button style={styles.dropdownOption} onClick={() => cambiarVista('eliminar')}>Eliminar accesorio</button>
            </div>
          )}
        </div>
      </nav>
      </>}

      <main style={embebido ? styles.embeddedContentArea : styles.contentArea}>
        {errorCarga && <div role="alert" style={styles.errorBox}>{errorCarga}</div>}
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
            onRecargar={recargarAccesorios}
            onEliminar={handleEliminar}
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

        {vistaActual === 'instrumentos' && (
          <div style={styles.instrumentosWrapper}>
            <InstrumentosCRUD key={operacionInstrumentos} operacion={operacionInstrumentos} />
          </div>
        )}

        {vistaActual === 'viento' && (
          <div style={styles.instrumentosWrapper}>
            <InstrumentosVientoCRUD key={operacionViento} operacion={operacionViento} />
          </div>
        )}
      </main>

      {!embebido && <footer style={styles.statusBar}>
        <div style={styles.statusSection}>
          <span style={styles.statusDot} /> Vista Activa: <strong>{vistaActual.toUpperCase()}</strong>
        </div>
        <div style={styles.statusSection}>
          Registros en Base de Datos: <strong>{accesorios.length}</strong>
        </div>
      </footer>}
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
        <p style={styles.welcomeSubtitle}>Gestión de instrumentos de cuerda, instrumentos de viento y accesorios</p>
      </div>
      <div style={styles.welcomeCard}>
        <p style={styles.welcomeText}>¡Qué gusto verte por aquí! Tómate tu tiempo y siéntete como en casa.</p>
        <p style={styles.welcomeHint}>Selecciona una opción del menú superior para administrar instrumentos de cuerda, instrumentos de viento o accesorios.</p>
      </div>
    </div>
  );
}

function VistaAdicionar({ accesorios, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    tipo: TipoAccesorio.CUERDAPULSADA, 
    precio: '',
    marca: '',
    idInstrumento: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const contexto = 'crear un accesorio';
      const id = validarId(form.id, contexto);
      const nombre = validarTexto(form.nombre, 'el nombre', contexto);
      const precio = validarPrecio(form.precio, contexto);
      const marca = validarTexto(form.marca, 'la marca', contexto);
      const idInstrumento = validarId(form.idInstrumento, contexto, 'el ID del instrumento');
      
      // Validación Frontend de ID duplicado[cite: 1]
      if (accesorios.some(a => parseInt(a.id) === id)) {
        throw new Error(`Ya existe un accesorio con el ID ${id}. Ingrese uno diferente.`);
      }
      
      await onGuardar({ id, nombre, tipo: form.tipo, precio, marca, idInstrumento });
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Adicionar Accesorio de Cuerda</h2>
      </div>
      {error && <div role="alert" style={styles.errorBox}>{error}</div>}
      <form noValidate onSubmit={handleSubmit} style={styles.formLayout}>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID (Número entero):</label>
            <input
              type="number"
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
              placeholder="Ej: 101"
              value={form.idInstrumento}
              onChange={e => setForm({ ...form, idInstrumento: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.btnPrimary}>Guardar Registro</button>
          <button type="button" onClick={onCancelar} style={styles.btnSecondary}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

function VistaEliminar({ accesorios, onEliminar }) {
  const [idBuscar, setIdBuscar] = useState('');
  const accesorioEncontrado = accesorios.find(a => a.id.toString() === idBuscar.trim());
  let errorId = null;
  if (idBuscar.trim() !== '') {
    try { validarId(idBuscar, 'eliminar un accesorio'); } catch (err) { errorId = mensajeDeError(err); }
  }

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
          {errorId ? (
            <div role="alert" style={styles.errorBox}>{errorId}</div>
          ) : accesorioEncontrado ? (
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

function VistaListar({ accesorios, onRecargar, onEliminar }) {
  const [inputs, setInputs] = useState({ nombre: '', tipo: '', marca: '', idInstrumento: '' });
  const [itemsMostrar, setItemsMostrar] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const aplicarFiltros = () => {
    setItemsMostrar(filtrarAccesorios(accesorios, inputs));
    setDatosCargados(true);
  };

  const limpiarFiltros = () => {
    const vacio = { nombre: '', tipo: '', marca: '', idInstrumento: '' };
    setInputs(vacio);
    setItemsMostrar(accesorios);
    setDatosCargados(true);
  };

  const actualizarDesdeServidor = async () => {
    const lista = onRecargar ? await onRecargar() : accesorios;
    setItemsMostrar(lista);
    setDatosCargados(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      aplicarFiltros();
    }
  };

  return (
    <div>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Listar por Parámetros</h2>
        {datosCargados && <span style={{ fontSize: '12px', color: '#64748b' }}>{itemsMostrar.length} elementos encontrados</span>}
      </div>

      <div style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder="Filtrar por Nombre..."
            value={inputs.nombre}
            onChange={e => setInputs({ ...inputs, nombre: e.target.value })}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <select
            value={inputs.tipo}
            onChange={e => setInputs({ ...inputs, tipo: e.target.value })}
            style={styles.select}
          >
            <option value="">-- Todos los Tipos --</option>
            {Object.values(TipoAccesorio).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filtrar Marca..."
            value={inputs.marca}
            onChange={e => setInputs({ ...inputs, marca: e.target.value })}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="ID Instrumento..."
            value={inputs.idInstrumento}
            onChange={e => setInputs({ ...inputs, idInstrumento: e.target.value })}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button type="button" onClick={aplicarFiltros} style={styles.btnPrimary}>Buscar / Filtrar</button>
          <button type="button" onClick={limpiarFiltros} style={styles.btnSecondary}>Mostrar todos / Limpiar</button>
          {onRecargar && <button type="button" onClick={actualizarDesdeServidor} style={styles.btnSecondary}>Actualizar desde servidor</button>}
        </div>
      </div>

      {datosCargados ? (
        <TablaGeneral lista={itemsMostrar} onEliminar={onEliminar}/>
      ) : (
        <div style={styles.emptyPrompt}>Haz clic en Buscar / Filtrar, Mostrar todos / Limpiar o Actualizar desde servidor para visualizar los registros.</div>
      )}
    </div>
  );
}

function filtrarAccesorios(accesorios, filtros) {
  return accesorios.filter(a => {
    const matchNombre = a.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const matchTipo = filtros.tipo === '' || a.tipo === filtros.tipo;
    const matchMarca = a.marca.toLowerCase().includes(filtros.marca.toLowerCase());
    const matchInst = filtros.idInstrumento === '' || a.idInstrumento.toString() === filtros.idInstrumento;
    return matchNombre && matchTipo && matchMarca && matchInst;
  });
}

function VistaActualizar({ accesorios, editandoId, onSeleccionarId, onGuardar, onCancelar }) {
  const accesorioSeleccionado = accesorios.find(a => String(a.id) === String(editandoId));
  const [error, setError] = useState('');

  let errorId = null;
  if (editandoId !== null && editandoId !== undefined && editandoId !== '') {
    try {
      validarId(editandoId, 'actualizar un accesorio');
      if (!accesorioSeleccionado) errorId = `No se encontró ningún accesorio con el ID ${editandoId}.`;
    } catch (err) {
      errorId = mensajeDeError(err);
    }
  }

  const [form, setForm] = useState(accesorioSeleccionado || {
    id: '',
    nombre: '',
    tipo: TipoAccesorio.CUERDAPULSADA,
    precio: '',
    marca: '',
    idInstrumento: ''
  });

  React.useEffect(() => {
    if (accesorioSeleccionado) {
      setForm(accesorioSeleccionado);
    }
  }, [editandoId, accesorioSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const contexto = 'actualizar un accesorio';
      await onGuardar({
        ...form,
        id: validarId(form.id, contexto),
        nombre: validarTexto(form.nombre, 'el nombre', contexto),
        precio: validarPrecio(form.precio, contexto),
        marca: validarTexto(form.marca, 'la marca', contexto),
        idInstrumento: validarId(form.idInstrumento, contexto, 'el ID del instrumento')
      });
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerBlock}>
        <h2 style={styles.viewTitle}>Actualizar Accesorio</h2>
        <span style={styles.viewBadge}>Edición de Registro</span>
      </div>

      <div style={styles.filterCard}>
        <label style={styles.label}>Ingrese el ID a editar:</label>
        <input
          type="number"
          placeholder="Ej: 1"
          value={editandoId ?? ''}
          onChange={e => onSeleccionarId(e.target.value ? parseInt(e.target.value) : null)}
          style={{ ...styles.input, maxWidth: '320px', marginTop: '6px', display: 'block' }}
        />
        {errorId && <div role="alert" style={{ ...styles.errorBox, marginTop: '10px' }}>{errorId}</div>}
      </div>
      {error && <div role="alert" style={{ ...styles.errorBox, marginTop: '14px' }}>{error}</div>}

      {accesorioSeleccionado ? (
        <form noValidate onSubmit={handleSubmit} style={{ ...styles.formLayout, marginTop: '20px' }}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID (Bloqueado):</label>
              <input type="number" disabled value={form.id} style={{ ...styles.input, backgroundColor: '#f1f5f9', color: '#64748b' }} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre:</label>
              <input
                type="text"
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
              <label style={styles.label}>Precio ($ COP):</label>
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Marca Fabricante:</label>
              <input
                type="text"
                value={form.marca}
                onChange={e => setForm({ ...form, marca: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Instrumento:</label>
              <input
                type="number"
                value={form.idInstrumento}
                onChange={e => setForm({ ...form, idInstrumento: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.buttonRow}>
            <button type="submit" style={styles.btnPrimary}>Aplicar Cambios</button>
            <button type="button" onClick={onCancelar} style={styles.btnSecondary}>Cancelar</button>
          </div>
        </form>
      ) : (
        !errorId && <div style={styles.emptyPrompt}>Ingrese un ID válido en el campo superior para cargar el formulario de edición.</div>
      )}
    </div>
  );
}

function VistaConsultar({ accesorios }) {
  const [consulta, setConsulta] = useState({ id: '', nombre: '' });

  const resultados = accesorios.filter(a => {
    const matchId = consulta.id === '' || a.id.toString() === consulta.id;
    const matchNombre = consulta.nombre === '' || a.nombre.toLowerCase().includes(consulta.nombre.toLowerCase());
    return (consulta.id !== '' || consulta.nombre !== '') && matchId && matchNombre;
  });

  let errorId = null;
  if (consulta.id.trim() !== '') {
    try { validarId(consulta.id, 'consultar un accesorio'); } catch (err) { errorId = mensajeDeError(err); }
  }

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

      {errorId ? (
        <div role="alert" style={styles.errorBox}>{errorId}</div>
      ) : consulta.id === '' && consulta.nombre === '' ? (
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
    return <div style={styles.emptyPrompt}>No se encontraron registros que coincidan con los criterios o la base de datos está vacía.</div>;
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
// SISTEMA DE ESTILOS INLINE
// -----------------------------------------------------------------------------

const styles = {
  errorBox: { background: '#ffe8e8', color: '#8b0000', border: '1px solid #f5b5b5', padding: '10px 14px', borderRadius: '6px', marginBottom: '12px', fontSize: '14px', whiteSpace: 'pre-line' },
  instrumentosWrapper: { backgroundColor: '#ffffff', minHeight: '420px', padding: '8px 0' },
  embeddedFrame: {
    width: '100%', minHeight: '420px', backgroundColor: '#fff', color: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif'
  },
  embeddedContentArea: { padding: '20px', minHeight: '420px', boxSizing: 'border-box', color: '#0f172a' },
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
    fontSize: '15px',
    opacity: 0.9
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    maxWidth: '500px'
  },
  welcomeText: {
    fontSize: '15px',
    color: '#334155',
    margin: '0 0 12px 0'
  },
  welcomeHint: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '28px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  headerBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px'
  },
  viewTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a'
  },
  viewBadge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '18px 24px'
  },
  filterCard: {
    backgroundColor: '#f1f5f9',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: '#ffffff',
    color: '#0f172a'
  },
  select: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    cursor: 'pointer'
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
    justifyContent: 'flex-start'
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    padding: '10px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnDanger: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteConfirmBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #f87171',
    borderRadius: '8px',
    padding: '20px',
    display: 'inline-block'
  },
  notFoundBox: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fcd34d',
    color: '#b45309',
    padding: '14px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  detailText: {
    margin: '4px 0',
    fontSize: '14px',
    color: '#334155'
  },
  emptyPrompt: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
    fontSize: '14px'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    fontSize: '14px'
  },
  tableHeaderRow: {
    backgroundColor: '#f1f5f9',
    borderBottom: '2px solid #cbd5e1'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#334155',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.15s'
  },
  td: {
    padding: '12px 16px',
    color: '#0f172a'
  },
  tdId: {
    padding: '12px 16px',
    fontWeight: '600',
    color: '#475569'
  },
  tdName: {
    padding: '12px 16px',
    fontWeight: '500',
    color: '#0f172a'
  },
  tdPrice: {
    padding: '12px 16px',
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#166534'
  },
  pillBadge: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusBar: {
    height: '32px',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: '24px',
    color: '#94a3b8',
    fontSize: '12px'
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
  }
};