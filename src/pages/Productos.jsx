import React from 'react';
import '../styles/Productos.css';

const Productos = ({ productos = [], onAgregarCarrito }) => {
    return (
        <section id="productos" className="productos">
            <h2 data-aos="fade-left">Venta de Insumos</h2>

            <div className="product-grid" id="productGrid">
                {productos.map((producto, index) => (
                    <div 
                        key={index} 
                        className="product-card"
                        data-aos="flip-left"
                        data-aos-delay={index * 200}
                    >
                        <img src={producto.imagen} alt={producto.alt} />
                        <h3>{producto.nombre}</h3>
                        <p className="price">{producto.precio}</p>
                        <button 
                            className="btn-secondary agregar-btn"
                            onClick={() => onAgregarCarrito(producto)}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Productos;
