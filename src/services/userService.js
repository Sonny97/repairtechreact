import api from './api';

// Ejemplo de servicios para gestionar endpoints de usuarios
export const login = async (credentials) => {
  return api.get('/', { params: { email: credentials.email, password: credentials.password } });
};

export const register = async (userData) => {
  return api.post('/register', userData);
};

// Puedes agregar más endpoints aquí según necesites
// export const getUsers = async () => {
//   return api.get('/users');
// };