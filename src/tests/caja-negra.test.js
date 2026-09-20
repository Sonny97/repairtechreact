// =============================================
// PRUEBAS DE CAJA NEGRA - Frontend
//
// Técnicas: Partición de Equivalencia, Análisis de Valores Límite,
//           Diagrama de Transición de Estados, Tablas de Decisión
//
// Componentes: RegistroModal, LoginModal, AgendarCita
// =============================================

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistroModal from '../components/RegistroModal';
import LoginModal from '../components/LoginModal';
import AgendarCita from '../components/AgendarCita';
import * as userService from '../services/userService';
import * as citaService from '../services/citaService';

jest.mock('../services/userService');
jest.mock('../services/citaService');

const registroProps = { isOpen: true, onClose: jest.fn(), onRegisterSuccess: jest.fn() };
const loginProps = { isOpen: true, onClose: jest.fn(), onLogin: jest.fn(), onSwitchToRegister: jest.fn() };
const agendarProps = { currentUser: { id: 1, nombre_completo: 'Juan Perez', email: 'juan@test.com', telefono: '3001234567', direccion: 'Calle 123' }, onCitaAgendada: jest.fn() };

const PH = {
  docNumber: /número de documento/i,
  fullName: /nombre completo/i,
  phone: /teléfono/i,
  email: /correo electrónico/i,
  address: /dirección/i,
  password: /contraseña/i,
};

const fillField = async (key, value) => {
  const input = screen.getByPlaceholderText(PH[key]);
  if (value !== '') {
    await userEvent.clear(input);
    await userEvent.type(input, value);
  }
};

// =============================================================
// 1. PARTICIÓN DE EQUIVALENCIA
// =============================================================
describe('1. PARTICIÓN DE EQUIVALENCIA', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    render(<RegistroModal {...registroProps} />);
  });

  describe('V1: password', () => {
    const validForm = { docNumber: '12345678', fullName: 'Juan Perez', phone: '3001234567', email: 'juan@test.com', address: 'Calle 123', password: 'Clave123' };

    test('CP-EQ01 | CE1: password vacío -> requerido', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', '');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
      });
    });

    test('CP-EQ02 | CE2: password 5 chars -> mínimo 6', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', '12345');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
      });
    });

    test('CP-EQ03 | CE3: password 6+ chars -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', 'Clave123');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/la contraseña es requerida/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('V2: telefono', () => {
    const validForm = { docNumber: '12345678', fullName: 'Juan Perez', phone: '3001234567', email: 'juan@test.com', address: 'Calle 123', password: 'Clave123' };

    test('CP-EQ04 | CE4: telefono vacío -> requerido', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', '');
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.getByText(/el teléfono es requerido/i)).toBeInTheDocument();
      });
    });

    test('CP-EQ05 | CE5: telefono 9 dígitos -> error 10 dígitos', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', '300123456');
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.getByText(/10 dígitos/i)).toBeInTheDocument();
      });
    });

    test('CP-EQ06 | CE6: telefono 10 dígitos -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', '3001234567');
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/10 dígitos/i)).not.toBeInTheDocument();
      });
    });
  });
});

// =============================================================
// 2. ANÁLISIS DE VALORES LÍMITE
// =============================================================
describe('2. ANÁLISIS DE VALORES LÍMITE', () => {

  const validForm = { docNumber: '12345678', fullName: 'Juan Perez', phone: '3001234567', email: 'juan@test.com', address: 'Calle 123', password: 'Clave123' };

  beforeEach(() => {
    jest.clearAllMocks();
    render(<RegistroModal {...registroProps} />);
  });

  describe('password.length — frontera en 6', () => {
    test('CP-VL01 | límite ext inf (0) -> requerido', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', '');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument());
    });

    test('CP-VL02 | límite -1 (5) -> mínimo 6', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', 'aaaaa');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument());
    });

    test('CP-VL03 | límite (6) -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', 'aaaaaa');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/al menos 6 caracteres/i)).not.toBeInTheDocument();
      });
    });

    test('CP-VL04 | límite +1 (7) -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', 'aaaaaaa');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/al menos 6 caracteres/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('telefono.length — frontera en 10', () => {
    test('CP-VL06 | límite -1 (9) -> error', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', '300123456');
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => expect(screen.getByText(/10 dígitos/i)).toBeInTheDocument());
    });

    test('CP-VL07 | límite (10) -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', validForm.fullName);
      await fillField('phone', '3001234567');
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/10 dígitos/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('docNumber.length — frontera en 6', () => {
    test('CP-VL11 | límite -1 (5) -> mínimo 6', async () => {
      await fillField('docNumber', '12345');
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument());
    });

    test('CP-VL12 | límite (6) -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', '123456');
      await fillField('fullName', validForm.fullName);
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/al menos 6 caracteres/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('fullName.length — frontera en 3', () => {
    test('CP-VL14 | límite -1 (2) -> mínimo 3', async () => {
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', 'AB');
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument());
    });

    test('CP-VL15 | límite (3) -> pasa', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      await fillField('docNumber', validForm.docNumber);
      await fillField('fullName', 'Ana');
      await fillField('phone', validForm.phone);
      await fillField('email', validForm.email);
      await fillField('address', validForm.address);
      await fillField('password', validForm.password);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        expect(screen.queryByText(/al menos 3 caracteres/i)).not.toBeInTheDocument();
      });
    });
  });
});

