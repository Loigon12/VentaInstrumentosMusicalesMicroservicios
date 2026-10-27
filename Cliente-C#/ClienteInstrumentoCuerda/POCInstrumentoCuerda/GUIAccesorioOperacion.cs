using System;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using POCInstrumentoCuerda.model;

namespace POCInstrumentoCuerda
{
    /// <summary>Ventana independiente para cada operación CRUD de accesorios de cuerda.</summary>
    public class GUIAccesorioOperacion : Form, ICambiable
    {
        private readonly string operacion;
        private readonly TextBox txtId = new TextBox();
        private readonly TextBox txtNombre = new TextBox();
        private readonly ComboBox cmbTipo = new ComboBox();
        private readonly TextBox txtPrecio = new TextBox();
        private readonly TextBox txtMarca = new TextBox();
        private readonly TextBox txtIdInstrumento = new TextBox();
        private readonly DataGridView tabla = new DataGridView();
        private readonly Label lblEstado = new Label();
        private Panel panelCampos;
        private bool observando;
        private bool registroCargado;

        public GUIAccesorioOperacion(string operacion)
        {
            this.operacion = operacion ?? "Listar";
            Text = this.operacion + " accesorio de cuerda";
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
                Text = operacion + " Accesorio de cuerda",
                Location = new Point(12, 9),
                AutoSize = true,
                Font = new Font("Microsoft Sans Serif", 19F, FontStyle.Regular),
                ForeColor = SystemColors.ActiveCaptionText,
                BackColor = Color.Transparent
            };
            Controls.Add(titulo);

