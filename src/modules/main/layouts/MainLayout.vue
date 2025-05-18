<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg fixed w-full z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <RouterLink to="/" class="flex items-center">
              <TitleIcon class="w-14 h-14 text-indigo-600" alt="Logo de la peluquería" />
              <span class="text-xl font-bold text-indigo-600 hidden sm:inline"
                ><span class="text-5xl font-light -mr-3">P</span>eluquería Marta</span
              >
            </RouterLink>
          </div>
          <div class="flex items-center">
            <button
              v-if="authStore.isAuthenticated"
              @click="handleLogout"
              class="ml-4 px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Cerrar sesión
            </button>
            <RouterLink
              v-if="isHomePage"
              to="/service"
              class="ml-4 px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 text-center"
            >
              Pedir cita
            </RouterLink>
            <RouterLink
              to="/user"
              class="ml-4 flex items-center justify-center rounded-full hover:bg-indigo-100"
              aria-label="Mi perfil"
            >
              <InitialsLetters :full-name="authStore.user?.fullName" class="w-10 h-10 border border-indigo-600" alt="Mi perfil" />
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
    <div class="pt-16"><router-view/></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import TitleIcon from '@/icons/TitleIcon.vue';
import InitialsLetters from '../components/decore/InitialsLetters.vue';

// Obtiene la ruta actual
const route = useRoute();
// Obtiene el router
const router = useRouter();
// Obtiene el store de autenticación
const authStore = useAuthStore();

/**
 * Propiedad computada que indica si la página actual es la página de inicio.
 */
const isHomePage = computed(() => {
  return route.path === '/home';
});

/**
 * Función para cerrar la sesión del usuario.
 * Llama al método logout del store de autenticación y redirige al usuario a la página de inicio.
 */
const handleLogout = () => {
  authStore.logout();
  router.push('/home');
};
</script>