// =============================================================
// 3. TRANSICIÓN DE ESTADOS - AgendarCita
// =============================================================
describe('3. DIAGRAMA DE TRANSICIÓN DE ESTADOS - AgendarCita', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    citaService.getTecnicosDisponibles.mockResolvedValue({ success: true, data: [{ id: 1 }] });
    citaService.crearCita.mockResolvedValue({ success: true, data: { id: 1 } });
    render(<AgendarCita {...agendarProps} />);
  });

  test('CP-ET01 | Step1 + tipo vacío -> permanece con error', () => {
    const continuar = screen.getByRole('button', { name: /continuar/i });
    fireEvent.click(continuar);
    expect(screen.getByText(/tipo de servicio/i)).toBeInTheDocument();
  });

  test('CP-ET02 | Step1 + tipo válido -> avanza a Step2', async () => {
    await userEvent.click(screen.getByText(/mantenimiento preventivo/i));
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByText(/información del equipo/i)).toBeInTheDocument();
  });

  test('CP-ET03 | Step2 + datos válidos -> avanza a Step3', async () => {
    await userEvent.click(screen.getByText(/mantenimiento preventivo/i));
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    await userEvent.click(screen.getByText(/^Lavadora$/));
    await userEvent.type(screen.getByPlaceholderText(/describe el problema/i), 'El motor hace mucho ruido');
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByText(/selecciona la fecha/i)).toBeInTheDocument();
  });

  test('CP-ET04 | Step2 + descripcion < 10 -> permanece con error', async () => {
    await userEvent.click(screen.getByText(/mantenimiento preventivo/i));
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    await userEvent.click(screen.getByText(/^Lavadora$/));
    await userEvent.type(screen.getByPlaceholderText(/describe el problema/i), 'Ruido');
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByText(/10 caracteres/i)).toBeInTheDocument();
  });

  test('CP-ET05 | Step2 + Atras -> regresa a Step1', async () => {
    await userEvent.click(screen.getByText(/mantenimiento preventivo/i));
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    fireEvent.click(screen.getByRole('button', { name: /atrás/i }));
    expect(screen.getByText(/tipo de servicio/i)).toBeInTheDocument();
  });

});

// =============================================================
// 4. TABLAS DE DECISIÓN
// =============================================================
describe('4. TABLAS DE DECISIÓN', () => {

  describe('LoginModal', () => {
    test('CP-TD01 | email requerido -> HTML5 lo bloquea', () => {
      render(<LoginModal {...loginProps} />);
      expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeRequired();
    });

    test('CP-TD02 | password requerido -> HTML5 lo bloquea', () => {
      render(<LoginModal {...loginProps} />);
      expect(screen.getByPlaceholderText(/contraseña/i)).toBeRequired();
    });

    test('CP-TD05 | datos válidos -> loginUser llamado', async () => {
      userService.loginUser.mockResolvedValueOnce({ success: true, data: { id: 1, email: 'test@test.com' } });
      render(<LoginModal {...loginProps} />);
      await userEvent.type(screen.getByPlaceholderText(/correo electrónico/i), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText(/contraseña/i), '123456');
      await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => {
        expect(userService.loginUser).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
      });
    });
  });

  describe('RegistroModal handleSubmit', () => {
    test('CP-TD-R1 | todos vacíos -> 6 errores acumulados', async () => {
      render(<RegistroModal {...registroProps} />);
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBeGreaterThanOrEqual(6);
      });
    });

    test('CP-TD-R4 | varios campos inválidos -> acumula errores', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', '123');
      await fillField('fullName', 'AB');
      await fillField('phone', '123');
      await fillField('email', 'bad');
      await fillField('address', '');
      await fillField('password', '12');
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      await waitFor(() => {
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBeGreaterThanOrEqual(4);
      });
    });
  });
});
