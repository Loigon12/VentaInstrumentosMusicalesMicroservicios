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
    public partial class GUIActualizarInstrumentoCuerda : Form
    {
        private Instrumento instrumentoEncontrado;

        public GUIActualizarInstrumentoCuerda()
        {
            InitializeComponent();
            btnConsultar.Click += async delegate { await BuscarAsync(); };
            btnActualizar.Click += async delegate { await ActualizarAsync(); };
            btnActualizar.Enabled = false;
            this.StartPosition = FormStartPosition.CenterScreen;
        }

        private async Task BuscarAsync()
        {
            try
            {
                instrumentoEncontrado = await GraphQLService.BuscarAsync(ParseId(txtBuscarId.Text));
                if (instrumentoEncontrado == null)
                {
                    btnActualizar.Enabled = false;
                    MessageBox.Show("No se encontró el instrumento.", "Consulta");
                    return;
                }
                txtId.Text = instrumentoEncontrado.id.ToString();
                txtNombre.Text = instrumentoEncontrado.nombre;
                txtPrecio.Text = instrumentoEncontrado.precio.ToString("0.##");
                txtFechaVenta.Text = instrumentoEncontrado.fechaVenta;
                txtNumeroTrastes.Text = instrumentoEncontrado.numeroTrastes.ToString();
                txtNumeroCuerdas.Text = instrumentoEncontrado.numeroCuerdas.ToString();
                btnActualizar.Enabled = true;
            }
            catch (Exception exception) { MessageBox.Show(exception.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error); }
        }

        private async Task ActualizarAsync()
{
    try
    {
        var input = new InstrumentoInput
        {
            id = ParseId(instrumentoEncontrado.id),
            nombre = Required(txtNombre.Text, "Nombre"),
            precio = ParseDouble(txtPrecio.Text, "Precio"),
            fechaVenta = txtFechaVenta.Value.ToString("yyyy-MM-dd"),
            numeroCuerdas = ParsePositive(txtNumeroCuerdas.Text, "Número de cuerdas"),
            numeroTrastes = ParseNonNegative(txtNumeroTrastes.Text, "Número de trastes")
        };
        await GraphQLService.ActualizarAsync(input);
        MessageBox.Show("Instrumento actualizado.", "Operación exitosa");
        
    }
    catch (Exception exception)
    {
        // Construimos un mensaje que incluya el error principal y el detalle específico si existe.
        string mensajeError = exception.Message;
        
        if (exception.InnerException != null)
        {
            mensajeError += $"\n\nDetalle específico: {exception.InnerException.Message}";
        }

        MessageBox.Show(mensajeError, "Error al actualizar", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }
}

        private static int ParseId(string value) { return ParsePositive(value, "ID"); }
        private static int ParsePositive(string value, string field)
        {
            int result;
            if (!int.TryParse(value, out result) || result <= 0) throw new ArgumentException(field + " debe ser positivo.");
            return result;
        }
        private static int ParseNonNegative(string value, string field)
        {
            int result;
            if (!int.TryParse(value, out result) || result < 0) throw new ArgumentException(field + " no puede ser negativo.");
            return result;
        }
        private static double ParseDouble(string value, string field)
        {
            double result;
            if (!double.TryParse(value, out result) || result <= 0) throw new ArgumentException(field + " debe ser mayor que cero.");
            return result;
        }
        private static string Required(string value, string field)
        {
            if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException(field + " es obligatorio.");
            return value.Trim();
        }

        private void btnActualizar_Click(object sender, EventArgs e)
        {

        }

        private void txtId_TextChanged(object sender, EventArgs e)
        {

        }

        private void txtNombre_TextChanged(object sender, EventArgs e)
        {

        }

        private void txtId_Click(object sender, EventArgs e)
        {

        }
    }
}
