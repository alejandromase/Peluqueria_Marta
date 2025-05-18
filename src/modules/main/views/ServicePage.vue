<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Servicios</h1>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex flex-col justify-center text-center h-150">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando servicios...</p>
      </div>

      <div v-else class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="service in services" :key="service.id"
          class="relative bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border-b-4 border-r-4 border-indigo-200"
          @click="selectService(service)">
          <div class="px-4 py-5 sm:p-6">
            <p class="text-lg font-medium text-gray-900">
              {{ service.description }}
            </p>
            <p class="mt-2 text-sm text-gray-500">
              Duración: {{ formatDuration(service.duration) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getServicesAction } from '../actions/services.actions';
import type { Service } from '../interfaces';

// Router para la navegación
const router = useRouter();
// Estado para almacenar la lista de servicios
const services = ref<Service[]>([]);
// Estado para indicar si se están cargando los servicios
const isLoading = ref<boolean>(true);

/**
 * Función para formatear la duración en un formato legible.
 * @param minutes Duración en minutos.
 * @returns Duración formateada en horas y minutos.
 */
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} minutos`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }

  return `${hours} ${hours === 1 ? 'hora' : 'horas'} ${remainingMinutes} minutos`;
};

/**
 * Función para seleccionar un servicio y navegar a la página de selección de fecha y hora.
 * @param service Servicio seleccionado.
 */
const selectService = (service: Service) => {
  localStorage.setItem('selectedService', JSON.stringify(service));
  router.push({ name: 'datetime' });
};

/**
 * Cargar los servicios al montar el componente.
 */
onMounted(async () => {
  isLoading.value = true;
  try {
    services.value = await getServicesAction();
    isLoading.value = false;
  } catch (error) {
    console.error('Error al cargar los servicios:', error);
  }
});
</script>