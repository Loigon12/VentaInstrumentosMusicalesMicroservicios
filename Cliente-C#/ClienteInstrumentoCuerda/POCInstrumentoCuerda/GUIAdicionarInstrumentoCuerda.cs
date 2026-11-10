using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using POCInstrumentoCuerda.model;

namespace POCInstrumentoCuerda
{
    public partial class GUIAdicionarInstrumentoCuerda : Form
    {
        public GUIAdicionarInstrumentoCuerda()
        {
            InitializeComponent();
            btnAdicionar.Click += async delegate { await AdicionarAsync(); };
            this.StartPosition = FormStartPosition.CenterScreen;
        }

        private async Task AdicionarAsync()
        {
            try
            {
                const string contexto = "crear un instrumento";
                var input = new InstrumentoInput
                {
                    id = Validaciones.Id(txtId.Text, contexto),
                    nombre = Validaciones.TextoObligatorio(txtNombre.Text, "el nombre", contexto),
                    precio = Validaciones.Precio(txtPrecio.Text, contexto),
                    fechaVenta = txtFechaVenta.Value.ToString("yyyy-MM-dd"),
                    numeroCuerdas = Validaciones.EnteroMayorQueCero(txtNumeroCuerdas.Text, "el número de cuerdas", contexto),
                    numeroTrastes = Validaciones.EnteroNoNegativo(txtNumeroTrastes.Text, "el número de trastes", contexto)
                };

               
                var created = await GraphQLService.AdicionarAsync(input);

               
                MessageBox.Show("Instrumento adicionado con ID " + created.id, "Operación exitosa");
               
            }
            catch (Exception exception) { MessageBox.Show(Validaciones.MensajeDeError(exception), "Error", MessageBoxButtons.OK, MessageBoxIcon.Error); }
        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void btnAdicionar_Click(object sender, EventArgs e)
        {

        }
    }
}
