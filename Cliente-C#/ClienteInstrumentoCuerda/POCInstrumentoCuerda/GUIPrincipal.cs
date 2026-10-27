using System;
using System.Windows.Forms;

namespace POCInstrumentoCuerda
{
    public partial class GUIPrincipal : Form
    {
        public GUIPrincipal()
        {
            InitializeComponent();
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Venta de Instrumentos Musicales";
            Size = new System.Drawing.Size(900, 560);
            MinimumSize = new System.Drawing.Size(760, 480);
            panelPrincipal.Dock = DockStyle.Fill;

            // La navegación sigue el esquema del proyecto original: una barra superior
            // y una ventana independiente para cada operación del CRUD.
            ConstruirMenuPrincipal();
        }

        private void ConstruirMenuPrincipal()
        {
            menuStrip1.Items.Clear();

            var inicio = new ToolStripMenuItem("Inicio");
            inicio.Click += (s, e) => MostrarInicio();
            menuStrip1.Items.Add(inicio);

            var acerca = new ToolStripMenuItem("Acerca de");
            acerca.Click += (s, e) => new GUIDerechosAutor().Show(this);
            menuStrip1.Items.Add(acerca);

            var instrumentos = new ToolStripMenuItem("Instrumentos de cuerda");
            instrumentos.DropDownItems.Add("Adicionar instrumento", null, (s, e) => new GUIAdicionarInstrumentoCuerda().Show(this));
            instrumentos.DropDownItems.Add("Listar instrumentos", null, (s, e) => new GUIListarInstrumentoCuerda().Show(this));
            instrumentos.DropDownItems.Add("Consultar instrumento", null, (s, e) => new GUIConsultaInstrumentoCuerda().Show(this));
            instrumentos.DropDownItems.Add("Actualizar instrumento", null, (s, e) => new GUIActualizarInstrumentoCuerda().Show(this));
            instrumentos.DropDownItems.Add("Eliminar instrumento", null, (s, e) => new GUIEliminarInstrumentoCuerda().Show(this));
            menuStrip1.Items.Add(instrumentos);

            // Se conserva la categoría visual del programa original. El microservicio
            // actual no expone operaciones para instrumentos de viento, por lo que no
            // se muestran acciones que aparenten funcionar sin un endpoint real.
            var viento = new ToolStripMenuItem("Instrumentos de viento");
            var noDisponible = new ToolStripMenuItem("No disponible en esta versión del servidor") { Enabled = false };
            viento.DropDownItems.Add(noDisponible);
            menuStrip1.Items.Add(viento);

            var accesorios = new ToolStripMenuItem("Accesorios de cuerda");
            accesorios.DropDownItems.Add("Adicionar accesorio", null, (s, e) => AbrirAccesorios("Adicionar"));
            accesorios.DropDownItems.Add("Listar accesorios", null, (s, e) => AbrirAccesorios("Listar"));
            accesorios.DropDownItems.Add("Consultar accesorio", null, (s, e) => AbrirAccesorios("Consultar"));
            accesorios.DropDownItems.Add("Actualizar accesorio", null, (s, e) => AbrirAccesorios("Actualizar"));
            accesorios.DropDownItems.Add("Eliminar accesorio", null, (s, e) => AbrirAccesorios("Eliminar"));
            menuStrip1.Items.Add(accesorios);

            menuStrip1.BackColor = System.Drawing.Color.DarkBlue;
            menuStrip1.ForeColor = System.Drawing.Color.White;
        }

        private void AbrirAccesorios(string operacion)
        {
            var ventana = new GUIAccesorioOperacion(operacion);
            ventana.Show(this);
        }

        private void MostrarInicio()
        {
            panelPrincipal.Visible = true;
            panelPrincipal.BringToFront();
        }

        private void label1_Click(object sender, EventArgs e) { }
        private void label1_Click_1(object sender, EventArgs e) { }
        private void instrumentoVientoToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void adicionarInstrumentoVientoToolStripMenuItem_Click(object sender, EventArgs e) { new GUIAdicionarInstrumentoCuerda().Show(this); }
        private void archivoToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void listarToolStripMenuItem_Click(object sender, EventArgs e) { new GUIEliminarInstrumentoCuerda().Show(this); }
        private void listarInstrumentoVientoToolStripMenuItem_Click(object sender, EventArgs e) { new GUIListarInstrumentoCuerda().Show(this); }
        private void label2_Click(object sender, EventArgs e) { }
        private void actualizarInstrumentoVientoToolStripMenuItem_Click(object sender, EventArgs e) { new GUIActualizarInstrumentoCuerda().Show(this); }
        private void consultaInstrumentoVientoToolStripMenuItem_Click(object sender, EventArgs e) { new GUIConsultaInstrumentoCuerda().Show(this); }
        private void salirToolStripMenuItem_Click(object sender, EventArgs e) { Application.Exit(); }
        private void derechosDeAutorToolStripMenuItem_Click(object sender, EventArgs e) { new GUIDerechosAutor().Show(this); }
        private void label3_Click(object sender, EventArgs e) { }
        private void panel1_Paint(object sender, PaintEventArgs e) { }
        private void label2_Click_1(object sender, EventArgs e) { }
        private void label4_Click(object sender, EventArgs e) { }
    }
}
