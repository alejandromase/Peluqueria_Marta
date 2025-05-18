<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
    <div class="p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestión de servicios</h2>

      <!-- Formulario para agregar servicio -->
      <div class="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Agregar nuevo servicio</h3>
        <form @submit.prevent="saveService" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="serviceDescription" class="block text-sm font-medium text-gray-700">Descripción del
                servicio</label>
              <input type="text" id="serviceDescription" v-model="serviceForm.description"
                class="p-4 bg-white mt-1 block w-full rounded-md border border-gray-300 h-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required />
            </div>
            <div>
              <label for="serviceDuration" class="block text-sm font-medium text-gray-700">Duración (minutos)</label>
              <input type="number" id="serviceDuration" v-model="serviceForm.duration"
                class="p-4 bg-white mt-1 block w-full rounded-md border border-gray-300 h-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required min="1" />
            </div>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Agregar
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de servicios -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Lista de servicios</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col"
                  class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción</th>
                <th scope="col"
                  class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración</th>
                <th scope="col"
                  class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="service in services" :key="service.id">
                <td class="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="max-w-[200px] sm:max-w-none truncate">{{ service.description }}</div>
                </td>
                <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{
                  formatDuration(service.duration) }}</td>
                <td class="px-3 sm:px-6 py-4 text-sm font-medium">
                  <button @click="deleteService(service.id)"
                    class="text-red-600 hover:text-red-900 border border-red-600 rounded-md px-2 py-1 text-xs sm:text-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getServicesAction, addServiceAction, deleteServiceAction } from '@/modules/main/actions/services.actions';
import type { Service } from '@/modules/main/interfaces';
import { useToast } from 'vue-toastification';

// Utilidad para mostrar notificaciones
const toast = useToast();
// Estado para almacenar la lista de servicios
const services = ref<Service[]>([]);

// Estado para el formulario de servicio
const serviceForm = reactive({
  description: '',
  duration: 0,
});

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
 * Función asíncrona para cargar los servicios desde la API.
 */
const loadServices = async () => {
  services.value = await getServicesAction();
};

/**
 * Función asíncrona para guardar un nuevo servicio en la API.
 */
const saveService = async () => {
  await addServiceAction({
    description: serviceForm.description,
    duration: serviceForm.duration,
  });
  toast.success("Servicio agregado");
  await loadServices();

  resetForm();
};

/**
 * Función asíncrona para eliminar un servicio de la API.
 * @param id ID del servicio a eliminar.
 */
const deleteService = async (id: string) => {
  if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
    try {
      await deleteServiceAction(id);
      toast.success("Servicio eliminado");
      await loadServices();
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  }
};

/**
 * Función para resetear el formulario.
 */
const resetForm = () => {
  serviceForm.description = '';
  serviceForm.duration = 0;
};

/**
 * Cargar los servicios al montar el componente.
 */
onMounted(() => {
  loadServices();
});
</script>