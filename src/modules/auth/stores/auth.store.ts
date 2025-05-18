import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginAction, registerAction } from '../actions';
import type { RegisterPayload } from '../actions/register.action';
import { useLocalStorage } from '@vueuse/core';

// Define el store de autenticación
export const useAuthStore = defineStore(
  'auth',
  () => {
    // Estado de autenticación (Checking, Authenticated, Unauthenticated)
    const authStatus = ref<AuthStatus>(AuthStatus.Checking);
    // Usuario autenticado
    const user = ref<User | undefined>();
    // Token de autenticación, persistido en localStorage
    const token = ref(useLocalStorage('token', ''));

    /**
     * Realiza el login del usuario.
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @returns true si el login es exitoso, false en caso contrario
     */
    const login = async (email: string, password: string) => {
      try {
        const loginResp = await loginAction(email, password);
        if (!loginResp.ok) {
          logout();
          return false;
        }

        user.value = loginResp.user;
        token.value = loginResp.token;
        authStatus.value = AuthStatus.Authenticated;

        return true;
      } catch (error) {
        return logout();
      }
    };

    /**
     * Realiza el registro de un nuevo usuario.
     * @param payload Datos del usuario a registrar
     * @returns { ok: true, message: '' } si el registro es exitoso, { ok: false, message: string } en caso contrario
     */
    const register = async (payload: RegisterPayload) => {
      try {
        const registerResp = await registerAction(payload);

        if (!registerResp.ok) {
          logout();
          return { ok: false, message: registerResp.message };
        }

        user.value = registerResp.user;
        token.value = registerResp.token;
        authStatus.value = AuthStatus.Authenticated;

        return { ok: true, message: '' };
      } catch (error) {
        return { ok: false, message: 'Error al registrar el usuario' };
      }
    };

    /**
     * Realiza el logout del usuario.
     * Limpia el usuario, el token y cambia el estado de autenticación a Unauthenticated.
     * @returns false
     */
    const logout = () => {
      user.value = undefined;
      token.value = '';
      localStorage.clear();
      authStatus.value = AuthStatus.Unauthenticated;
      return false;
    };

    /**
     * Verifica el estado de autenticación del usuario.
     * @returns true si la autenticación es válida, false en caso contrario
     */
    const checkAuthStatus = async (): Promise<boolean> => {
      try {
        const statusResp = await checkAuthAction();

        if (!statusResp.ok) {
          logout();
          return false;
        }

        authStatus.value = AuthStatus.Authenticated;
        user.value = statusResp.user;
        token.value = statusResp.token;
        return true;
      } catch (error) {
        logout();
        return false;
      }
    };

    return {
      user,
      token,
      authStatus,

      // Getters
      // Indica si el estado de autenticación es Checking
      isChecking: computed(() => authStatus.value === AuthStatus.Checking),
      // Indica si el usuario está autenticado
      isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
      // Indica si el usuario es administrador
      isAdmin: computed(() => user.value?.roles.includes('admin') ?? false),
      // Nombre de usuario
      username: computed(() => user.value?.fullName),

      // Actions
      login,
      logout,
      register,
      checkAuthStatus,
    };
  },
  {
    persist: true,
  },
);
