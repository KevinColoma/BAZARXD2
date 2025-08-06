// Variables globales
let carteras = [];
let carterasFiltradas = [];

// Cargar carteras desde el backend y mostrarlas en la tabla
async function cargarCarteras() {
  try {
    const res = await apiRequest('/carteras');
    carteras = await res.json();
    carterasFiltradas = [...carteras];
    mostrarCarteras(carterasFiltradas);
    configurarBusqueda();
  } catch (err) {
    document.getElementById('tbody-carteras').innerHTML = '<tr><td colspan="5" class="text-center">No se pudo cargar el inventario</td></tr>';
  }
}

// Mostrar carteras en la tabla
function mostrarCarteras(data) {
  const tbody = document.getElementById('tbody-carteras');
  const noResults = document.getElementById('no-results');
  
  if (data.length === 0) {
    tbody.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  tbody.innerHTML = '';
  
  data.forEach(cartera => {
    const stockClass = cartera.stock <= 5 ? 'text-warning font-weight-bold' : '';
    const stockIcon = cartera.stock <= 5 ? '<i class="fas fa-exclamation-triangle mr-1"></i>' : '';
    
    tbody.innerHTML += `
      <tr>
        <td class="text-center">
          <img src="${cartera.imagen}" alt="${cartera.descripcion}" 
               style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 2px 2px 8px rgba(141,92,92,0.3);">
        </td>
        <td><strong style="color: #6d4c4c;">${cartera.descripcion}</strong></td>
        <td><span style="color: #28a745; font-weight: bold; font-size: 1.1rem;">$${cartera.precio.toFixed(2)}</span></td>
        <td id="stock-${cartera._id}" class="${stockClass}">
          ${stockIcon}${cartera.stock} ${cartera.stock <= 5 ? '(Bajo)' : ''}
        </td>
        <td class="acciones">
          <button class="btn btn-sm btn-outline-secondary mr-2" onclick="editarCartera('${cartera._id}')" title="Editar">
            <i class="fas fa-edit" data-id="${cartera._id}"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarCartera('${cartera._id}')" title="Eliminar">
            <i class="fas fa-trash" data-id="${cartera._id}"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// Configurar búsqueda
function configurarBusqueda() {
  const searchInput = document.getElementById('search-inventario');
  searchInput.addEventListener('input', function() {
    const termino = this.value.toLowerCase().trim();
    
    if (termino === '') {
      carterasFiltradas = [...carteras];
    } else {
      carterasFiltradas = carteras.filter(cartera => 
        cartera.descripcion.toLowerCase().includes(termino)
      );
    }
    
    mostrarCarteras(carterasFiltradas);
  });
}

// Cargar datos al inicio
document.addEventListener('DOMContentLoaded', cargarCarteras);

// Formulario para agregar producto
function mostrarFormularioCartera() {
  const formHtml = `
    <div class="modal fade show" id="modal-cartera" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-modal="true" style="display:block; background:rgba(0,0,0,0.3);">
      <div class="modal-dialog" role="document" style="max-width: 600px;">
        <div class="modal-content" style="border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(141,92,92,0.25);">
          <div class="modal-header" style="background: linear-gradient(90deg, #8d5c5c 60%, #c7a7a7 100%); color: #fff; border-top-left-radius: 18px; border-top-right-radius: 18px;">
            <h5 class="modal-title" id="modalLabel"><i class="fas fa-plus-circle"></i> Agregar producto</h5>
            <button type="button" class="close" id="cerrar-modal" aria-label="Cerrar" style="color:#fff; opacity:1;">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="form-cartera">
            <div class="modal-body" style="background: #f8f6f4;">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label><i class="fas fa-tag"></i> Descripción</label>
                    <input type="text" class="form-control" name="descripcion" required>
                  </div>
                  <div class="form-group">
                    <label><i class="fas fa-dollar-sign"></i> Precio</label>
                    <input type="number" class="form-control" name="precio" required min="0" step="0.01">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label><i class="fas fa-boxes"></i> Stock</label>
                    <input type="number" class="form-control" name="stock" required min="0">
                  </div>
                  <div class="form-group">
                    <label><i class="fas fa-image"></i> Imagen (URL)</label>
                    <input type="text" class="form-control" name="imagen" required>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer" style="background: #f8f6f4; border-bottom-left-radius: 18px; border-bottom-right-radius: 18px;">
              <button type="submit" class="btn" style="background:#8d5c5c; color:#fff;"><i class="fas fa-save"></i> Guardar</button>
              <button type="button" class="btn btn-secondary" id="cerrar-modal-footer">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', formHtml);
  document.getElementById('cerrar-modal').onclick = () => {
    document.getElementById('modal-cartera').remove();
  };
  document.getElementById('cerrar-modal-footer').onclick = () => {
    document.getElementById('modal-cartera').remove();
  };
  document.getElementById('form-cartera').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const cartera = {
      descripcion: form.descripcion.value,
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value),
      imagen: form.imagen.value
    };
    const res = await apiRequest('/carteras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartera)
    });
    if(res.ok) {
      alert('Cartera agregada');
      document.getElementById('modal-cartera').remove();
      cargarCarteras(); // Recargar datos sin reload de página
    } else {
      alert('Error al agregar producto');
    }
  };
}