            if (esLista)
            {
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

            CrearCampo(panelCampos, "ID accesorio:", txtId, 22, 24, 175);
            CrearCampo(panelCampos, "Nombre:", txtNombre, 235, 24, 175);
            CrearCampo(panelCampos, "Tipo:", cmbTipo, 448, 24, 175);
            CrearCampo(panelCampos, "Precio:", txtPrecio, 22, 104, 175);
            CrearCampo(panelCampos, "Marca:", txtMarca, 235, 104, 175);
            CrearCampo(panelCampos, "ID instrumento de cuerda:", txtIdInstrumento, 448, 104, 175);

            cmbTipo.DropDownStyle = ComboBoxStyle.DropDownList;
            cmbTipo.Items.AddRange(new object[] { "CUERDAPULSADA", "CUERDAFROTADA" });
            cmbTipo.SelectedIndex = 0;

            if (esConsultar || esEliminar) ConfigurarSoloLectura();
            if (esActualizar) txtId.ReadOnly = false;

            int botonY = 218;
            if (esAdicionar)
            {
                AgregarBoton(panelCampos, "Adicionar", new Point(410, botonY), async (s, e) => await GuardarAsync(false));
                AgregarBoton(panelCampos, "Limpiar", new Point(535, botonY), (s, e) => Limpiar());
            }
            else if (esConsultar)
            {
                txtId.ReadOnly = false;
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

            if (esConsultar || esActualizar || esEliminar)
            {
                txtNombre.ReadOnly = esConsultar || esEliminar;
                txtPrecio.ReadOnly = esConsultar || esEliminar;
                txtMarca.ReadOnly = esConsultar || esEliminar;
                txtIdInstrumento.ReadOnly = esConsultar || esEliminar;
                cmbTipo.Enabled = !(esConsultar || esEliminar);
            }

            lblEstado.SetBounds(48, 382, ClientSize.Width - 80, 28);
            lblEstado.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            lblEstado.ForeColor = Color.DarkBlue;
            Controls.Add(lblEstado);
        }

        private void ConfigurarSoloLectura()
        {
            txtNombre.ReadOnly = true;
            txtPrecio.ReadOnly = true;
            txtMarca.ReadOnly = true;
            txtIdInstrumento.ReadOnly = true;
            cmbTipo.Enabled = false;
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
                var lista = await GraphQLService.ListarAccesoriosAsync();
                tabla.DataSource = null;
                tabla.DataSource = lista.Select(a => new { a.id, a.nombre, a.tipo, a.precio, a.marca, a.idInstrumento }).ToList();
                lblEstado.Text = "Accesorios registrados: " + lista.Count;
            }
            catch (Exception ex) { MostrarError(ex); }
        }

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
                var accesorio = await GraphQLService.BuscarAccesorioAsync(LeerId());
                if (accesorio == null) throw new Exception("No se encontró un accesorio con ese ID.");
                MostrarAccesorio(accesorio);
                lblEstado.Text = "Consulta realizada correctamente.";
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private async Task CargarPorIdAsync()
        {
            try
            {
                int id = LeerId();
                var accesorio = await GraphQLService.BuscarAccesorioAsync(id);
                if (accesorio == null) throw new Exception("No se encontró un accesorio con ese ID.");
                MostrarAccesorio(accesorio);
                if (operacion == "Actualizar") { registroCargado = true; txtId.ReadOnly = true; }
                lblEstado.Text = "Accesorio cargado correctamente.";
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private async Task GuardarAsync(bool actualizar)
        {
            try
            {
                int id = LeerId();
                if (actualizar && !registroCargado) throw new Exception("Primero busca y carga el accesorio que deseas actualizar.");
                int idInstrumento;
                double precio;
                if (!int.TryParse(txtIdInstrumento.Text, out idInstrumento) || idInstrumento <= 0)
                    throw new Exception("El ID del instrumento debe ser un entero positivo.");
                if (!double.TryParse(txtPrecio.Text, NumberStyles.Number, CultureInfo.CurrentCulture, out precio) &&
                    !double.TryParse(txtPrecio.Text, NumberStyles.Number, CultureInfo.InvariantCulture, out precio))
                    throw new Exception("Escribe un precio válido.");
                if (precio <= 0 || string.IsNullOrWhiteSpace(txtNombre.Text) || string.IsNullOrWhiteSpace(txtMarca.Text))
                    throw new Exception("El nombre y la marca son obligatorios y el precio debe ser mayor que cero.");

                var input = new AccesorioInput
                {
                    id = id, nombre = txtNombre.Text.Trim(), tipo = cmbTipo.Text,
                    precio = precio, marca = txtMarca.Text.Trim(), idInstrumento = idInstrumento
                };
                if (actualizar) await GraphQLService.ActualizarAccesorioAsync(input);
                else await GraphQLService.AdicionarAccesorioAsync(input);
                lblEstado.Text = actualizar ? "Accesorio actualizado correctamente." : "Accesorio adicionado correctamente.";
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
                var accesorio = await GraphQLService.BuscarAccesorioAsync(id);
                if (accesorio == null) throw new Exception("Primero consulta un accesorio válido para eliminarlo.");
                if (MessageBox.Show("¿Deseas eliminar el accesorio " + accesorio.nombre + " (ID " + id + ")?", "Confirmar eliminación", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes) return;
                await GraphQLService.EliminarAccesorioAsync(id);
                lblEstado.Text = "Accesorio eliminado correctamente.";
                MessageBox.Show(lblEstado.Text, "Operación exitosa", MessageBoxButtons.OK, MessageBoxIcon.Information);
                Limpiar();
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        private int LeerId()
        {
            int id;
            if (!int.TryParse(txtId.Text, out id) || id <= 0) throw new Exception("Escribe un ID de accesorio entero y positivo.");
            return id;
        }

        private void MostrarAccesorio(Accesorio a)
        {
            txtId.Text = Convert.ToString(a.id);
            txtNombre.Text = a.nombre;
            cmbTipo.SelectedItem = a.tipo;
            txtPrecio.Text = a.precio.ToString(CultureInfo.CurrentCulture);
            txtMarca.Text = a.marca;
            txtIdInstrumento.Text = Convert.ToString(a.idInstrumento);
        }

        private void Limpiar()
        {
            txtId.ReadOnly = false;
            registroCargado = false;
            txtId.Clear();
            txtNombre.Clear(); txtPrecio.Clear(); txtMarca.Clear(); txtIdInstrumento.Clear();
            if (cmbTipo.Items.Count > 0) cmbTipo.SelectedIndex = 0;
            lblEstado.Text = string.Empty;
        }

        private void MostrarError(Exception ex)
        {
            lblEstado.Text = ex.Message;
            MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
