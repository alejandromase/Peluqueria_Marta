import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';

/**
 * Este guardia de navegación verifica si se ha seleccionado un servicio.
 * Si no se ha seleccionado, redirige al usuario a la página de inicio.
 * @param to - La ruta a la que se quiere acceder.
 * @param from - La ruta desde la que se viene.
 * @param next - La función para continuar o redirigir la navegación.
 */
const isSelectedService = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
) => {
  localStorage.setItem('lastPath', to.path);
  const selectedService = localStorage.getItem('selectedService');
  if (!selectedService) {
    return next({
      name: 'home',
    });
  }
  return next();
};

export default isSelectedService;