// Modal para editar producto con Bootstrap
function mostrarFormularioEditarCartera(cartera) {
  const formHtml = `
    <div class="modal fade show" id="modal-editar-cartera" tabindex="-1" role="dialog" aria-labelledby="modalEditLabel" aria-modal="true" style="display:block; background:rgba(0,0,0,0.3);">
      <div class="modal-dialog" role="document" style="max-width: 600px;">
        <div class="modal-content" style="border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(141,92,92,0.25);">
          <div class="modal-header" style="background: linear-gradient(90deg, #c7a7a7 0%, #8d5c5c 100%); color: #fff; border-top-left-radius: 18px; border-top-right-radius: 18px;">
            <h5 class="modal-title" id="modalEditLabel"><i class="fas fa-pen-to-square"></i> Editar producto</h5>
            <button type="button" class="close" id="cerrar-modal-editar" aria-label="Cerrar" style="color:#fff; opacity:1;">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="form-editar-cartera">
            <div class="modal-body" style="background: #f8f6f4;">
              <div class="row">
                <div class="col-12 d-flex flex-column align-items-center justify-content-center mb-3">
                  <img src="${cartera.imagen}" alt="Imagen actual" style="max-width: 180px; max-height: 180px; border-radius: 12px; box-shadow:0 2px 12px #ccc; background:#fff; padding:8px;">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label><i class="fas fa-tag"></i> Descripción</label>
                    <input type="text" class="form-control" name="descripcion" required value="${cartera.descripcion}">
                  </div>
                  <div class="form-group">
                    <label><i class="fas fa-dollar-sign"></i> Precio</label>
                    <input type="number" class="form-control" name="precio" required min="0" step="0.01" value="${cartera.precio}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label><i class="fas fa-boxes"></i> Stock</label>
                    <input type="number" class="form-control" name="stock" required min="0" value="${cartera.stock}">
                  </div>
                  <div class="form-group">
                    <label><i class="fas fa-image"></i> Imagen (URL)</label>
                    <input type="text" class="form-control" name="imagen" required value="${cartera.imagen}">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer" style="background: #f8f6f4; border-bottom-left-radius: 18px; border-bottom-right-radius: 18px; display: flex; flex-direction: row; gap: 10px;">
              <button type="submit" class="btn btn-lg" style="background:#8d5c5c; color:#fff; font-size:1.2rem; padding: 16px 0; font-weight:bold; flex-grow:1;"><i class="fas fa-save"></i> Actualizar producto</button>
              <button type="button" class="btn btn-secondary btn-lg" id="cerrar-modal-editar-footer">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', formHtml);
  document.getElementById('cerrar-modal-editar').onclick = () => {
    document.getElementById('modal-editar-cartera').remove();
  };
  document.getElementById('cerrar-modal-editar-footer').onclick = () => {
    document.getElementById('modal-editar-cartera').remove();
  };
  document.getElementById('form-editar-cartera').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const carteraEditada = {
      descripcion: form.descripcion.value,
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value),
      imagen: form.imagen.value
    };
    const res = await apiRequest(`/carteras/${cartera._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carteraEditada)
    });
    if(res.ok) {
      alert('Cartera actualizada');
      document.getElementById('modal-editar-cartera').remove();
      cargarCarteras(); // Recargar datos sin reload de página
    } else {
      alert('Error al actualizar producto');
    }
  };
}

// Función para editar producto
async function editarCartera(id) {
  try {
    const res = await fetch('http://localhost:4000/api/carteras');
    const data = await res.json();
    const cartera = data.find(c => c._id === id);
    if (cartera) {
      mostrarFormularioEditarCartera(cartera);
    }
  } catch (error) {
    alert('Error al cargar los datos de la producto');
  }
}

// Función para eliminar producto
async function eliminarCartera(id) {
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    try {
      const res = await fetch(`http://localhost:4000/api/carteras/${id}`, {
        method: 'DELETE'
      });
      if(res.ok) {
        alert('Cartera eliminada');
        cargarCarteras(); // Recargar datos sin reload de página
      } else {
        alert('Error al eliminar producto');
      }
    } catch (error) {
      alert('Error de conexión al eliminar producto');
    }
  }
}

