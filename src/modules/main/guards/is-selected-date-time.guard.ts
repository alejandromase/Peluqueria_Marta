import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';

/**
 * Este guardia de navegación verifica si se ha seleccionado una fecha y hora.
 * Si no se ha seleccionado, redirige al usuario a la página de inicio.
 * @param to - La ruta a la que se quiere acceder.
 * @param from - La ruta desde la que se viene.
 * @param next - La función para continuar o redirigir la navegación.
 */
const isSelectedDateTime = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
) => {
  const selectedDateTime = localStorage.getItem('selectedDateTime');
  localStorage.setItem('lastPath', to.path);
  if (!selectedDateTime) {
    return next({
      name: 'home',
    });
  }
  return next();
};

export default isSelectedDateTime;
