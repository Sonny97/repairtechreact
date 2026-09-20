// =============================================
// PRUEBAS DE CAJA BLANCA - Frontend
//
// Algoritmo: handleSubmit() de RegistroModal.jsx
// Decisiones: D1..D11  |  V(G) = 12
//
// Técnicas: Statement Coverage, Decision Coverage,
//           Path Coverage, Condition Coverage
// =============================================

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistroModal from '../components/RegistroModal';
import * as userService from '../services/userService';

jest.mock('../services/userService');

const registroProps = { isOpen: true, onClose: jest.fn(), onRegisterSuccess: jest.fn() };

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

const submit = () => fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

const FORM_VALID = {
  docNumber: '12345678', fullName: 'Juan Perez',
  phone: '3001234567', email: 'juan@test.com',
  address: 'Calle 123', password: 'Clave123'
};

// =============================================================
// 1. COBERTURA DE SENTENCIA - 3 casos
// =============================================================
describe('1. COBERTURA DE SENTENCIA (Statement Coverage)', () => {

  test('CP-S1: todos vacíos -> nodos de error', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', '');
    await fillField('phone', '');
    await fillField('email', '');
    await fillField('address', '');
    await fillField('password', '');
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    });
  });

  test('CP-S2: todos válidos -> registerUser llamado', async () => {
    userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', FORM_VALID.docNumber);
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', FORM_VALID.phone);
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => {
      expect(userService.registerUser).toHaveBeenCalledTimes(1);
    });
  });

  test('CP-S3: varios campos cortos -> errores parciales', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '12345');
    await fillField('fullName', 'AB');
    await fillField('phone', '123456789');
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', '12345');
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(4);
    });
  });
});

// =============================================================
// 2. COBERTURA DE DECISIÓN - 2 casos
// =============================================================
describe('2. COBERTURA DE DECISIÓN (Branch Coverage)', () => {

  test('CP-D1: todas las ramas V (rechazo)', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', '');
    await fillField('phone', '');
    await fillField('email', '');
    await fillField('address', '');
    await fillField('password', '');
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    });
  });

  test('CP-D2: todas las ramas F (aprobación)', async () => {
    userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', FORM_VALID.docNumber);
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', FORM_VALID.phone);
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => {
      expect(userService.registerUser).toHaveBeenCalledTimes(1);
    });
  });
});

// =============================================================
// 3. COBERTURA DE CAMINOS - 7 caminos
// =============================================================
describe('3. COBERTURA DE CAMINOS (Path Coverage)', () => {

  test('CP-R1 | 0 errores', async () => {
    userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', FORM_VALID.docNumber);
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', FORM_VALID.phone);
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => expect(userService.registerUser).toHaveBeenCalledTimes(1));
  });

  test('CP-R2 | 1 err: docNumber vacío', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', FORM_VALID.phone);
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => {
      expect(screen.getByText(/número de documento/i)).toBeInTheDocument();
    });
  });

  test('CP-R3 | 1 err: docNumber corto', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '12345');
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', FORM_VALID.phone);
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => {
      expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  test('CP-R4 | 2 err: docNumber + phone vacíos', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', '');
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(2);
    });
  });

  test('CP-R5 | 3 err: docNumber + phone + password vacíos', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', FORM_VALID.fullName);
    await fillField('phone', '');
    await fillField('email', FORM_VALID.email);
    await fillField('address', FORM_VALID.address);
    await fillField('password', '');
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3);
    });
  });

  test('CP-R6 | 5 err: docNumber+fullName+phone+email+address', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', '');
    await fillField('phone', '');
    await fillField('email', '');
    await fillField('address', '');
    await fillField('password', FORM_VALID.password);
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(5);
    });
  });

  test('CP-R7 | 6 err: todos vacíos', async () => {
    render(<RegistroModal {...registroProps} />);
    await fillField('docNumber', '');
    await fillField('fullName', '');
    await fillField('phone', '');
    await fillField('email', '');
    await fillField('address', '');
    await fillField('password', '');
    submit();
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    });
  });
});

// =============================================================
// 4. PRUEBAS DE CONDICIÓN Y COBERTURA
// =============================================================
describe('4. PRUEBAS DE CONDICIÓN Y COBERTURA', () => {

  describe('Condiciones individuales', () => {
    test('C1=V (!docNumber)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', '');
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/número de documento/i)).toBeInTheDocument());
    });

    test('C2=V (docNumber<6)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', '12345');
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument());
    });

    test('C3=V (!fullName)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', '');
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/nombre completo/i)).toBeInTheDocument());
    });

    test('C4=V (fullName<3)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', 'AB');
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument());
    });

    test('C5=V (!phone)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', '');
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/teléfono/i)).toBeInTheDocument());
    });

    test('C6=V (phone<10)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', '300123456');
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/10 dígitos/i)).toBeInTheDocument());
    });

    test('C7=V (!email)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', '');
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/correo electrónico/i)).toBeInTheDocument());
    });

    test('C8=V (!validarEmail)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', 'no-es-email');
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/válido/i)).toBeInTheDocument());
    });

    test('C9=V (!address)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', '');
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/dirección/i)).toBeInTheDocument());
    });

    test('C10=V (!password)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', '');
      submit();
      await waitFor(() => expect(screen.getByText(/contraseña/i)).toBeInTheDocument());
    });

    test('C11=V (password<6)', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', '12345');
      submit();
      await waitFor(() => expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument());
    });

    test('Todas F: registro exitoso', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(userService.registerUser).toHaveBeenCalledTimes(1));
    });
  });

  describe('Condición múltiple D8: validarEmail', () => {
    test('Email vacío -> C7=V, C8 no evaluada', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', '');
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/correo electrónico/i)).toBeInTheDocument());
    });

    test('Email sin @ -> C7=F, C8=V', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', 'testtest.com');
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/válido/i)).toBeInTheDocument());
    });

    test('Email sin dominio -> C7=F, C8=V', async () => {
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', 'test@test');
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(screen.getByText(/válido/i)).toBeInTheDocument());
    });

    test('Email válido -> C7=F, C8=F', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: true, data: { id: 1 } });
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', 'test@test.com');
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => expect(userService.registerUser).toHaveBeenCalledTimes(1));
    });
  });

  describe('Backend error path (línea 113)', () => {
    test('Registro exitoso pero backend retorna error', async () => {
      userService.registerUser.mockResolvedValueOnce({ success: false, message: 'El usuario ya existe' });
      render(<RegistroModal {...registroProps} />);
      await fillField('docNumber', FORM_VALID.docNumber);
      await fillField('fullName', FORM_VALID.fullName);
      await fillField('phone', FORM_VALID.phone);
      await fillField('email', FORM_VALID.email);
      await fillField('address', FORM_VALID.address);
      await fillField('password', FORM_VALID.password);
      submit();
      await waitFor(() => {
        expect(screen.getByText(/el usuario ya existe/i)).toBeInTheDocument();
      });
    });
  });
});
