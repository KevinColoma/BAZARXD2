// Variables globales
let carteras = [];
let carterasFiltradas = [];

// Cargar carteras desde el backend y mostrarlas en la tabla
async function cargarCarteras() {
  try {
    const res = await fetch('http://localhost:4000/api/carteras');
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

// Formulario para agregar cartera
function mostrarFormularioCartera() {
  const formHtml = `
    <div class="modal fade show" id="modal-cartera" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-modal="true" style="display:block; background:rgba(0,0,0,0.3);">
      <div class="modal-dialog" role="document" style="max-width: 600px;">
        <div class="modal-content" style="border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(141,92,92,0.25);">
          <div class="modal-header" style="background: linear-gradient(90deg, #8d5c5c 60%, #c7a7a7 100%); color: #fff; border-top-left-radius: 18px; border-top-right-radius: 18px;">
            <h5 class="modal-title" id="modalLabel"><i class="fas fa-plus-circle"></i> Agregar Cartera</h5>
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
    const res = await fetch('http://localhost:4000/api/carteras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartera)
    });
    if(res.ok) {
      alert('Cartera agregada');
      document.getElementById('modal-cartera').remove();
      cargarCarteras(); // Recargar datos sin reload de página
    } else {
      alert('Error al agregar cartera');
    }
  };
}

// Modal para editar cartera con Bootstrap
function mostrarFormularioEditarCartera(cartera) {
  const formHtml = `
    <div class="modal fade show" id="modal-editar-cartera" tabindex="-1" role="dialog" aria-labelledby="modalEditLabel" aria-modal="true" style="display:block; background:rgba(0,0,0,0.3);">
      <div class="modal-dialog" role="document" style="max-width: 600px;">
        <div class="modal-content" style="border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(141,92,92,0.25);">
          <div class="modal-header" style="background: linear-gradient(90deg, #c7a7a7 0%, #8d5c5c 100%); color: #fff; border-top-left-radius: 18px; border-top-right-radius: 18px;">
            <h5 class="modal-title" id="modalEditLabel"><i class="fas fa-pen-to-square"></i> Editar Cartera</h5>
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
    const res = await fetch(`http://localhost:4000/api/carteras/${cartera._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carteraEditada)
    });
    if(res.ok) {
      alert('Cartera actualizada');
      document.getElementById('modal-editar-cartera').remove();
      cargarCarteras(); // Recargar datos sin reload de página
    } else {
      alert('Error al actualizar cartera');
    }
  };
}

// Función para editar cartera
async function editarCartera(id) {
  try {
    const res = await fetch('http://localhost:4000/api/carteras');
    const data = await res.json();
    const cartera = data.find(c => c._id === id);
    if (cartera) {
      mostrarFormularioEditarCartera(cartera);
    }
  } catch (error) {
    alert('Error al cargar los datos de la cartera');
  }
}

// Función para eliminar cartera
async function eliminarCartera(id) {
  if (confirm('¿Seguro que deseas eliminar esta cartera?')) {
    try {
      const res = await fetch(`http://localhost:4000/api/carteras/${id}`, {
        method: 'DELETE'
      });
      if(res.ok) {
        alert('Cartera eliminada');
        cargarCarteras(); // Recargar datos sin reload de página
      } else {
        alert('Error al eliminar cartera');
      }
    } catch (error) {
      alert('Error de conexión al eliminar cartera');
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
  // Evento para eliminar cartera
  if (e.target.closest('.fa-trash')) {
    const id = e.target.closest('.fa-trash').getAttribute('data-id');
    if (confirm('¿Seguro que deseas eliminar esta cartera?')) {
      fetch(`http://localhost:4000/api/carteras/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        if(res.ok) {
          alert('Cartera eliminada');
          location.reload();
        } else {
          alert('Error al eliminar cartera');
        }
      });
    }
  }
});

document.getElementById('btn-nueva-cartera').onclick = function(e) {
  e.preventDefault();
  mostrarFormularioCartera();
}
