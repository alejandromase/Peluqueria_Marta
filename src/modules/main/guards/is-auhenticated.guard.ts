import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';

/**
 * Este guardia de navegación verifica si el usuario está autenticado.
 * Si no lo está, lo redirige a la página de inicio de sesión.
 * @param to - La ruta a la que se quiere acceder.
 * @param from - La ruta desde la que se viene.
 * @param next - La función para continuar o redirigir la navegación.
 */
const isAuthenticatedGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    return next({
      name: 'login',
    });
  }
  return next();
};

export default isAuthenticatedGuard;
