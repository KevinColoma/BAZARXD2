// Lee los productos seleccionados de localStorage
const productos = JSON.parse(localStorage.getItem('factura')) || [];
const tbody = document.getElementById('tbody-factura');
tbody.innerHTML = '';
let subtotal = 0;
productos.forEach(prod => {
  const totalProd = prod.precio * (prod.cantidad || 1);
  tbody.innerHTML += `
    <tr>
      <td><b>${prod.descripcion}</b></td>
      <td class="text-center">${prod.cantidad || 1}</td>
      <td class="text-right">$${totalProd.toFixed(2)}</td>
    </tr>
  `;
  subtotal += totalProd;
});
const impuesto = subtotal * 0.12;
const total = subtotal + impuesto;
const resumen = document.getElementById('resumen-factura');
resumen.innerHTML = `
  <tr><td style="text-align:left;">subtotal</td><td style="text-align:right;" colspan="2">$${subtotal.toFixed(2)}</td></tr>
  <tr><td style="text-align:left;">impuesto</td><td style="text-align:right;" colspan="2">$${impuesto.toFixed(2)}</td></tr>
  <tr><td style="text-align:left;" class="total">TOTAL:</td><td style="text-align:right;" class="total" colspan="2">$${total.toFixed(2)}</td></tr>
`;

