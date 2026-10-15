namespace POCInstrumentoCuerda
{
    partial class GUIPrincipal
    {
        /// <summary>
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de Windows Forms

        /// <summary>
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.ArchivoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.SalirToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.InstrumentoVientoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.AdicionarInstrumentoVientoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.MenuEliminarInstrumentoViendo = new System.Windows.Forms.ToolStripMenuItem();
            this.ListarInstrumentoVientoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.ActualizarInstrumentoVientoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.ConsultaInstrumentoVientoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.AyudaToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.DerechosDeAutorToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.panelPrincipal = new System.Windows.Forms.Panel();
            this.label1 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.label2 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.menuStrip1.SuspendLayout();
            this.panelPrincipal.SuspendLayout();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.BackColor = System.Drawing.Color.DarkBlue;
            this.menuStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.ArchivoToolStripMenuItem,
            this.InstrumentoVientoToolStripMenuItem,
            this.AyudaToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Padding = new System.Windows.Forms.Padding(5, 2, 0, 2);
            this.menuStrip1.Size = new System.Drawing.Size(798, 28);
            this.menuStrip1.TabIndex = 1;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // ArchivoToolStripMenuItem
            // 
            this.ArchivoToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.SalirToolStripMenuItem});
            this.ArchivoToolStripMenuItem.ForeColor = System.Drawing.Color.Silver;
            this.ArchivoToolStripMenuItem.Name = "ArchivoToolStripMenuItem";
            this.ArchivoToolStripMenuItem.Size = new System.Drawing.Size(73, 24);
            this.ArchivoToolStripMenuItem.Text = "Archivo";
            this.ArchivoToolStripMenuItem.Click += new System.EventHandler(this.archivoToolStripMenuItem_Click);
            // 
            // SalirToolStripMenuItem
            // 
            this.SalirToolStripMenuItem.BackColor = System.Drawing.Color.DarkBlue;
            this.SalirToolStripMenuItem.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.SalirToolStripMenuItem.Name = "SalirToolStripMenuItem";
            this.SalirToolStripMenuItem.Size = new System.Drawing.Size(224, 26);
            this.SalirToolStripMenuItem.Text = "Salir";
            this.SalirToolStripMenuItem.Click += new System.EventHandler(this.salirToolStripMenuItem_Click);
            // 
            // InstrumentoVientoToolStripMenuItem
            // 
            this.InstrumentoVientoToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.AdicionarInstrumentoVientoToolStripMenuItem,
            this.MenuEliminarInstrumentoViendo,
            this.ListarInstrumentoVientoToolStripMenuItem,
            this.ActualizarInstrumentoVientoToolStripMenuItem,
            this.ConsultaInstrumentoVientoToolStripMenuItem});
            this.InstrumentoVientoToolStripMenuItem.ForeColor = System.Drawing.Color.Silver;
            this.InstrumentoVientoToolStripMenuItem.Name = "InstrumentoVientoToolStripMenuItem";
            this.InstrumentoVientoToolStripMenuItem.Size = new System.Drawing.Size(149, 24);
            this.InstrumentoVientoToolStripMenuItem.Text = "InstrumentoCuerda";
            this.InstrumentoVientoToolStripMenuItem.Click += new System.EventHandler(this.instrumentoVientoToolStripMenuItem_Click);
            // 
            // AdicionarInstrumentoVientoToolStripMenuItem
            // 
            this.AdicionarInstrumentoVientoToolStripMenuItem.BackColor = System.Drawing.Color.DarkBlue;
            this.AdicionarInstrumentoVientoToolStripMenuItem.ForeColor = System.Drawing.Color.FloralWhite;
            this.AdicionarInstrumentoVientoToolStripMenuItem.Name = "AdicionarInstrumentoVientoToolStripMenuItem";
            this.AdicionarInstrumentoVientoToolStripMenuItem.Size = new System.Drawing.Size(288, 26);
            this.AdicionarInstrumentoVientoToolStripMenuItem.Text = "Adicionar InstrumentoCuerda";
            this.AdicionarInstrumentoVientoToolStripMenuItem.Click += new System.EventHandler(this.adicionarInstrumentoVientoToolStripMenuItem_Click);
            // 
            // MenuEliminarInstrumentoViendo
            // 
            this.MenuEliminarInstrumentoViendo.BackColor = System.Drawing.Color.DarkBlue;
            this.MenuEliminarInstrumentoViendo.ForeColor = System.Drawing.Color.FloralWhite;
            this.MenuEliminarInstrumentoViendo.Name = "MenuEliminarInstrumentoViendo";
            this.MenuEliminarInstrumentoViendo.Size = new System.Drawing.Size(288, 26);
            this.MenuEliminarInstrumentoViendo.Text = "Eliminar InstrumentoCuerda";
            this.MenuEliminarInstrumentoViendo.Click += new System.EventHandler(this.listarToolStripMenuItem_Click);
            // 
            // ListarInstrumentoVientoToolStripMenuItem
            // 
            this.ListarInstrumentoVientoToolStripMenuItem.BackColor = System.Drawing.Color.DarkBlue;
            this.ListarInstrumentoVientoToolStripMenuItem.ForeColor = System.Drawing.Color.FloralWhite;
            this.ListarInstrumentoVientoToolStripMenuItem.Name = "ListarInstrumentoVientoToolStripMenuItem";
            this.ListarInstrumentoVientoToolStripMenuItem.Size = new System.Drawing.Size(288, 26);
            this.ListarInstrumentoVientoToolStripMenuItem.Text = "Listar InstrumentoCuerda";
            this.ListarInstrumentoVientoToolStripMenuItem.Click += new System.EventHandler(this.listarInstrumentoVientoToolStripMenuItem_Click);
            // 
            // ActualizarInstrumentoVientoToolStripMenuItem
            // 
            this.ActualizarInstrumentoVientoToolStripMenuItem.BackColor = System.Drawing.Color.DarkBlue;
            this.ActualizarInstrumentoVientoToolStripMenuItem.ForeColor = System.Drawing.Color.FloralWhite;
            this.ActualizarInstrumentoVientoToolStripMenuItem.Name = "ActualizarInstrumentoVientoToolStripMenuItem";
            this.ActualizarInstrumentoVientoToolStripMenuItem.Size = new System.Drawing.Size(288, 26);
            this.ActualizarInstrumentoVientoToolStripMenuItem.Text = "Actualizar InstrumentoCuerda";
            this.ActualizarInstrumentoVientoToolStripMenuItem.Click += new System.EventHandler(this.actualizarInstrumentoVientoToolStripMenuItem_Click);
            // 
            // ConsultaInstrumentoVientoToolStripMenuItem
            // 
            this.ConsultaInstrumentoVientoToolStripMenuItem.BackColor = System.Drawing.Color.DarkBlue;
            this.ConsultaInstrumentoVientoToolStripMenuItem.ForeColor = System.Drawing.Color.FloralWhite;
            this.ConsultaInstrumentoVientoToolStripMenuItem.Name = "ConsultaInstrumentoVientoToolStripMenuItem";
            this.ConsultaInstrumentoVientoToolStripMenuItem.Size = new System.Drawing.Size(288, 26);
            this.ConsultaInstrumentoVientoToolStripMenuItem.Text = "Consulta InstrumentoCuerda";
            this.ConsultaInstrumentoVientoToolStripMenuItem.Click += new System.EventHandler(this.consultaInstrumentoVientoToolStripMenuItem_Click);
            // 
            // AyudaToolStripMenuItem
            // 
            this.AyudaToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.DerechosDeAutorToolStripMenuItem});
            this.AyudaToolStripMenuItem.ForeColor = System.Drawing.Color.Silver;
            this.AyudaToolStripMenuItem.Name = "AyudaToolStripMenuItem";
            this.AyudaToolStripMenuItem.Size = new System.Drawing.Size(65, 24);
            this.AyudaToolStripMenuItem.Text = "Ayuda";
            // 
            // DerechosDeAutorToolStripMenuItem
            // 
            this.DerechosDeAutorToolStripMenuItem.BackColor = System.Drawing.Color.DarkBlue;
            this.DerechosDeAutorToolStripMenuItem.ForeColor = System.Drawing.Color.FloralWhite;
            this.DerechosDeAutorToolStripMenuItem.Name = "DerechosDeAutorToolStripMenuItem";
            this.DerechosDeAutorToolStripMenuItem.Size = new System.Drawing.Size(224, 26);
            this.DerechosDeAutorToolStripMenuItem.Text = "Acerca de...";
            this.DerechosDeAutorToolStripMenuItem.Click += new System.EventHandler(this.derechosDeAutorToolStripMenuItem_Click);
            // 
            // panelPrincipal
            // 
            this.panelPrincipal.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.panelPrincipal.Controls.Add(this.panel1);
            this.panelPrincipal.Controls.Add(this.label3);
            this.panelPrincipal.Controls.Add(this.label1);
            this.panelPrincipal.Location = new System.Drawing.Point(0, 31);
            this.panelPrincipal.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.panelPrincipal.Name = "panelPrincipal";
            this.panelPrincipal.Size = new System.Drawing.Size(800, 418);
            this.panelPrincipal.TabIndex = 2;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.Color.DarkBlue;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 18F);
            this.label1.ForeColor = System.Drawing.Color.FloralWhite;
            this.label1.Location = new System.Drawing.Point(127, 19);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(528, 36);
            this.label1.TabIndex = 0;
            this.label1.Text = "Bienvenido a la tienda de Instrumentos";
            this.label1.Click += new System.EventHandler(this.label1_Click_1);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.BackColor = System.Drawing.Color.DarkBlue;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.label3.ForeColor = System.Drawing.Color.FloralWhite;
            this.label3.Location = new System.Drawing.Point(210, 55);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(341, 20);
            this.label3.TabIndex = 2;
            this.label3.Text = "Modulo de gestión de Accesorios de cuerda ";
            this.label3.Click += new System.EventHandler(this.label3_Click);
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.SystemColors.ControlLight;
            this.panel1.Controls.Add(this.label4);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Location = new System.Drawing.Point(67, 110);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(657, 208);
            this.panel1.TabIndex = 3;
            this.panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.panel1_Paint);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.BackColor = System.Drawing.SystemColors.ControlLight;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.label2.ForeColor = System.Drawing.Color.Black;
            this.label2.Location = new System.Drawing.Point(52, 34);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(545, 20);
            this.label2.TabIndex = 4;
            this.label2.Text = "!Qué gusto tenerte por aquí¡ Tómate tu tiempo y siéntete como en casa.";
            this.label2.Click += new System.EventHandler(this.label2_Click_1);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.BackColor = System.Drawing.SystemColors.ControlLight;
            this.label4.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F);
            this.label4.ForeColor = System.Drawing.Color.Black;
            this.label4.Location = new System.Drawing.Point(100, 89);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(441, 17);
            this.label4.TabIndex = 5;
            this.label4.Text = "Selecciona una opción del menú superior para comenzar tus ventas.";
            this.label4.Click += new System.EventHandler(this.label4_Click);
            // 
            // GUIPrincipal
            // 
            this.AccessibleRole = System.Windows.Forms.AccessibleRole.None;
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(798, 447);
            this.Controls.Add(this.panelPrincipal);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.Name = "GUIPrincipal";
            this.Text = "Form1";
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.panelPrincipal.ResumeLayout(false);
            this.panelPrincipal.PerformLayout();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem ArchivoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem InstrumentoVientoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem AdicionarInstrumentoVientoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem MenuEliminarInstrumentoViendo;
        private System.Windows.Forms.ToolStripMenuItem SalirToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem ListarInstrumentoVientoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem ActualizarInstrumentoVientoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem ConsultaInstrumentoVientoToolStripMenuItem;
        private System.Windows.Forms.Panel panelPrincipal;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ToolStripMenuItem AyudaToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem DerechosDeAutorToolStripMenuItem;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label4;
    }
}

