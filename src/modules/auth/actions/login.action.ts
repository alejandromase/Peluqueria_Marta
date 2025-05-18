import { peluqueriaApi } from '@/api/peluqueriaApi';
import type { AuthResponse, User } from '../interfaces';
import { isAxiosError } from 'axios';

// Interfaz para el error de login
interface LoginError {
  ok: false;
  message: string;
}

// Interfaz para el éxito de login
interface LoginSuccess {
  ok: true;
  user: User;
  token: string;
}

/**
 * Realiza la acción de login con email y contraseña.
 * - Si las credenciales son correctas, retorna el usuario y el token.
 * - Si son incorrectas, retorna un mensaje de error.
 * @param email Email del usuario
 * @param password Contraseña del usuario
 * @returns Promesa con el resultado del login
 */
export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginError | LoginSuccess> => {
  try {
    // Realiza la petición de login a la API
    const { data } = await peluqueriaApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    // Si la respuesta es 401, retorna mensaje de usuario o contraseña incorrectos
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrectos',
      };
    }

    // Muestra el error por consola y lanza un error genérico
    console.log(error);
    console.log('No se pudo realizar la petición');
    throw new Error('No se pudo realizar la petición');
  }
};
