import React, { useState } from 'react';
import '../styles/Modal.css';
import '../styles/Productos.css';

const CartModal = ({
    isOpen,
    onClose,
    carrito,
    onCambiarCantidad,
    onEliminar,
    currentShipping,
    onShippingChange,
    currentCoupon,
    onAplicarCupon,
    currentPayment,
    onPaymentChange,
    onFinalizarCompra
}) => {
    const [couponInput, setCouponInput] = useState('');
    const [couponMsg, setCouponMsg] = useState('');

    if (!isOpen) return null;

    const calcularSubtotal = () => {
        return carrito.reduce((acc, item) => {
            const precioNum = parseInt(item.precio.replace(/[^0-9]/g, "")) || 0;
            return acc + precioNum * item.cantidad;
        }, 0);
    };

    const subtotal = calcularSubtotal();
    const descuento = Math.round(subtotal * (currentCoupon.discountPercent / 100));
    const envio = parseInt(currentShipping, 10) || 0;
    const total = subtotal - descuento + envio;

    const handleAplicarCupon = () => {
        if (!couponInput.trim()) {
            setCouponMsg("Ingrese un código.");
            return;
        }
        const msg = onAplicarCupon(couponInput);
        setCouponMsg(msg);
    };

    const handleFinalizarCompra = () => {
        onFinalizarCompra();
        setCouponInput('');
        setCouponMsg('');
    };

    const handlePayNow = () => {
        alert("Redirigiendo a pasarela de pago...");
        handleFinalizarCompra();
    };

    return (
        <div id="cartModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Carrito de Compras</h2>
                
                {carrito.length === 0 ? (
                    <p>El carrito está vacío.</p>
                ) : (
                    <>
                        <ul className="cart-items">
                            {carrito.map((item, idx) => (
                                <li key={idx}>
                                    <span className="cart-item-name">{item.nombre}</span>
                                    <div className="cart-item-controls">
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => onCambiarCantidad(idx, -1)}
                                        >-</button>
                                        <span className="cart-item-qty">{item.cantidad}</span>
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => onCambiarCantidad(idx, 1)}
                                        >+</button>
                                        <button 
                                            className="remove-btn" 
                                            onClick={() => onEliminar(idx)}
                                        >×</button>
                                    </div>
                                    <span className="cart-item-price"><strong>{item.precio}</strong></span>
                                </li>
                            ))}
                        </ul>

                        <div className="cart-controls">
                            <div className="cart-summary">
                                <p>Subtotal: ${subtotal.toLocaleString()}</p>
                                <p>Descuento: ${descuento.toLocaleString()}</p>
                                <p>Envío: ${envio.toLocaleString()}</p>
                            </div>

                            <div className="cart-options">
                                <div className="cart-shipping">
                                    <label>Envío:</label>
                                    <select 
                                        value={currentShipping} 
                                        onChange={(e) => onShippingChange(parseInt(e.target.value))}
                                    >
                                        <option value="0">Recoger en tienda - Gratis</option>
                                        <option value="5000">Envío estándar - $5.000</option>
                                        <option value="10000">Envío express - $10.000</option>
                                    </select>
                                </div>

                                <div className="cart-coupon">
                                    <label>Cupón de descuento:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Código"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                    />
                                    <button className="btn-secondary" onClick={handleAplicarCupon}>
                                        Aplicar
                                    </button>
                                    {couponMsg && <p className="coupon-msg">{couponMsg}</p>}
                                </div>

                                <div className="payment-methods">
                                    <p>Método de pago:</p>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="cartPayment" 
                                            value="card"
                                            checked={currentPayment === 'card'}
                                            onChange={(e) => onPaymentChange(e.target.value)}
                                        /> Tarjeta
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="cartPayment" 
                                            value="cash"
                                            checked={currentPayment === 'cash'}
                                            onChange={(e) => onPaymentChange(e.target.value)}
                                        /> Efectivo
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="cartPayment" 
                                            value="transfer"
                                            checked={currentPayment === 'transfer'}
                                            onChange={(e) => onPaymentChange(e.target.value)}
                                        /> Transferencia
                                    </label>
                                </div>
                            </div>

                            <p className="cart-total">Total: ${total.toLocaleString()}</p>

                            <div className="checkout-buttons">
                                <button className="btn-primary" onClick={handleFinalizarCompra}>
                                    Finalizar Compra
                                </button>
                                <button className="btn-secondary" onClick={handlePayNow}>
                                    Pagar Ahora
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;