// --- NUEVO: Fecha automática y modal de confirmación ---
window.addEventListener('DOMContentLoaded', () => {
  // Verificar conexión con el servidor al cargar
  verificarConexionServidor();
  
  // Función para verificar si el servidor está disponible
  async function verificarConexionServidor() {
    try {
      const response = await apiRequest('/carteras', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 segundos timeout
      });
      
      if (!response.ok) {
        mostrarAdvertenciaServidor();
      }
    } catch (error) {
      mostrarAdvertenciaServidor();
    }
  }
  
  function mostrarAdvertenciaServidor() {
    const advertencia = document.createElement('div');
    advertencia.innerHTML = `
      <div style="
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 12px 16px;
        margin: 0 auto 20px auto;
        max-width: 600px;
        text-align: center;
      ">
        <i class="fas fa-exclamation-triangle" style="color: #856404; margin-right: 8px;"></i>
        <strong style="color: #856404;">Advertencia:</strong> 
        <span style="color: #6d4c4c;">No se puede conectar al servidor. Las facturas se generarán sin actualizar el stock.</span>
      </div>
    `;
    
    const container = document.querySelector('.factura-container');
    container.insertBefore(advertencia, container.firstChild);
  }
  // Función para crear modal de error bonito
  function crearModalError() {
    const modalError = document.createElement('div');
    modalError.innerHTML = `
      <div id="modal-error" style="
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0; top: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.3);
        justify-content: center;
        align-items: center;
      ">
        <div style="
          background: #fff6f6;
          border-radius: 16px;
          box-shadow: 0 4px 16px #e2cfcf;
          padding: 32px 24px;
          max-width: 340px;
          min-width: 260px;
          text-align: center;
        ">
          <div style="
            width: 60px;
            height: 60px;
            background: #f8d7da;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            box-shadow: 2px 4px 8px #e2cfcf;
          ">
            <i class="fas fa-exclamation-triangle fa-2x" style="color: #dc3545;"></i>
          </div>
          <h4 style="color: #dc3545; font-weight: bold; font-size: 1.3rem; margin-bottom: 10px;">Error</h4>
          <p id="mensaje-error" style="color: #6d4c4c; font-size: 1rem; margin-bottom: 0;"></p>
          <button id="btn-cerrar-error" style="
            background: #8d5c5c;
            color: white;
            padding: 8px 28px;
            border-radius: 8px;
            font-weight: bold;
            border: none;
            margin-top: 20px;
            cursor: pointer;
          ">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalError);
    
    document.getElementById('btn-cerrar-error').addEventListener('click', () => {
      document.getElementById('modal-error').style.display = 'none';
    });
  }

  // Función para mostrar modal de error
  window.mostrarModalError = function(mensaje) {
    document.getElementById('mensaje-error').textContent = mensaje;
    document.getElementById('modal-error').style.display = 'flex';
  };

  // Crear modal de error
  crearModalError();
  // Mostrar fecha actual en el label
  const fechaDiv = document.getElementById('fecha-factura');
  if (fechaDiv) {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fechaDiv.textContent = `${dd}/${mm}/${yyyy}`;
  }

  // Modal de confirmación y validación de campos
  const btnGenerar = document.getElementById('btn-generar-factura');
  const modal = document.getElementById('modal-confirmacion');
  const btnCerrar = document.getElementById('btn-cerrar-modal');

  // Inputs requeridos - seleccionar por posición en orden
  const inputs = document.querySelectorAll('.form-control');
  const inputNombre = inputs[0];
  const inputCedula = inputs[1];
  const inputDireccion = inputs[2];
  const inputTelefono = inputs[3];

  if (btnGenerar && modal && btnCerrar) {
    btnGenerar.addEventListener('click', async (e) => {
      e.preventDefault();
      // Validar campos
      let valid = true;
      const camposRequeridos = [inputNombre, inputCedula, inputDireccion, inputTelefono];
      
      camposRequeridos.forEach(input => {
        if (input && input.value.trim() === '') {
          input.style.border = '2px solid #dc3545';
          input.style.backgroundColor = '#f8d7da';
          valid = false;
        } else if (input) {
          input.style.border = '';
          input.style.backgroundColor = '';
        }
      });
      
      if (!valid) {
        // Crear y mostrar modal de error bonito
        mostrarModalError('Por favor, complete todos los campos obligatorios.');
        return;
      }

      // Deshabilitar botón durante la petición
      btnGenerar.disabled = true;
      btnGenerar.textContent = 'Generando...';
      
      try {
        // Verificar si hay productos para facturar
        if (!productos || productos.length === 0) {
          mostrarModalError('No hay productos para facturar. Vaya al punto de venta primero.');
          return;
        }

        // Descontar stock en la base de datos
        const productosParaDescuento = productos.map(p => ({
          _id: p._id,
          cantidad: p.cantidad || 1
        }));

        // Intentar conectar al servidor con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

        const response = await apiRequest('/carteras/descontar-stock', {
          method: 'POST',
          body: JSON.stringify({ productos: productosParaDescuento }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // Stock actualizado exitosamente, mostrar modal
          modal.style.display = 'flex';
          // NO limpiar carrito aquí - se limpiará después de generar el PDF
        } else {
          const error = await response.json();
          mostrarModalError('Error al actualizar stock: ' + (error.error || 'Error desconocido'));
        }
      } catch (error) {
        console.error('Error de conexión:', error);
        
        if (error.name === 'AbortError') {
          mostrarModalError('Timeout: El servidor no responde. ¿Está corriendo el backend?');
        } else if (error.message.includes('fetch')) {
          // Error de red - permitir facturar sin actualizar stock
          if (confirm('No se puede conectar al servidor. ¿Desea generar la factura sin actualizar el stock?')) {
            modal.style.display = 'flex';
            // NO limpiar carrito aquí - se limpiará después de generar el PDF
          }
        } else {
          mostrarModalError('Error de conexión: ' + error.message);
        }
      }
      
      // Rehabilitar botón
      btnGenerar.disabled = false;
      btnGenerar.textContent = 'Generar Factura';
    });
    btnCerrar.addEventListener('click', () => {
      modal.style.display = 'none';
      // Generar PDF automáticamente al cerrar el modal de confirmación
      generarFacturaPDF();
    });
    // Cerrar modal al hacer click fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});

// Función para generar PDF de la factura
function generarFacturaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Obtener datos de la factura
  const productos = JSON.parse(localStorage.getItem('factura')) || [];
  console.log('Productos para PDF:', productos); // Debug: verificar productos
  
  // Verificar que hay productos
  if (!productos || productos.length === 0) {
    alert('Error: No se encontraron productos para generar el PDF.');
    return;
  }
  
  const fecha = document.getElementById('fecha-factura').textContent;
  
  // Obtener datos del cliente
  const inputs = document.querySelectorAll('.form-control');
  const nombre = inputs[0].value;
  const cedula = inputs[1].value;
  const direccion = inputs[2].value;
  const telefono = inputs[3].value;
  
  // Colores del tema
  const colorPrimario = [46, 125, 50]; // Verde elegante
  const colorSecundario = [76, 175, 80]; // Verde claro
  const colorTexto = [33, 33, 33]; // Gris oscuro
  const colorGris = [117, 117, 117]; // Gris medio
  
  // === ENCABEZADO ELEGANTE ===
  // Fondo del encabezado
  doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Logo simulado (círculo con iniciales)
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 22, 8, 'F');
  doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('KG', 25, 25, { align: 'center' });
  
  // Título de la empresa
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('KIROGLAM', 40, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión Empresarial', 40, 28);
  doc.text('Belleza • Estilo • Calidad', 40, 34);
  
  // FACTURA en el lado derecho
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 150, 25);
  
  // === INFORMACIÓN DE LA FACTURA ===
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(10);
  const numeroFactura = `FAC-${Date.now().toString().slice(-8)}`;
  
  // Caja para información de factura
  doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
  doc.setLineWidth(0.5);
  doc.rect(140, 50, 50, 25);
  
  doc.setFont('helvetica', 'bold');
  doc.text('No. Factura:', 142, 58);
  doc.text('Fecha:', 142, 66);
  
  doc.setFont('helvetica', 'normal');
  doc.text(numeroFactura, 164, 58);
  doc.text(fecha, 164, 66);
  
  // === INFORMACIÓN DEL CLIENTE ===
  let yPos = 85;
  
  // Título de sección
  doc.setFillColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
  doc.rect(20, yPos - 5, 170, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL CLIENTE', 22, yPos);
  
  yPos += 15;
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(10);
  
  // Datos del cliente en dos columnas
  doc.setFont('helvetica', 'bold');
  doc.text('Nombre:', 22, yPos);
  doc.text('Cédula:', 22, yPos + 8);
  doc.text('Dirección:', 22, yPos + 16);
  doc.text('Teléfono:', 22, yPos + 24);
  
  doc.setFont('helvetica', 'normal');
  doc.text(nombre, 45, yPos);
  doc.text(cedula, 45, yPos + 8);
  doc.text(direccion, 45, yPos + 16);
  doc.text(telefono, 45, yPos + 24);
  
  // === TABLA DE PRODUCTOS ===
  yPos += 40;
  
  // Encabezado de tabla elegante
  doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
  doc.rect(20, yPos - 3, 170, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPCIÓN', 22, yPos + 3);
  doc.text('CANT.', 120, yPos + 3);
  doc.text('PRECIO UNIT.', 140, yPos + 3);
  doc.text('TOTAL', 170, yPos + 3);
  
  yPos += 12;
  
  // Productos con alternancia de colores
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let subtotal = 0;
  productos.forEach((prod, index) => {
    const cantidad = prod.cantidad || 1;
    const totalProd = prod.precio * cantidad;
    subtotal += totalProd;
    
    // Fila alternada
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
      doc.rect(20, yPos - 2, 170, 8, 'F');
    }
    
    // Limitar descripción
    const descripcion = prod.descripcion.length > 45 
      ? prod.descripcion.substring(0, 42) + '...' 
      : prod.descripcion;
    
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text(descripcion, 22, yPos + 2);
    doc.text(cantidad.toString(), 124, yPos + 2, { align: 'center' });
    doc.text(`$${prod.precio.toFixed(2)}`, 154, yPos + 2, { align: 'center' });
    doc.text(`$${totalProd.toFixed(2)}`, 174, yPos + 2, { align: 'center' });
    
    yPos += 8;
  });
  
  // Línea separadora elegante
  yPos += 5;
  doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
  doc.setLineWidth(1);
  doc.line(120, yPos, 190, yPos);
  
  // === RESUMEN FINANCIERO ===
  yPos += 10;
  const impuesto = subtotal * 0.12;
  const total = subtotal + impuesto;
  
  // Caja para totales
  doc.setFillColor(250, 250, 250);
  doc.rect(120, yPos - 5, 70, 25, 'F');
  doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
  doc.rect(120, yPos - 5, 70, 25);
  
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Subtotal:', 125, yPos);
  doc.text(`$${subtotal.toFixed(2)}`, 185, yPos, { align: 'right' });
  
  yPos += 6;
  doc.text('IVA (12%):', 125, yPos);
  doc.text(`$${impuesto.toFixed(2)}`, 185, yPos, { align: 'right' });
  
  yPos += 8;
  // Total destacado
  doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
  doc.rect(120, yPos - 3, 70, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 125, yPos + 2);
  doc.text(`$${total.toFixed(2)}`, 185, yPos + 2, { align: 'right' });
  
  // === PIE DE PÁGINA ELEGANTE ===
  yPos = 260;
  
  // Línea decorativa
  doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
  doc.setLineWidth(2);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('¡Gracias por confiar en nosotros!', 105, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(8);
  doc.text('Este documento es una factura válida generada electrónicamente', 105, yPos, { align: 'center' });
  
  yPos += 4;
  doc.text('KiroGlam - Sistema de Gestión Empresarial | www.kiroglam.com', 105, yPos, { align: 'center' });
  
  // Descargar el PDF
  const nombreArchivo = `Factura_${numeroFactura}_${nombre.replace(/\s+/g, '_')}.pdf`;
  doc.save(nombreArchivo);
  
  // Limpiar carrito DESPUÉS de generar el PDF
  localStorage.removeItem('factura');
  
  // Redirigir al usuario de vuelta al punto de venta
  setTimeout(() => {
    window.location.href = 'vender.html';
  }, 1000);
}
