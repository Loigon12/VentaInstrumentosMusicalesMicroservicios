import React, { useEffect, useState } from 'react';

const ENDPOINT = 'http://localhost:8081/graphql';
const vacio = { id: '', nombre: '', precio: '', fechaVenta: new Date().toISOString().slice(0, 10), numeroCuerdas: '6', numeroTrastes: '0' };

async function graphql(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) throw new Error(json.errors?.map(e => e.message).join('\n') || 'Error de conexión');
  return json.data;
}

export default function InstrumentosCRUD({ operacion = 'todos' }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [modo, setModo] = useState('crear');
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function cargar(nombreFiltro = filtro) {
    setCargando(true);
    try {
      const data = await graphql(`query($nombre:String,$precioMaximo:Float) {
        instrumento(nombre:$nombre, precioMaximo:$precioMaximo) {
          id nombre precio fechaVenta numeroCuerdas numeroTrastes accesorio { id }
        }
      }`, { nombre: nombreFiltro.trim() || null, precioMaximo: null });
      setItems(data.instrumento || []);
      setError('');
    } catch (e) { setError(`No se pudieron cargar los instrumentos: ${e.message}`); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(''); }, []); // Se consulta al abrir cada ventana del CRUD.

  const cambiar = e => setForm({ ...form, [e.target.name]: e.target.value });
  const limpiar = () => { setForm({ ...vacio, fechaVenta: new Date().toISOString().slice(0, 10) }); setModo('crear'); setError(''); };

  async function guardar(e) {
    e.preventDefault(); setError('');
    try {
      const input = {
        id: String(Number(form.id)), nombre: form.nombre.trim(),
        precio: Number(form.precio), fechaVenta: form.fechaVenta,
        numeroCuerdas: Number(form.numeroCuerdas), numeroTrastes: Number(form.numeroTrastes)
      };
      if (!input.id || Number(input.id) <= 0 || !input.nombre || input.precio <= 0 || input.numeroCuerdas <= 0 || input.numeroTrastes < 0)
        throw new Error('Verifica los campos: ID y nombre obligatorios, precio y cuerdas positivos, trastes no negativos.');
      if (modo === 'editar') {
        await graphql(`mutation($input:InstrumentoInput!){ editInstrumento(input:$input){ id } }`, { input });
      } else {
        await graphql(`mutation($input:InstrumentoInput!){ addInstrumento(input:$input){ id } }`, { input });
      }
      limpiar(); await cargar('');
      if (operacion === 'adicionar') setError('Instrumento adicionado correctamente.');
      else setError('Cambios guardados correctamente.');
    } catch (e) { setError(e.message); }
  }

  async function eliminar(id) {
    if (!window.confirm(`¿Eliminar el instrumento ${id}? Sus accesorios asociados también se eliminarán.`)) return;
    try {
      await graphql(`mutation($id:Int!){ delInstrumento(input:$id){ id } }`, { id: Number(id) });
      await cargar('');
      setError('Instrumento eliminado correctamente.');
    } catch (e) { setError(e.message); }
  }

  function editar(item) {
    setForm({ id: String(item.id), nombre: item.nombre, precio: String(item.precio),
      fechaVenta: item.fechaVenta, numeroCuerdas: String(item.numeroCuerdas), numeroTrastes: String(item.numeroTrastes) });
    setModo('editar'); setError('');
  }

  const mostrarFormulario = operacion === 'adicionar' || (operacion === 'actualizar' && modo === 'editar');
  const mostrarTabla = operacion !== 'adicionar' && !(operacion === 'actualizar' && modo === 'editar');
  const mostrarFiltro = ['consultar', 'listar', 'eliminar', 'actualizar', 'todos'].includes(operacion);

  return <section style={{ padding: 24, maxWidth: 1100, margin: '0 auto', color: '#222', background: '#fff', minHeight: 420, boxSizing: 'border-box' }}>
    <h2 style={{ color: '#172554', marginTop: 0 }}>{tituloOperacion(operacion)}</h2>
    <p>{descripcionOperacion(operacion)}</p>
    {error && <div role="alert" style={{ background: error.toLowerCase().includes('correctamente') ? '#e8f7ec' : '#ffe8e8', color: error.toLowerCase().includes('correctamente') ? '#166534' : '#8b0000', padding: 10, marginBottom: 12, borderRadius: 4 }}>{error}</div>}

    {mostrarFormulario && <form onSubmit={guardar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, padding: 16, border: '1px solid #ccc', borderRadius: 6, marginBottom: 20, background: '#f8fafc' }}>
      <label>ID<input name="id" type="number" min="1" required value={form.id} onChange={cambiar} disabled={modo === 'editar'} style={field}/></label>
      <label>Nombre<input name="nombre" required value={form.nombre} onChange={cambiar} style={field}/></label>
      <label>Precio<input name="precio" type="number" min="0.01" step="0.01" required value={form.precio} onChange={cambiar} style={field}/></label>
      <label>Fecha de venta<input name="fechaVenta" type="date" required value={form.fechaVenta} onChange={cambiar} style={field}/></label>
      <label>Número de cuerdas<input name="numeroCuerdas" type="number" min="1" required value={form.numeroCuerdas} onChange={cambiar} style={field}/></label>
      <label>Número de trastes<input name="numeroTrastes" type="number" min="0" required value={form.numeroTrastes} onChange={cambiar} style={field}/></label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
        <button type="submit" style={button}>{modo === 'editar' ? 'Guardar cambios' : 'Adicionar'}</button>
        <button type="button" style={buttonSecondary} onClick={limpiar}>Limpiar</button>
      </div>
      {operacion === 'actualizar' && <button type="button" style={buttonSecondary} onClick={() => { limpiar(); cargar(''); }}>Volver a la lista</button>}
    </form>}

    {mostrarTabla && <>
      {mostrarFiltro && <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input placeholder="Consultar por nombre" value={filtro} onChange={e => setFiltro(e.target.value)} style={{ ...field, maxWidth: 280, marginTop: 0 }}/>
        <button style={button} onClick={() => cargar(filtro)}>Buscar</button>
        <button style={buttonSecondary} onClick={() => { setFiltro(''); cargar(''); }}>Mostrar todos</button>
        <button style={buttonSecondary} onClick={() => cargar(filtro)}>Actualizar lista</button>
      </div>}
      {cargando ? <p>Cargando instrumentos…</p> : <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr>{['ID','Nombre','Precio','Fecha venta','Cuerdas','Trastes','IDs de accesorios vinculados', ...(operacion === 'actualizar' ? ['Acciones'] : []), ...(operacion === 'eliminar' ? ['Acciones'] : [])].map(x => <th key={x} style={th}>{x}</th>)}</tr></thead>
        <tbody>{items.map(item => <tr key={item.id}>
          {[item.id,item.nombre,item.precio,item.fechaVenta,item.numeroCuerdas,item.numeroTrastes,(item.accesorio || []).map(a => a.id).join(', ') || 'Sin accesorios'].map((v,i) => <td key={i} style={td}>{v}</td>)}
          {operacion === 'actualizar' && <td style={td}><button style={button} onClick={() => editar(item)}>Actualizar</button></td>}
          {operacion === 'eliminar' && <td style={td}><button style={buttonDanger} onClick={() => eliminar(item.id)}>Eliminar</button></td>}
        </tr>)}</tbody>
      </table></div>}
      {!cargando && items.length === 0 && <p>No se encontraron instrumentos.</p>}
    </>}
  </section>;
}

