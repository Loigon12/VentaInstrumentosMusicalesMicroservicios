import React, { useEffect, useRef, useState } from 'react';
import { graphql } from '../servicios/graphqlClient';
import { ServicioObserver } from '../servicios/ServicioObserver';
import { validarId, validarEntero, validarPrecio, validarTexto, validarFecha, mensajeDeError } from '../servicios/validaciones';
import { field, th, td, button, buttonSecondary, buttonDanger } from './estilosCRUD';

const hoy = () => new Date().toISOString().slice(0, 10);
const vacio = () => ({ id: '', nombre: '', precio: '', fechaVenta: hoy(), numeroCuerdas: '6', numeroTrastes: '0' });
const ok = (texto) => ({ tipo: 'ok', texto });
const fallo = (texto) => ({ tipo: 'error', texto });

async function traerInstrumentos(nombreFiltro) {
  const data = await graphql(`query($nombre:String,$precioMaximo:Float) {
    instrumento(nombre:$nombre, precioMaximo:$precioMaximo) {
      id nombre precio fechaVenta fechaRegistro numeroCuerdas numeroTrastes
      accesorio { id nombre precio marca idInstrumento fechaRegistro }
    }
  }`, { nombre: nombreFiltro || null, precioMaximo: null });
  return data.instrumento || [];
}

