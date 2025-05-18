<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
    <div class="p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Mi perfil</h2>
      <div class="flex items-center mb-6">
        <InitialsLetters :full-name="user?.fullName" class="text-2xl h-20 w-20 mr-4"/>
        <div>
          <h3 class="text-xl font-semibold text-gray-900">{{ user?.fullName }}</h3>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Nombre completo</p>
            <p class="text-gray-900 h-7">{{ user?.fullName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="text-gray-900 h-7">{{ user?.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Teléfono</p>
            <p class="text-gray-900 h-7">{{ user?.phone || 'No proporcionado' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Rol</p>
            <p class="text-gray-900 h-7">{{ user?.roles.join(', ') }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Dirección</p>
            <p class="text-gray-900 h-7">{{ user?.address_street }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Ciudad</p>
            <p class="text-gray-900 h-7">{{ user?.address_city }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Provincia</p>
            <p class="text-gray-900 h-7">{{ user?.address_state }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Código Postal</p>
            <p class="text-gray-900 h-7">{{ user?.address_postal_code }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import InitialsLetters from '@/modules/main/components/decore/InitialsLetters.vue';

// Usa el store de autenticación para obtener la información del usuario
const { user } = useAuthStore();
</script>