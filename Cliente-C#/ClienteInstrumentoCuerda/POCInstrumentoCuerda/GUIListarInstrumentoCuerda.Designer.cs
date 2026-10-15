namespace POCInstrumentoCuerda
{
    partial class GUIListarInstrumentoCuerda
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.tableInstrumentosCuerda = new System.Windows.Forms.DataGridView();
            this.tableId = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tableNombre = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tablePrecio = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tableFechaVenta = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tableNumeroTrastes = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tableNumeroCuerdas = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnListar = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.tableInstrumentosCuerda)).BeginInit();
            this.SuspendLayout();
            // 
            // tableInstrumentosCuerda
            // 
            this.tableInstrumentosCuerda.BackgroundColor = System.Drawing.Color.LightGray;
            this.tableInstrumentosCuerda.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.tableInstrumentosCuerda.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.tableId,
            this.tableNombre,
            this.tablePrecio,
            this.tableFechaVenta,
            this.tableNumeroTrastes,
            this.tableNumeroCuerdas});
            this.tableInstrumentosCuerda.GridColor = System.Drawing.SystemColors.ControlDarkDark;
            this.tableInstrumentosCuerda.Location = new System.Drawing.Point(130, 101);
            this.tableInstrumentosCuerda.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.tableInstrumentosCuerda.Name = "tableInstrumentosCuerda";
            this.tableInstrumentosCuerda.RowHeadersWidth = 51;
            this.tableInstrumentosCuerda.Size = new System.Drawing.Size(804, 337);
            this.tableInstrumentosCuerda.TabIndex = 0;
            this.tableInstrumentosCuerda.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dataGridView1_CellContentClick);
            // 
            // tableId
            // 
            this.tableId.HeaderText = "ID";
            this.tableId.MinimumWidth = 6;
            this.tableId.Name = "tableId";
            this.tableId.Width = 125;
            // 
            // tableNombre
            // 
            this.tableNombre.HeaderText = "Nombre";
            this.tableNombre.MinimumWidth = 6;
            this.tableNombre.Name = "tableNombre";
            this.tableNombre.Width = 125;
            // 
            // tablePrecio
            // 
            this.tablePrecio.HeaderText = "Precio";
            this.tablePrecio.MinimumWidth = 6;
            this.tablePrecio.Name = "tablePrecio";
            this.tablePrecio.Width = 125;
            // 
            // tableFechaVenta
            // 
            this.tableFechaVenta.HeaderText = "Fecha de Venta";
            this.tableFechaVenta.MinimumWidth = 6;
            this.tableFechaVenta.Name = "tableFechaVenta";
            this.tableFechaVenta.Width = 125;
            // 
            // tableNumeroTrastes
            // 
            this.tableNumeroTrastes.HeaderText = "Numero de Trastes";
            this.tableNumeroTrastes.MinimumWidth = 6;
            this.tableNumeroTrastes.Name = "tableNumeroTrastes";
            this.tableNumeroTrastes.Width = 125;
            // 
            // tableNumeroCuerdas
            // 
            this.tableNumeroCuerdas.HeaderText = "Numero de Cuerdas";
            this.tableNumeroCuerdas.MinimumWidth = 6;
            this.tableNumeroCuerdas.Name = "tableNumeroCuerdas";
            this.tableNumeroCuerdas.Width = 125;
            // 
            // btnListar
            // 
            this.btnListar.BackColor = System.Drawing.Color.DarkBlue;
            this.btnListar.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.btnListar.Location = new System.Drawing.Point(439, 446);
            this.btnListar.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btnListar.Name = "btnListar";
            this.btnListar.Size = new System.Drawing.Size(191, 57);
            this.btnListar.TabIndex = 1;
            this.btnListar.Text = "Listar";
            this.btnListar.UseVisualStyleBackColor = false;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.Color.DarkBlue;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 19F);
            this.label1.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.label1.Location = new System.Drawing.Point(339, 34);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(379, 37);
            this.label1.TabIndex = 2;
            this.label1.Text = "Listar InstrumentoCuerda";
            // 
            // GUIListarInstrumentoCuerda
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.ClientSize = new System.Drawing.Size(1067, 554);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnListar);
            this.Controls.Add(this.tableInstrumentosCuerda);
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Name = "GUIListarInstrumentoCuerda";
            this.Text = "GUIListarInstrumentoViento";
            ((System.ComponentModel.ISupportInitialize)(this.tableInstrumentosCuerda)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView tableInstrumentosCuerda;
        private System.Windows.Forms.DataGridViewTextBoxColumn tableId;
        private System.Windows.Forms.DataGridViewTextBoxColumn tableNombre;
        private System.Windows.Forms.DataGridViewTextBoxColumn tablePrecio;
        private System.Windows.Forms.DataGridViewTextBoxColumn tableFechaVenta;
        private System.Windows.Forms.DataGridViewTextBoxColumn tableNumeroTrastes;
        private System.Windows.Forms.DataGridViewTextBoxColumn tableNumeroCuerdas;
        private System.Windows.Forms.Button btnListar;
        private System.Windows.Forms.Label label1;
    }
}