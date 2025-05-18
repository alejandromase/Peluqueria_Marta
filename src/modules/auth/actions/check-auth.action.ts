import { peluqueriaApi } from '@/api/peluqueriaApi';
import type { AuthResponse, User } from '../interfaces';
import { isAxiosError } from 'axios';

// Interfaz para el error de comprobación de autenticación
interface CheckError {
  ok: false;
}

// Interfaz para el éxito de comprobación de autenticación
interface CheckSuccess {
  ok: true;
  user: User;
  token: string;
}

/**
 * Verifica el estado de autenticación del usuario.
 * - Si el token es inválido o la petición falla con 401, retorna { ok: false }
 * - Si la autenticación es válida, retorna el usuario y el token
 * @returns Promesa con el resultado de la comprobación
 */
export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    // Obtiene el token del almacenamiento local y verifica su longitud
    const localToken = localStorage.getItem('token');
    if (localToken && localToken.length < 10) {
      return { ok: false };
    }

    // Realiza la petición para comprobar el estado de autenticación
    const { data } = await peluqueriaApi.get<AuthResponse>('/auth/check-status');

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    // Si la respuesta es 401, retorna error de autenticación
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      };
    }

    // Lanza un error genérico si ocurre otro problema
    throw new Error('No se pudo verificar la sesión');
  }
};
