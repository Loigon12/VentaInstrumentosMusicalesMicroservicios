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
        private bool tablaCargada;

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
                tablaCargada = true;
            }
            catch (Exception ex) { MostrarError(ex); }
        }

        public void Cambio()
        {
            if (operacion != "Listar" || !tablaCargada || IsDisposed || !IsHandleCreated) return;
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
                if (accesorio == null) throw new InvalidOperationException("No se encontró un accesorio con ese ID.");
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
                if (accesorio == null) throw new InvalidOperationException("No se encontró un accesorio con ese ID.");
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
                if (actualizar && !registroCargado)
                    throw new InvalidOperationException("Primero busque y cargue el accesorio que desea actualizar.");

                string contexto = actualizar ? "actualizar un accesorio" : "crear un accesorio";
                var input = new AccesorioInput
                {
                    id = id,
                    nombre = Validaciones.TextoObligatorio(txtNombre.Text, "el nombre", contexto),
                    tipo = cmbTipo.Text,
                    precio = Validaciones.Precio(txtPrecio.Text, contexto),
                    marca = Validaciones.TextoObligatorio(txtMarca.Text, "la marca", contexto),
                    idInstrumento = Validaciones.Id(txtIdInstrumento.Text, "el ID del instrumento", contexto)
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
                if (accesorio == null) throw new InvalidOperationException("No se encontró un accesorio con ese ID para eliminar.");
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
            string contexto;
            switch (operacion)
            {
                case "Adicionar": contexto = "crear un accesorio"; break;
                case "Actualizar": contexto = "actualizar un accesorio"; break;
                case "Eliminar": contexto = "eliminar un accesorio"; break;
                default: contexto = "consultar un accesorio"; break;
            }
            return Validaciones.Id(txtId.Text, "el ID", contexto);
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
            string mensaje = Validaciones.MensajeDeError(ex);
            lblEstado.Text = mensaje;
            MessageBox.Show(mensaje, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
