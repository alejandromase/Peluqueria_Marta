<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Componentes para administradores -->
      <div v-if="isAdmin" class="space-y-8">
        <ClientReservations />
        <AdminCalendar />
        <ServiceManagement />
      </div>

      <!-- Perfil del usuario -->
      <UserProfile/>
      <!-- Mis reservas -->
      <UserReservations />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProfile from '@/modules/main/components/user/UserProfile.vue';
import AdminCalendar from '@/modules/main/components/admin/AdminCalendar.vue';
import ServiceManagement from '@/modules/main/components/admin/ServiceManagement.vue';
import UserReservations from '@/modules/main/components/user/UserReservations.vue';
import ClientReservations from '@/modules/main/components/admin/ClientReservations.vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

// Utiliza el store de autenticación para verificar si el usuario es administrador
const { isAdmin } = useAuthStore();
</script>