function tituloOperacion(op) {
  return ({ adicionar: 'Adicionar instrumento de cuerda', listar: 'Listado de instrumentos de cuerda', consultar: 'Consultar instrumentos de cuerda', actualizar: 'Actualizar instrumento de cuerda', eliminar: 'Eliminar instrumento de cuerda', todos: 'Gestión de instrumentos de cuerda' })[op] || 'Gestión de instrumentos de cuerda';
}
function descripcionOperacion(op) {
  return ({ adicionar: 'Completa los datos para registrar un instrumento.', listar: 'Consulta los instrumentos registrados en el servidor.', consultar: 'Filtra los instrumentos por nombre y revisa sus datos.', actualizar: 'Selecciona un instrumento de la lista para abrir su formulario de actualización.', eliminar: 'Selecciona el instrumento que deseas eliminar.', todos: 'Administra los instrumentos de cuerda registrados mediante GraphQL.' })[op] || '';
}
const field = { display: 'block', boxSizing: 'border-box', width: '100%', padding: 8, marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 4 };
const th = { textAlign: 'left', padding: 9, borderBottom: '2px solid #172554', background: '#eff6ff' };
const td = { padding: 9, borderBottom: '1px solid #ddd' };
const button = { padding: '8px 12px', border: 0, borderRadius: 4, background: '#172554', color: 'white', cursor: 'pointer' };
const buttonSecondary = { ...button, background: '#e2e8f0', color: '#172554' };
const buttonDanger = { ...button, background: '#b91c1c' };
