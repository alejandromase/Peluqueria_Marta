import { peluqueriaApi } from '@/api/peluqueriaApi';
import type { AuthResponse, User } from '../interfaces';

// Interfaz para el error de registro
interface RegisterError {
  ok: false;
  message: string;
}

// Interfaz para el éxito de registro
interface RegisterSuccess {
  ok: true;
  user: User;
  token: string;
}

// Payload esperado para el registro de usuario
export interface RegisterPayload {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
}

/**
 * Realiza el registro de un nuevo usuario.
 * - Si el registro es exitoso, retorna el usuario y el token.
 * - Si falla, retorna un mensaje de error.
 * @param payload Datos del usuario a registrar
 * @returns Promesa con el resultado del registro
 */
export const registerAction = async (
  payload: RegisterPayload,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    // Envía la petición de registro a la API
    const { data } = await peluqueriaApi.post<AuthResponse>('/auth/register', payload);
    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    // Si ocurre un error, retorna mensaje de usuario ya existente
    console.log(error);
    return <RegisterError>{
      ok: false,
      message: 'El usuario ya existe',
    };
  }
};
