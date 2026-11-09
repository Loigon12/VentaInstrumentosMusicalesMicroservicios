using System;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using POCInstrumentoCuerda.model;

namespace POCInstrumentoCuerda
{
    /// <summary>
    /// Ventana independiente para cada operación CRUD de instrumentos de viento.
    /// Funciona igual que los instrumentos de cuerda, sin la relación con accesorios.
    /// La ventana de listado es un observador (ICambiable): se actualiza sola cuando
    /// cualquier operación confirmada por el servidor modifica los datos.
    /// </summary>
    public class GUIVientoOperacion : Form, ICambiable
    {
        private readonly string operacion;
        private readonly TextBox txtId = new TextBox();
        private readonly TextBox txtNombre = new TextBox();
        private readonly TextBox txtPrecio = new TextBox();
        private readonly DateTimePicker txtFechaVenta = new DateTimePicker();
        private readonly TextBox txtNumeroLlaves = new TextBox();
        private readonly TextBox txtTipoBoquilla = new TextBox();
        private readonly TextBox filtroNombre = new TextBox();
        private readonly TextBox filtroPrecioMaximo = new TextBox();
        private readonly DataGridView tabla = new DataGridView();
        private readonly Label lblEstado = new Label();
        private Panel panelCampos;
        private bool observando;
        private bool registroCargado;

        public GUIVientoOperacion(string operacion)
        {
            this.operacion = operacion ?? "Listar";
            Text = this.operacion + " instrumento de viento";
            StartPosition = FormStartPosition.CenterScreen;
            BackColor = SystemColors.ControlLightLight;
            ConstruirInterfaz();
            if (this.operacion == "Listar")
            {
                ServicioObserver.Agregar(this);
                observando = true;
                Shown += async (s, e) => await CargarTablaAsync();
            }
            FormClosed += (s, e) =>
            {
                if (observando) ServicioObserver.Eliminar(this);
            };
        }

        private string Contexto
        {
            get
            {
                switch (operacion)
                {
                    case "Adicionar": return "crear un instrumento de viento";
                    case "Actualizar": return "actualizar un instrumento de viento";
                    case "Eliminar": return "eliminar un instrumento de viento";
                    case "Consultar": return "consultar un instrumento de viento";
                    default: return "listar instrumentos de viento";
                }
            }
        }

