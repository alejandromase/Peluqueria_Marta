<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Inicia sesión</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?
          <router-link to="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500" replace>
            Regístrate aquí
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="errorMsg" class="mb-4 text-red-600 bg-red-100 border border-red-400 rounded px-4 py-2 text-center">
          {{ errorMsg }}
        </div>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input id="email" v-model="email" type="email" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email" />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input id="password" v-model="password" type="password" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

// Variables reactivas para el email y la contraseña
const email = ref('');
const password = ref('');
// Variable reactiva para el mensaje de error
const errorMsg = ref('');
// Router para la navegación
const router = useRouter();
// Store de autenticación
const authStore = useAuthStore();

/**
 * Función asíncrona para manejar el inicio de sesión.
 * Llama al método login del store de autenticación y redirige al usuario
 * a la página correspondiente según el último path visitado.
 */
const handleLogin = async () => {
  const ok = await authStore.login(email.value, password.value);
  if (!ok) {
    errorMsg.value = 'Credenciales incorrectas';
    return;
  }
  // Redirige después de login
  const lastPath = localStorage.getItem('lastPath');
  if (lastPath === '/datetime') {
    router.push({ name: 'reservation-details' });
  } else if (lastPath === '/home') {
    router.push({ name: 'user' });
  } else {
    router.push({ name: 'home' });
  }
};
</script>
