<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-screen">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Crear una cuenta</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?
          <router-link to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500" replace>
            Inicia sesión aquí
          </router-link>
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleRegister">
        <div class="flex justify-center">
          <div v-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
          <p v-if="passwordError" class="text-red-600 bg-red-100 border border-red-400 rounded px-4 py-2 text-center">{{
            passwordError }}
          </p>
        </div>

        <div class="rounded-md shadow-lg">
          <!-- Campos obligatorios -->
          <div class="rounded-md border-t-1 border-gray-300">
            <label for="fullName" class="sr-only">Nombre completo</label>
            <input id="fullName" v-model="fullName" type="text" required class="input-field rounded-t-md"
              placeholder="Nombre completo" />
          </div>
          <div>
            <label for="phone" class="sr-only">Teléfono</label>
            <input id="phone" v-model="phone" type="tel" required class="input-field" placeholder="Teléfono" />
          </div>
          <div>
            <label for="email" class="sr-only">Correo electrónico</label>
            <input id="email" v-model="email" type="email" required class="input-field"
              placeholder="Correo electrónico" />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input id="password" v-model="password" type="password" required class="input-field"
              placeholder="Contraseña" @input="validatePassword" />
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">Confirmar contraseña</label>
            <input id="confirmPassword" v-model="confirmPassword" type="password" required
              class="input-field input-field rounded-b-md" placeholder="Confirmar contraseña"
              @input="validatePassword" />
          </div>
        </div>

        <div class="rounded-md shadow-lg">
          <div class="rounded-md border-t-1 border-gray-300">
            <label for="address" class="sr-only">Dirección</label>
            <input id="address" v-model="address" type="text" class="input-field rounded-t-md"
              placeholder="Dirección (opcional)" />
          </div>
          <div>
            <label for="city" class="sr-only">Ciudad</label>
            <input id="city" v-model="city" type="text" class="input-field" placeholder="Ciudad (opcional)" />
          </div>
          <div>
            <label for="state" class="sr-only">Estado</label>
            <input id="state" v-model="state" type="text" class="input-field" placeholder="Estado (opcional)" />
          </div>
          <div>
            <label for="zip" class="sr-only">Código postal</label>
            <input id="zip" v-model="zip" type="text" class="input-field rounded-b-md"
              placeholder="Código postal (opcional)" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="!isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

// Router para la navegación
const router = useRouter();
// Variables reactivas para los campos del formulario
const fullName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const address = ref('');
const city = ref('');
const state = ref('');
const zip = ref('');
// Variables reactivas para los mensajes de error
const errorMsg = ref('');
const passwordError = ref('');
// Store de autenticación
const authStore = useAuthStore();

/**
 * Propiedad computada que determina si el formulario es válido.
 * Verifica que todos los campos obligatorios estén llenos,
 * que las contraseñas coincidan y que la contraseña cumpla con los requisitos de seguridad.
 */
const isFormValid = computed(() => {
  const hasUpperCase = /[A-Z]/.test(password.value);
  const hasLowerCase = /[a-z]/.test(password.value);
  const hasNumbers = /\d/.test(password.value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);

  return (
    fullName.value &&
    phone.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= 8 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
});

/**
 * Valida la contraseña y actualiza el mensaje de error correspondiente.
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario.
 */
const validatePassword = () => {
  const hasUpperCase = /[A-Z]/.test(password.value);
  const hasLowerCase = /[a-z]/.test(password.value);
  const hasNumbers = /\d/.test(password.value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);

  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Las contraseñas no coinciden';
    return false;
  }

  if (password.value.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres';
    return false;
  }

  if (!hasUpperCase) {
    passwordError.value = 'La contraseña debe contener al menos una letra mayúscula';
    return false;
  }

  if (!hasLowerCase) {
    passwordError.value = 'La contraseña debe contener al menos una letra minúscula';
    return false;
  }

  if (!hasNumbers) {
    passwordError.value = 'La contraseña debe contener al menos un número';
    return false;
  }

  if (!hasSpecialChar) {
    passwordError.value = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)';
    return false;
  }

  passwordError.value = '';
  return true;
};

/**
 * Función asíncrona para manejar el registro de un nuevo usuario.
 * Llama al método register del store de autenticación y redirige al usuario
 * a la página correspondiente según el último path visitado.
 */
const handleRegister = async () => {
  errorMsg.value = '';

  if (!validatePassword()) {
    return;
  }

  const resp = await authStore.register({
    fullName: fullName.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    address_street: address.value || undefined,
    address_city: city.value || undefined,
    address_state: state.value || undefined,
    address_postal_code: zip.value || undefined
  });
  if (!resp.ok) {
    errorMsg.value = resp.message || 'Error al registrar';
    return;
  }

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

<style>
@import 'tailwindcss';

.input-field {
  @apply flex w-full px-3 py-2 border border-t-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm;
}
</style>
