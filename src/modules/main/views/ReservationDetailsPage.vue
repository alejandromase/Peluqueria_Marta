<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Detalles de la Reserva</h2>

          <!-- Estado de carga -->
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Procesando reserva...</p>
          </div>

          <!-- Detalles de la reserva -->
          <div v-else class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Servicio</h3>
                <p class="text-gray-600">{{ selectedService?.description }}</p>
                <p class="text-sm text-gray-500 mt-1">Duración: {{ selectedService?.duration }} minutos</p>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Fecha y Hora</h3>
                <p class="text-gray-600">{{ formatDate(selectedDate) }}</p>
                <p class="text-gray-600">{{ selectedTime }}</p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <div class="flex justify-between">
                <button @click="router.push('/datetime')"
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Volver
                </button>
                <button @click="confirmReservation"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  :disabled="loading">
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createAppointment } from '../actions/appointments.actions';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type { Service } from '../interfaces';
import { useToast } from 'vue-toastification';
import { formatDate } from '../utils/dateUtils';

// Utilidad para mostrar notificaciones
const toast = useToast();
// Router para la navegación
const router = useRouter();
// Store de autenticación
const authStore = useAuthStore();

// Estado para indicar si se está procesando la reserva
const loading = ref(false);
// Estado para almacenar un posible error
const error = ref<string | null>(null);

// Estado para almacenar el servicio seleccionado
const selectedService = ref<Service | null>(null);
// Estado para almacenar la fecha seleccionada
const selectedDate = ref('');
// Estado para almacenar la hora seleccionada
const selectedTime = ref('');

/**
 * Función para cargar los datos almacenados en el localStorage.
 */
const loadStoredData = () => {
  const service = localStorage.getItem('selectedService');
  const dateTime = localStorage.getItem('selectedDateTime');

  if (service) selectedService.value = JSON.parse(service);
  if (dateTime) {
    const { date, time } = JSON.parse(dateTime);
    selectedDate.value = date;
    selectedTime.value = time;
  }
};

/**
 * Verificar que todos los datos necesarios estén presentes al montar el componente.
 * Si falta algún dato, redirige al usuario a la página de selección de servicio.
 */
onMounted(() => {
  loadStoredData();

  if (!selectedService.value || !selectedDate.value || !selectedTime.value) {
    router.push('/service');
  }
});

/**
 * Función para confirmar la reserva.
 * Envía la petición para crear la reserva y redirige al usuario a la página de usuario.
 */
const confirmReservation = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore.user?.id) {
      throw new Error('No se ha encontrado el ID del usuario');
    }

    if (!selectedService.value?.id) {
      throw new Error('No se ha seleccionado un servicio');
    }

    if (!selectedDate.value || !selectedTime.value) {
      throw new Error('No se ha seleccionado una fecha y hora');
    }

    // Formatear la fecha al formato requerido (DD-MM-YYYY)
    const [year, month, day] = selectedDate.value.split('-');
    const formattedDate = `${day}-${month}-${year}`;

    await createAppointment({
      userId: authStore.user.id,
      date: formattedDate,
      time: selectedTime.value,
      serviceId: selectedService.value.id,
      status: 'confirmed'
    });

    toast.success('Reserva confirmada con éxito');

    // Limpiar localStorage
    localStorage.removeItem('selectedService');
    localStorage.removeItem('selectedDateTime');

    // Redirigir a la página de usuario
    router.push('/user');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al confirmar la reserva';
    toast.error('Ya existe una reserva para esta fecha y hora');
  } finally {
    loading.value = false;
  }
};
</script>
