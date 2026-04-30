import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import RegistroModal from './components/RegistroModal';
import LoginModal from './components/LoginModal';
import UsuariosModal from './components/UsuariosModal';
import CartModal from './components/CartModal';
import AdminLayout from './components/AdminLayout';

import Inicio from './pages/Inicio';
import Servicios from './pages/Servicios';
import Productos from './pages/Productos';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [modals, setModals] = useState({
    registroModal: false,
    loginModal: false,
    usuariosModal: false,
    cartModal: false
  });

  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false); // Nuevo estado

  const [carrito, setCarrito] = useState([]);
  const [currentShipping, setCurrentShipping] = useState(0);
  const [currentCoupon, setCurrentCoupon] = useState({ code: null, discountPercent: 0 });
  const [currentPayment, setCurrentPayment] = useState('card');

  const [usuariosContacto, setUsuariosContacto] = useState([
    {
      nombre: "Juan Pérez",
      email: "juanito@juanito.com",
      telefono: "3201234567",
      mensaje: "Hola, este es un mensaje de prueba.",
    },
    {
      nombre: "Pedro",
      email: "pedro@pedro.com",
      telefono: "3201234567",
      mensaje: "Hola, este es un mensaje de prueba.",
    },
  ]);

  const listaInsumos = [
    {
      imagen: "/img/repuesto1.jpg",
      alt: "Repuesto Lavadora",
      nombre: "Motor para Lavadora",
      precio: "$120.000"
    },
    {
      imagen: "/img/repuesto2.jpg",
      alt: "Repuesto Nevera",
      nombre: "Termostato Nevera",
      precio: "$45.000"
    },
    {
      imagen: "/img/compresor-nevera.jpg",
      alt: "Compresor Nevera",
      nombre: "Compresor Nevera",
      precio: "$250.000"
    },
    {
      imagen: "/img/Bomba-lavadora.jpg",
      alt: "Bomba de Agua",
      nombre: "Bomba de Agua Lavadora",
      precio: "$85.000"
    }
  ];

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        // Si el usuario es admin, mostrar vista de admin
        if (user.rol === 'admin') {
          setIsAdminView(true);
        }
      } catch (e) {
        console.error('Error al cargar usuario:', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && window.AOS) {
      window.AOS.init({ duration: 1000, once: true });
    }
  }, [isLoading]);

  const abrirModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const cerrarModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const handleRegister = (newAccount) => {
    if (accounts.find(acc => acc.email === newAccount.email)) {
      alert('Ya existe una cuenta con ese correo.');
      return false;
    }
    setAccounts(prev => [...prev, newAccount]);
    alert('Registro exitoso. Ya puedes iniciar sesión.');
    cerrarModal('registroModal');
    return true;
  };

  // Login conectado al backend
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    alert(`Bienvenido ${userData.nombre_completo || userData.email}`);
    cerrarModal('loginModal');
    
    // Si es admin, cambiar a vista de administrador
    if (userData.rol === 'admin') {
      setIsAdminView(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminView(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Sesión cerrada correctamente');
  };

  const agregarAlCarrito = (insumo) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.nombre === insumo.nombre);
      if (existente) {
        return prev.map(item =>
          item.nombre === insumo.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...insumo, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (index, delta) => {
    setCarrito(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].cantidad += delta;
        if (updated[index].cantidad <= 0) {
          updated.splice(index, 1);
        }
      }
      return updated;
    });
  };

  const eliminarDelCarrito = (index) => {
    setCarrito(prev => prev.filter((_, i) => i !== index));
  };

  const aplicarCupon = (code) => {
    const upperCode = code.toUpperCase();
    if (upperCode === "REPAIR10") {
      setCurrentCoupon({ code: upperCode, discountPercent: 10 });
      return "Cupón aplicado: 10%";
    } else if (upperCode === "ENVIOGRATIS") {
      setCurrentCoupon({ code: upperCode, discountPercent: 0 });
      setCurrentShipping(0);
      return "Cupón aplicado: envío gratis";
    } else {
      setCurrentCoupon({ code: null, discountPercent: 0 });
      return "Cupón inválido.";
    }
  };

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    const orden = {
      items: carrito.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })),
      shipping: currentShipping,
      coupon: currentCoupon.code || null,
      payment: currentPayment,
      user: currentUser ? { id: currentUser.id, email: currentUser.email } : null
    };
    console.log("Orden enviada:", orden);
    alert("Compra realizada. Revisa la consola para detalles.");
    setCarrito([]);
    setCurrentCoupon({ code: null, discountPercent: 0 });
    setCurrentShipping(0);
    cerrarModal('cartModal');
  };

  const agregarUsuarioContacto = (usuario) => {
    setUsuariosContacto(prev => [...prev, usuario]);
  };

  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Si es admin y está en vista de admin, mostrar AdminLayout
  if (isAdminView && currentUser?.rol === 'admin') {
    return (
      <>
        <Loader isLoading={isLoading} />
        <AdminLayout 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />
      </>
    );
  }

  // Vista normal para clientes y usuarios no logueados
  return (
    <div className="App">
      <Loader isLoading={isLoading} />

      <Header 
        abrirModal={abrirModal} 
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={totalUnidades}
        isAdminView={false}
      />

      <main>
        <Inicio />
        <Servicios onMantenimientoClick={() => abrirModal('usuariosModal')} />
        <Productos 
          productos={listaInsumos} 
          onAgregarCarrito={agregarAlCarrito}
        />
        <Nosotros />
        <Contacto onSubmitUsuario={agregarUsuarioContacto} />
      </main>

      <Footer />

      <RegistroModal 
        isOpen={modals.registroModal} 
        onClose={() => cerrarModal('registroModal')}
        onRegister={handleRegister}
      />
      
      <LoginModal 
        isOpen={modals.loginModal} 
        onClose={() => cerrarModal('loginModal')}
        onLogin={handleLogin}
      />
      
      <UsuariosModal 
        isOpen={modals.usuariosModal} 
        onClose={() => cerrarModal('usuariosModal')}
        usuarios={usuariosContacto}
      />
      
      <CartModal
        isOpen={modals.cartModal}
        onClose={() => cerrarModal('cartModal')}
        carrito={carrito}
        onCambiarCantidad={cambiarCantidad}
        onEliminar={eliminarDelCarrito}
        currentShipping={currentShipping}
        onShippingChange={setCurrentShipping}
        currentCoupon={currentCoupon}
        onAplicarCupon={aplicarCupon}
        currentPayment={currentPayment}
        onPaymentChange={setCurrentPayment}
        onFinalizarCompra={finalizarCompra}
      />
    </div>
  );
}

export default App;