export default function InstrumentosCRUD({ operacion = 'todos' }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [modo, setModo] = useState('crear');
  const [filtro, setFiltro] = useState('');
  const [aviso, setAviso] = useState(null);
  const [cargando, setCargando] = useState(false);
  // Pasa a true cuando el usuario pulsa Buscar / Mostrar todos: solo desde ahí actúa el observer.
  const [consultado, setConsultado] = useState(false);
  const ultimoFiltro = useRef('');

  // Listar: únicamente se ejecuta desde los botones Buscar / Mostrar todos / Actualizar lista.
  async function consultar(nombreFiltro) {
    ultimoFiltro.current = nombreFiltro.trim();
    setCargando(true);
    try {
      setItems(await traerInstrumentos(ultimoFiltro.current));
      setConsultado(true);
      setAviso(null);
    } catch (e) {
      setAviso(fallo(`No se pudieron cargar los instrumentos: ${mensajeDeError(e)}`));
    } finally {
      setCargando(false);
    }
  }

  // Observer: después de la primera consulta, la lista se vuelve a cargar sola (con el mismo
  // filtro) cada vez que se notifica un cambio de datos (adicionar, actualizar, eliminar).
  useEffect(() => {
    if (!consultado) return undefined;
    const refrescar = async () => {
      try {
        setItems(await traerInstrumentos(ultimoFiltro.current));
      } catch (e) {
        setAviso(fallo(`No se pudo actualizar la lista: ${mensajeDeError(e)}`));
      }
    };
    return ServicioObserver.agregar(refrescar);
  }, [consultado]);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const reiniciarFormulario = () => { setForm(vacio()); setModo('crear'); };
  const limpiar = () => { reiniciarFormulario(); setAviso(null); };

  async function guardar(e) {
    e.preventDefault();
    setAviso(null);
    try {
      const contexto = modo === 'editar' ? 'actualizar un instrumento' : 'crear un instrumento';
      const input = {
        id: String(validarId(form.id, contexto)),
        nombre: validarTexto(form.nombre, 'el nombre', contexto),
        precio: validarPrecio(form.precio, contexto),
        fechaVenta: validarFecha(form.fechaVenta, contexto),
        numeroCuerdas: validarEntero(form.numeroCuerdas, 'el número de cuerdas', contexto, true),
        numeroTrastes: validarEntero(form.numeroTrastes, 'el número de trastes', contexto, false)
      };
      if (modo === 'editar') {
        await graphql(`mutation($input:InstrumentoInput!){ editInstrumento(input:$input){ id } }`, { input });
      } else {
        await graphql(`mutation($input:InstrumentoInput!){ addInstrumento(input:$input){ id } }`, { input });
      }
      reiniciarFormulario();
      ServicioObserver.notificarCambio();
      setAviso(ok(operacion === 'adicionar' ? 'Instrumento adicionado correctamente.' : 'Cambios guardados correctamente.'));
    } catch (e) {
      setAviso(fallo(mensajeDeError(e)));
    }
  }

  async function eliminar(id) {
    if (!window.confirm(`¿Eliminar el instrumento ${id}? Sus accesorios asociados también se eliminarán.`)) return;
    try {
      const idValido = validarId(id, 'eliminar un instrumento');
      await graphql(`mutation($id:Int!){ delInstrumento(input:$id){ id } }`, { id: idValido });
      ServicioObserver.notificarCambio();
      setAviso(ok('Instrumento eliminado correctamente.'));
    } catch (e) {
      setAviso(fallo(mensajeDeError(e)));
    }
  }

  function editar(item) {
    setForm({ id: String(item.id), nombre: item.nombre, precio: String(item.precio),
      fechaVenta: item.fechaVenta, numeroCuerdas: String(item.numeroCuerdas), numeroTrastes: String(item.numeroTrastes) });
    setModo('editar');
    setAviso(null);
  }

  const mostrarFormulario = operacion === 'adicionar' || (operacion === 'actualizar' && modo === 'editar');
  const mostrarTabla = operacion !== 'adicionar' && !(operacion === 'actualizar' && modo === 'editar');
  const mostrarFiltro = ['consultar', 'listar', 'eliminar', 'actualizar', 'todos'].includes(operacion);

  return <section style={{ padding: 24, maxWidth: 1100, margin: '0 auto', color: '#222', background: '#fff', minHeight: 420, boxSizing: 'border-box' }}>
    <h2 style={{ color: '#172554', marginTop: 0 }}>{tituloOperacion(operacion)}</h2>
    <p>{descripcionOperacion(operacion)}</p>
    {aviso && <div role="alert" style={{ background: aviso.tipo === 'ok' ? '#e8f7ec' : '#ffe8e8', color: aviso.tipo === 'ok' ? '#166534' : '#8b0000', padding: 10, marginBottom: 12, borderRadius: 4, whiteSpace: 'pre-line' }}>{aviso.texto}</div>}

    {mostrarFormulario && <form noValidate onSubmit={guardar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, padding: 16, border: '1px solid #ccc', borderRadius: 6, marginBottom: 20, background: '#f8fafc' }}>
      <label>ID<input name="id" type="number" value={form.id} onChange={cambiar} disabled={modo === 'editar'} style={field}/></label>
      <label>Nombre<input name="nombre" value={form.nombre} onChange={cambiar} style={field}/></label>
      <label>Precio<input name="precio" type="number" step="any" value={form.precio} onChange={cambiar} style={field}/></label>
      <label>Fecha de venta<input name="fechaVenta" type="date" value={form.fechaVenta} onChange={cambiar} style={field}/></label>
      <label>Número de cuerdas<input name="numeroCuerdas" type="number" value={form.numeroCuerdas} onChange={cambiar} style={field}/></label>
      <label>Número de trastes<input name="numeroTrastes" type="number" value={form.numeroTrastes} onChange={cambiar} style={field}/></label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
        <button type="submit" style={button}>{modo === 'editar' ? 'Guardar cambios' : 'Adicionar'}</button>
        <button type="button" style={buttonSecondary} onClick={limpiar}>Limpiar</button>
      </div>
      {operacion === 'actualizar' && <button type="button" style={buttonSecondary} onClick={limpiar}>Volver a la lista</button>}
    </form>}

    {mostrarTabla && <>
      {mostrarFiltro && <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input placeholder="Consultar por nombre" value={filtro} onChange={e => setFiltro(e.target.value)} style={{ ...field, maxWidth: 280, marginTop: 0 }}/>
        <button style={button} onClick={() => consultar(filtro)}>Buscar</button>
        <button style={buttonSecondary} onClick={() => { setFiltro(''); consultar(''); }}>Mostrar todos</button>
        <button style={buttonSecondary} onClick={() => consultar(filtro)}>Actualizar lista</button>
      </div>}
      {cargando ? <p>Cargando instrumentos…</p> : <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr>{['ID','Nombre','Precio','Fecha venta','Registro','Cuerdas','Trastes','Accesorios vinculados', ...(operacion === 'actualizar' ? ['Acciones'] : []), ...(operacion === 'eliminar' ? ['Acciones'] : [])].map(x => <th key={x} style={th}>{x}</th>)}</tr></thead>
        <tbody>{items.map(item => <tr key={item.id}>
          {[item.id,item.nombre,item.precio,item.fechaVenta,item.fechaRegistro || 'Sin registrar',item.numeroCuerdas,item.numeroTrastes,(item.accesorio || []).map(a => `${a.nombre} ($${Number(a.precio ?? 0).toFixed(2)}, ${a.marca})`).join('; ') || 'Sin accesorios'].map((v,i) => <td key={i} style={td}>{v}</td>)}
          {operacion === 'actualizar' && <td style={td}><button style={button} onClick={() => editar(item)}>Actualizar</button></td>}
          {operacion === 'eliminar' && <td style={td}><button style={buttonDanger} onClick={() => eliminar(item.id)}>Eliminar</button></td>}
        </tr>)}</tbody>
      </table></div>}
      {!cargando && !consultado && <p>Pulsa «Buscar» o «Mostrar todos» para ver los instrumentos.</p>}
      {!cargando && consultado && items.length === 0 && <p>No se encontraron instrumentos.</p>}
    </>}
  </section>;
}

function tituloOperacion(op) {
  return ({ adicionar: 'Adicionar instrumento de cuerda', listar: 'Listado de instrumentos de cuerda', consultar: 'Consultar instrumentos de cuerda', actualizar: 'Actualizar instrumento de cuerda', eliminar: 'Eliminar instrumento de cuerda', todos: 'Gestión de instrumentos de cuerda' })[op] || 'Gestión de instrumentos de cuerda';
}
function descripcionOperacion(op) {
  return ({ adicionar: 'Completa los datos para registrar un instrumento.', listar: 'Pulsa «Buscar» o «Mostrar todos» para consultar los instrumentos registrados en el servidor.', consultar: 'Filtra los instrumentos por nombre y revisa sus datos.', actualizar: 'Selecciona un instrumento de la lista para abrir su formulario de actualización.', eliminar: 'Selecciona el instrumento que deseas eliminar.', todos: 'Administra los instrumentos de cuerda registrados mediante GraphQL.' })[op] || '';
}
