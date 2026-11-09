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
                instrumentoEncontrado = await GraphQLService.BuscarAsync(Validaciones.Id(txtBuscarId.Text, "actualizar un instrumento"));
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
            catch (Exception exception) { MessageBox.Show(Validaciones.MensajeDeError(exception), "Error", MessageBoxButtons.OK, MessageBoxIcon.Error); }
        }

        private async Task ActualizarAsync()
        {
            try
            {
                if (instrumentoEncontrado == null)
                    throw new InvalidOperationException("Primero busque el instrumento que desea actualizar.");

                const string contexto = "actualizar un instrumento";
                var input = new InstrumentoInput
                {
                    id = instrumentoEncontrado.id,
                    nombre = Validaciones.TextoObligatorio(txtNombre.Text, "el nombre", contexto),
                    precio = Validaciones.Precio(txtPrecio.Text, contexto),
                    fechaVenta = txtFechaVenta.Value.ToString("yyyy-MM-dd"),
                    numeroCuerdas = Validaciones.EnteroMayorQueCero(txtNumeroCuerdas.Text, "el número de cuerdas", contexto),
                    numeroTrastes = Validaciones.EnteroNoNegativo(txtNumeroTrastes.Text, "el número de trastes", contexto)
                };
                await GraphQLService.ActualizarAsync(input);
                MessageBox.Show("Instrumento actualizado.", "Operación exitosa");
            }
            catch (Exception exception)
            {
                MessageBox.Show(Validaciones.MensajeDeError(exception), "Error al actualizar", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
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
