// Variables globales
let productos = [];
let carrito = [];

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    actualizarCarrito();
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    // Buscador
    document.getElementById('search-productos').addEventListener('input', filtrarProductos);
    
    // Botones del carrito
    document.getElementById('btn-limpiar').addEventListener('click', limpiarCarrito);
    document.getElementById('btn-procesar').addEventListener('click', procesarVenta);
}

// Cargar productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:4000/api/carteras');
        if (response.ok) {
            productos = await response.json();
            
            // Asegurar que cada producto tenga una imagen válida
            productos.forEach(producto => {
                if (!producto.imagen || producto.imagen.trim() === '') {
                    // Asignar imagen por defecto basada en el tipo de producto
                    if (producto.descripcion.toLowerCase().includes('bolso') || 
                        producto.descripcion.toLowerCase().includes('cartera')) {
                        producto.imagen = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&crop=center';
                    } else if (producto.descripcion.toLowerCase().includes('zapato')) {
                        producto.imagen = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center';
                    } else if (producto.descripcion.toLowerCase().includes('vestido')) {
                        producto.imagen = 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop&crop=center';
                    } else {
                        producto.imagen = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center';
                    }
                }
            });
            
            mostrarProductos(productos);
        } else {
            console.error('Error al cargar productos:', response.statusText);
            mostrarError('Error al cargar los productos');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('Error de conexión con el servidor');
    }
}

// Mostrar productos en el grid
function mostrarProductos(productosAMostrar) {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = '';

    if (productosAMostrar.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center">
                <p style="color: #b28b8b; font-size: 1.2rem;">No se encontraron productos</p>
            </div>
        `;
        return;
    }

    productosAMostrar.forEach(producto => {
        const sinStock = producto.stock <= 0;
        const stockBajo = producto.stock > 0 && producto.stock <= 5;
        
        const productoCard = document.createElement('div');
        productoCard.className = `producto-card ${sinStock ? 'sin-stock' : ''}`;
        
        productoCard.innerHTML = `
            <img src="${producto.imagen || 'https://via.placeholder.com/80x80/f8eaea/8d5c5c?text=PROD'}" 
                 alt="${producto.descripcion}" 
                 class="producto-imagen"
                 onerror="this.src='https://via.placeholder.com/80x80/f8eaea/8d5c5c?text=PROD'">
            <div class="producto-nombre">${producto.descripcion}</div>
            <div class="producto-precio">$${producto.precio.toFixed(2)}</div>
            <div class="producto-stock ${stockBajo ? 'stock-bajo' : ''}">
                Stock: ${producto.stock} ${stockBajo ? '(Bajo)' : ''}
            </div>
            <button class="btn btn-agregar" 
                    onclick="agregarAlCarrito('${producto._id}')" 
                    ${sinStock ? 'disabled' : ''}>
                <i class="fas fa-plus"></i> Agregar
            </button>
        `;
        
        grid.appendChild(productoCard);
    });
}

// Filtrar productos por búsqueda
function filtrarProductos() {
    const termino = document.getElementById('search-productos').value.toLowerCase();
    const productosFiltrados = productos.filter(producto => 
        producto.descripcion.toLowerCase().includes(termino)
    );
    mostrarProductos(productosFiltrados);
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p._id === productoId);
    if (!producto || producto.stock <= 0) return;

    const itemExistente = carrito.find(item => item._id === productoId);
    
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
        } else {
            mostrarAlerta('No hay suficiente stock disponible');
            return;
        }
    } else {
        carrito.push({
            _id: producto._id,
            descripcion: producto.descripcion,
            precio: producto.precio,
            cantidad: 1,
            stockDisponible: producto.stock
        });
    }
    
    actualizarCarrito();
    mostrarNotificacion(`${producto.descripcion} agregado al carrito`);
}

// Actualizar visualización del carrito
function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <p>Carrito vacío</p>
            </div>
        `;
    } else {
        carritoItems.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <div class="item-header">
                    <div class="item-nombre">${item.descripcion}</div>
                    <button class="btn-eliminar-item" onclick="eliminarDelCarrito('${item._id}')" title="Eliminar producto">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="item-controles">
                    <div class="cantidad-controles">
                        <button class="btn-cantidad" onclick="cambiarCantidad('${item._id}', -1)" ${item.cantidad <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" max="${item.stockDisponible}" 
                               onchange="actualizarCantidadDirecta('${item._id}', this.value)" readonly>
                        <button class="btn-cantidad" onclick="cambiarCantidad('${item._id}', 1)" ${item.cantidad >= item.stockDisponible ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="item-subtotal">$${(item.precio * item.cantidad).toFixed(2)}</div>
                </div>
            </div>
        `).join('');
    }
    
    actualizarResumen();
}

// Cambiar cantidad de un producto en el carrito
function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(item => item._id === productoId);
    if (!item) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(productoId);
        return;
    }
    
    if (nuevaCantidad > item.stockDisponible) {
        mostrarAlerta('No hay suficiente stock disponible');
        return;
    }
    
    item.cantidad = nuevaCantidad;
    actualizarCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item._id !== productoId);
    actualizarCarrito();
}

// Limpiar carrito completo
function limpiarCarrito() {
    if (carrito.length === 0) return;
    
    if (confirm('¿Está seguro de que desea limpiar el carrito?')) {
        carrito = [];
        actualizarCarrito();
        mostrarNotificacion('Carrito limpiado');
    }
}

// Actualizar resumen de precios
function actualizarResumen() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.12;
    const total = subtotal + iva;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Habilitar/deshabilitar botón procesar
    const btnProcesar = document.getElementById('btn-procesar');
    btnProcesar.disabled = carrito.length === 0;
}

// Procesar venta
function procesarVenta() {
    if (carrito.length === 0) return;
    
    if (confirm('¿Desea proceder a generar la factura con los productos seleccionados?')) {
        // Guardar los productos del carrito en localStorage para la facturación
        localStorage.setItem('factura', JSON.stringify(carrito));
        
        // Mostrar notificación
        mostrarNotificacion('Productos enviados a facturación');
        
        // Redirigir a la página de facturación después de un breve delay
        setTimeout(() => {
            window.location.href = 'facturacion.html';
        }, 1000);
    }
}

// Actualizar cantidad directamente desde el input
function actualizarCantidadDirecta(productoId, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    const item = carrito.find(item => item._id === productoId);
    
    if (!item) return;
    
    if (cantidad < 1) {
        eliminarDelCarrito(productoId);
        return;
    }
    
    if (cantidad > item.stockDisponible) {
        mostrarAlerta('No hay suficiente stock disponible');
        actualizarCarrito(); // Revertir el cambio
        return;
    }
    
    item.cantidad = cantidad;
    actualizarCarrito();
}

// Funciones de utilidad
function mostrarError(mensaje) {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = `
        <div class="col-12 text-center">
            <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px;">
                <i class="fas fa-exclamation-triangle"></i> ${mensaje}
            </div>
        </div>
    `;
}

function mostrarAlerta(mensaje) {
    // Notificacion deshabilitada temporalmente
}

function mostrarNotificacion(mensaje) {
    // Notificacion deshabilitada temporalmente
}

// Las animaciones CSS ya están incluidas en notificaciones.js