        private void ConstruirInterfaz()
        {
            bool esLista = operacion == "Listar";
            bool esAdicionar = operacion == "Adicionar";
            bool esConsultar = operacion == "Consultar";
            bool esActualizar = operacion == "Actualizar";
            bool esEliminar = operacion == "Eliminar";

            Size = esLista ? new Size(972, 558) : (esActualizar ? new Size(1067, 554) : new Size(800, 469));
            MinimumSize = esLista ? new Size(850, 500) : new Size(760, 450);

            var titulo = new Label
            {
                Text = operacion + " Instrumento de viento",
                Location = new Point(12, 9),
                AutoSize = true,
                Font = new Font("Microsoft Sans Serif", 19F, FontStyle.Regular),
                ForeColor = SystemColors.ActiveCaptionText,
                BackColor = Color.Transparent
            };
            Controls.Add(titulo);

            if (esLista)
            {
                Controls.Add(new Label { Text = "Nombre:", Location = new Point(71, 58), AutoSize = true });
                filtroNombre.SetBounds(125, 55, 140, 20);
                Controls.Add(filtroNombre);
                Controls.Add(new Label { Text = "Precio máximo:", Location = new Point(290, 58), AutoSize = true });
                filtroPrecioMaximo.SetBounds(385, 55, 100, 20);
                Controls.Add(filtroPrecioMaximo);

                tabla.Location = new Point(71, 85);
                tabla.Size = new Size(801, 365);
                tabla.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
                ConfigurarTabla();
                Controls.Add(tabla);
                AgregarBoton(this, "Listar / Actualizar", new Point(388, 465), async (s, e) => await CargarTablaAsync());
                lblEstado.SetBounds(20, 520, 900, 24);
                lblEstado.Anchor = AnchorStyles.Left | AnchorStyles.Bottom;
                lblEstado.ForeColor = Color.DarkBlue;
                Controls.Add(lblEstado);
                return;
            }

            panelCampos = new Panel
            {
                Location = new Point(44, 68),
                Size = new Size(esActualizar ? 920 : 668, 300),
                BackColor = SystemColors.ControlLight,
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };
            Controls.Add(panelCampos);

            CrearCampo(panelCampos, "ID instrumento:", txtId, 22, 24, 175);
            CrearCampo(panelCampos, "Nombre:", txtNombre, 235, 24, 175);
            CrearCampo(panelCampos, "Precio:", txtPrecio, 448, 24, 175);
            CrearCampo(panelCampos, "Fecha de venta:", txtFechaVenta, 22, 104, 175);
            CrearCampo(panelCampos, "Número de llaves:", txtNumeroLlaves, 235, 104, 175);
            CrearCampo(panelCampos, "Tipo de boquilla:", txtTipoBoquilla, 448, 104, 175);

            txtFechaVenta.Format = DateTimePickerFormat.Short;
            txtFechaVenta.Value = DateTime.Today;

            int botonY = 218;
            if (esAdicionar)
            {
                AgregarBoton(panelCampos, "Adicionar", new Point(410, botonY), async (s, e) => await GuardarAsync(false));
                AgregarBoton(panelCampos, "Limpiar", new Point(535, botonY), (s, e) => Limpiar());
            }
            else if (esConsultar)
            {
                AgregarBoton(panelCampos, "Consultar", new Point(410, botonY), async (s, e) => await ConsultarAsync());
            }
            else if (esActualizar)
            {
                AgregarBoton(panelCampos, "Buscar ID", new Point(620, botonY), async (s, e) => await CargarPorIdAsync());
                AgregarBoton(panelCampos, "Guardar cambios", new Point(755, botonY), async (s, e) => await GuardarAsync(true));
                AgregarBoton(panelCampos, "Limpiar", new Point(620, 258), (s, e) => Limpiar());
            }
            else if (esEliminar)
            {
                AgregarBoton(panelCampos, "Buscar ID", new Point(410, botonY), async (s, e) => await CargarPorIdAsync());
                AgregarBoton(panelCampos, "Eliminar", new Point(535, botonY), async (s, e) => await EliminarAsync());
            }

            // En consultar y eliminar solo se escribe el ID; el resto de campos son de solo lectura.
            bool soloLectura = esConsultar || esEliminar;
            txtNombre.ReadOnly = soloLectura;
            txtPrecio.ReadOnly = soloLectura;
            txtNumeroLlaves.ReadOnly = soloLectura;
            txtTipoBoquilla.ReadOnly = soloLectura;
            txtFechaVenta.Enabled = !soloLectura;

            lblEstado.SetBounds(48, 382, ClientSize.Width - 80, 28);
            lblEstado.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            lblEstado.ForeColor = Color.DarkBlue;
            Controls.Add(lblEstado);
        }

        private void ConfigurarTabla()
        {
            tabla.ReadOnly = true;
            tabla.AllowUserToAddRows = false;
            tabla.AllowUserToDeleteRows = false;
            tabla.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            tabla.MultiSelect = false;
            tabla.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            tabla.BackgroundColor = Color.LightGray;
            tabla.GridColor = SystemColors.ControlDarkDark;
        }

        private static void CrearCampo(Control parent, string texto, Control campo, int x, int y, int ancho)
        {
            parent.Controls.Add(new Label
            {
                Text = texto,
                Location = new Point(x, y),
                AutoSize = true,
                Font = new Font("Microsoft Sans Serif", 10F),
                ForeColor = SystemColors.ControlText,
                BackColor = Color.Transparent
            });
            campo.SetBounds(x, y + 25, ancho, 24);
            parent.Controls.Add(campo);
        }

        private static void AgregarBoton(Control parent, string texto, Point ubicacion, EventHandler accion)
        {
            var boton = new Button
            {
                Text = texto,
                Location = ubicacion,
                Size = new Size(120, 37),
                BackColor = Color.DarkBlue,
                ForeColor = SystemColors.ControlLightLight,
                Font = new Font("Microsoft Sans Serif", 9F),
                FlatStyle = FlatStyle.Standard,
                UseVisualStyleBackColor = false
            };
            boton.Click += accion;
            parent.Controls.Add(boton);
        }