// Evento para mostrar el modal de editar al hacer click en el ícono de editar
document.addEventListener('click', function(e) {
  if (e.target.closest('.fa-pen-to-square')) {
    const id = e.target.closest('.fa-pen-to-square').getAttribute('data-id');
    fetch('http://localhost:4000/api/carteras')
      .then(res => res.json())
      .then(data => {
        const cartera = data.find(c => c._id === id);
        if (cartera) mostrarFormularioEditarCartera(cartera);
      });
  }
  // Evento para eliminar producto
  if (e.target.closest('.fa-trash')) {
    const id = e.target.closest('.fa-trash').getAttribute('data-id');
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      fetch(`http://localhost:4000/api/carteras/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        if(res.ok) {
          alert('Cartera eliminada');
          location.reload();
        } else {
          alert('Error al eliminar producto');
        }
      });
    }
  }
});

document.getElementById('btn-nueva-cartera').onclick = function(e) {
  e.preventDefault();
  mostrarFormularioCartera();
}

// Función para mostrar el total de stock
async function mostrarTotalStock() {
  try {
    const res = await apiRequest('/carteras/total-stock');
    const data = await res.json();
    
    const modalHtml = `
      <div class="modal fade show" id="modal-total-stock" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.3);">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content" style="border-radius: 18px;">
            <div class="modal-header" style="background: linear-gradient(90deg, #17a2b8 60%, #6c757d 100%); color: #fff;">
              <h5 class="modal-title"><i class="fas fa-boxes"></i> Total de Stock</h5>
              <button type="button" class="close" id="cerrar-modal-stock" style="color:#fff;">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="card text-center">
                    <div class="card-body">
                      <h2 class="text-primary">${data.totalStock}</h2>
                      <p>Total Unidades en Stock</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card text-center">
                    <div class="card-body">
                      <h2 class="text-info">${data.totalProductos}</h2>
                      <p>Total de Productos</p>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
              <h6>Stock por Producto:</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.stockPorProducto.map(p => `
                      <tr>
                        <td>${p.descripcion}</td>
                        <td>${p.stock}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cerrar-modal-stock-footer">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('cerrar-modal-stock').onclick = () => {
      document.getElementById('modal-total-stock').remove();
    };
    document.getElementById('cerrar-modal-stock-footer').onclick = () => {
      document.getElementById('modal-total-stock').remove();
    };
  } catch (error) {
    alert('Error al obtener el total de stock');
  }
}

// Función para mostrar calculadora de IVA
function mostrarCalculadoraIVA() {
  const modalHtml = `
    <div class="modal fade show" id="modal-iva" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.3);">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" style="border-radius: 18px;">
          <div class="modal-header" style="background: linear-gradient(90deg, #28a745 60%, #20c997 100%); color: #fff;">
            <h5 class="modal-title"><i class="fas fa-calculator"></i> Calculadora de IVA</h5>
            <button type="button" class="close" id="cerrar-modal-iva" style="color:#fff;">
              <span>&times;</span>
            </button>
          </div>
          <form id="form-iva">
            <div class="modal-body">
              <div class="form-group">
                <label>Porcentaje de IVA:</label>
                <input type="number" class="form-control" id="porcentaje-iva" value="16" min="0" max="100" step="0.01">
              </div>
              <div class="form-group">
                <label>Selecciona productos para calcular:</label>
                <div id="productos-iva" class="border p-3" style="max-height: 300px; overflow-y: auto;">
                  <!-- Se llenará dinámicamente -->
                </div>
              </div>
              <div id="resultado-iva" style="display: none;">
                <hr>
                <h6>Resultado:</h6>
                <div id="detalle-iva"></div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-success">Calcular IVA</button>
              <button type="button" class="btn btn-secondary" id="cerrar-modal-iva-footer">Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Cargar productos disponibles
  cargarProductosParaIVA();
  
  document.getElementById('cerrar-modal-iva').onclick = () => {
    document.getElementById('modal-iva').remove();
  };
  document.getElementById('cerrar-modal-iva-footer').onclick = () => {
    document.getElementById('modal-iva').remove();
  };
  
  document.getElementById('form-iva').onsubmit = async function(e) {
    e.preventDefault();
    await calcularIVA();
  };
}

async function cargarProductosParaIVA() {
  try {
    const res = await apiRequest('/carteras');
    const productos = await res.json();
    
    const container = document.getElementById('productos-iva');
    container.innerHTML = productos.map(producto => `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${producto._id}" id="producto-${producto._id}">
        <label class="form-check-label" for="producto-${producto._id}">
          ${producto.descripcion} - $${producto.precio.toFixed(2)}
        </label>
        <input type="number" class="form-control mt-1" id="cantidad-${producto._id}" placeholder="Cantidad" min="1" value="1" style="width: 100px; display: inline-block; margin-left: 10px;">
      </div>
    `).join('');
  } catch (error) {
    alert('Error al cargar productos');
  }
}

async function calcularIVA() {
  try {
    const checkboxes = document.querySelectorAll('#productos-iva input[type="checkbox"]:checked');
    const productos = Array.from(checkboxes).map(cb => ({
      _id: cb.value,
      cantidad: parseInt(document.getElementById(`cantidad-${cb.value}`).value) || 1
    }));
    
    if (productos.length === 0) {
      alert('Selecciona al menos un producto');
      return;
    }
    
    const porcentajeIva = parseFloat(document.getElementById('porcentaje-iva').value);
    
    const res = await apiRequest('/carteras/calcular-iva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos, porcentajeIva })
    });
    
    const data = await res.json();
    
    const detalleHtml = `
      <div class="table-responsive">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Unit.</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.productos.map(p => `
              <tr>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precioTotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="row">
        <div class="col-md-4">
          <strong>Subtotal: $${data.subtotal}</strong>
        </div>
        <div class="col-md-4">
          <strong>IVA (${data.porcentajeIva}%): $${data.iva}</strong>
        </div>
        <div class="col-md-4">
          <strong class="text-success">Total: $${data.total}</strong>
        </div>
      </div>
    `;
    
    document.getElementById('detalle-iva').innerHTML = detalleHtml;
    document.getElementById('resultado-iva').style.display = 'block';
  } catch (error) {
    alert('Error al calcular IVA');
  }
}

// Función para mostrar resumen completo
async function mostrarResumenCompleto() {
  try {
    const res = await apiRequest('/carteras/resumen-completo');
    const data = await res.json();
    
    const modalHtml = `
      <div class="modal fade show" id="modal-resumen" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.3);">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content" style="border-radius: 18px;">
            <div class="modal-header" style="background: linear-gradient(90deg, #ffc107 60%, #fd7e14 100%); color: #fff;">
              <h5 class="modal-title"><i class="fas fa-chart-line"></i> Resumen Completo del Inventario</h5>
              <button type="button" class="close" id="cerrar-modal-resumen" style="color:#fff;">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row mb-4">
                <div class="col-md-3">
                  <div class="card text-center">
                    <div class="card-body">
                      <h3 class="text-primary">${data.stock.totalStock}</h3>
                      <p>Total Unidades</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-center">
                    <div class="card-body">
                      <h3 class="text-info">${data.stock.totalProductos}</h3>
                      <p>Total Productos</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-center">
                    <div class="card-body">
                      <h3 class="text-warning">${data.stock.productosBajoStock}</h3>
                      <p>Bajo Stock</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-center">
                    <div class="card-body">
                      <h3 class="text-success">$${data.valores.total}</h3>
                      <p>Valor Total (con IVA)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <h6>Valores del Inventario:</h6>
                  <table class="table table-sm">
                    <tr>
                      <td>Subtotal:</td>
                      <td class="text-right">$${data.valores.subtotal}</td>
                    </tr>
                    <tr>
                      <td>IVA (${data.valores.porcentajeIva}%):</td>
                      <td class="text-right">$${data.valores.iva}</td>
                    </tr>
                    <tr class="table-success">
                      <td><strong>Total:</strong></td>
                      <td class="text-right"><strong>$${data.valores.total}</strong></td>
                    </tr>
                  </table>
                </div>
                <div class="col-md-6">
                  <h6>Alertas de Stock Bajo:</h6>
                  ${data.alertas.productosBajoStock.length > 0 ? `
                    <div class="alert alert-warning">
                      <ul class="mb-0">
                        ${data.alertas.productosBajoStock.map(p => `
                          <li>${p.descripcion}: ${p.stock} unidades</li>
                        `).join('')}
                      </ul>
                    </div>
                  ` : '<p class="text-success">No hay productos con stock bajo</p>'}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cerrar-modal-resumen-footer">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('cerrar-modal-resumen').onclick = () => {
      document.getElementById('modal-resumen').remove();
    };
    document.getElementById('cerrar-modal-resumen-footer').onclick = () => {
      document.getElementById('modal-resumen').remove();
    };
  } catch (error) {
    alert('Error al obtener el resumen completo');
  }
}

// Event listeners para los nuevos botones
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-total-stock').onclick = mostrarTotalStock;
  document.getElementById('btn-calcular-iva').onclick = mostrarCalculadoraIVA;
  document.getElementById('btn-resumen-completo').onclick = mostrarResumenCompleto;
});
