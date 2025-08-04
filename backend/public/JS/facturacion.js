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
          // Limpiar carrito de localStorage
          localStorage.removeItem('factura');
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
            localStorage.removeItem('factura');
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
    });
    // Cerrar modal al hacer click fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});