        private async Task CargarTablaAsync()
        {
            try
            {
                double? precioMaximo = Validaciones.PrecioMaximoOpcional(filtroPrecioMaximo.Text);
                var lista = await GraphQLService.ListarVientoAsync(
                    string.IsNullOrWhiteSpace(filtroNombre.Text) ? null : filtroNombre.Text.Trim(),
                    precioMaximo);
                tabla.DataSource = null;
                tabla.DataSource = lista.Select(i => new
                {
                    i.id,
                    i.nombre,
                    i.precio,
                    i.fechaVenta,
                    i.numeroLlaves,
                    i.tipoBoquilla
                }).ToList();
                lblEstado.Text = "Instrumentos de viento registrados: " + lista.Count;
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        // Observer: se invoca cuando cambian los datos (adicionar, actualizar o eliminar).
        public void Cambio()
        {
            if (operacion != "Listar" || IsDisposed || !IsHandleCreated) return;
            if (InvokeRequired)
            {
                try { BeginInvoke(new Action(async () => await CargarTablaAsync())); }
                catch (InvalidOperationException) { }
            }
            else _ = CargarTablaAsync();
        }

        private async Task ConsultarAsync()
        {
            try
            {
                var instrumento = await GraphQLService.BuscarVientoAsync(LeerId());
                if (instrumento == null) throw new InvalidOperationException("No se encontró un instrumento de viento con ese ID.");
                MostrarInstrumento(instrumento);
                lblEstado.Text = "Consulta realizada correctamente.";
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private async Task CargarPorIdAsync()
        {
            try
            {
                var instrumento = await GraphQLService.BuscarVientoAsync(LeerId());
                if (instrumento == null) throw new InvalidOperationException("No se encontró un instrumento de viento con ese ID.");
                MostrarInstrumento(instrumento);
                if (operacion == "Actualizar") { registroCargado = true; txtId.ReadOnly = true; }
                lblEstado.Text = "Instrumento de viento cargado correctamente.";
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private async Task GuardarAsync(bool actualizar)
        {
            try
            {
                int id = LeerId();
                if (actualizar && !registroCargado)
                    throw new InvalidOperationException("Primero busque y cargue el instrumento de viento que desea actualizar.");

                var input = new InstrumentoVientoInput
                {
                    id = id,
                    nombre = Validaciones.TextoObligatorio(txtNombre.Text, "el nombre", Contexto),
                    precio = Validaciones.Precio(txtPrecio.Text, Contexto),
                    fechaVenta = txtFechaVenta.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                    numeroLlaves = Validaciones.EnteroNoNegativo(txtNumeroLlaves.Text, "el número de llaves", Contexto),
                    tipoBoquilla = Validaciones.TextoObligatorio(txtTipoBoquilla.Text, "el tipo de boquilla", Contexto)
                };

                if (actualizar) await GraphQLService.ActualizarVientoAsync(input);
                else await GraphQLService.AdicionarVientoAsync(input);

                lblEstado.Text = actualizar ? "Instrumento de viento actualizado correctamente." : "Instrumento de viento adicionado correctamente.";
                MessageBox.Show(lblEstado.Text, "Operación exitosa", MessageBoxButtons.OK, MessageBoxIcon.Information);
                if (!actualizar) Limpiar();
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private async Task EliminarAsync()
        {
            try
            {
                int id = LeerId();
                var instrumento = await GraphQLService.BuscarVientoAsync(id);
                if (instrumento == null) throw new InvalidOperationException("No se encontró un instrumento de viento con ese ID.");
                if (MessageBox.Show("¿Desea eliminar el instrumento de viento " + instrumento.nombre + " (ID " + id + ")?",
                        "Confirmar eliminación", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes) return;
                await GraphQLService.EliminarVientoAsync(id);
                lblEstado.Text = "Instrumento de viento eliminado correctamente.";
                MessageBox.Show(lblEstado.Text, "Operación exitosa", MessageBoxButtons.OK, MessageBoxIcon.Information);
                Limpiar();
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private int LeerId()
        {
            return Validaciones.Id(txtId.Text, "el ID", Contexto);
        }

        private void MostrarInstrumento(InstrumentoViento i)
        {
            txtId.Text = Convert.ToString(i.id, CultureInfo.InvariantCulture);
            txtNombre.Text = i.nombre;
            txtPrecio.Text = i.precio.ToString(CultureInfo.CurrentCulture);
            DateTime fecha;
            if (DateTime.TryParse(i.fechaVenta, CultureInfo.InvariantCulture, DateTimeStyles.None, out fecha)) txtFechaVenta.Value = fecha;
            txtNumeroLlaves.Text = Convert.ToString(i.numeroLlaves, CultureInfo.InvariantCulture);
            txtTipoBoquilla.Text = i.tipoBoquilla;
        }

        private void Limpiar()
        {
            txtId.ReadOnly = false;
            registroCargado = false;
            txtId.Clear();
            txtNombre.Clear();
            txtPrecio.Clear();
            txtNumeroLlaves.Clear();
            txtTipoBoquilla.Clear();
            txtFechaVenta.Value = DateTime.Today;
            lblEstado.Text = string.Empty;
        }

        private void MostrarError(Exception ex)
        {
            string mensaje = Validaciones.MensajeDeError(ex);
            lblEstado.Text = mensaje;
            MessageBox.Show(mensaje, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
