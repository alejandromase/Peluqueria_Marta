<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
    <div class="p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Mis Reservas</h2>

      <!-- Pestañas -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button v-for="tab in tabs" :key="tab.value" @click="currentTab = tab.value" :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            currentTab === tab.value
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando reservas...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
        <button @click="loadReservations"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Reintentar
        </button>
      </div>

      <!-- Lista de reservas -->
      <div v-else-if="filteredAppointments.length > 0" class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        <div v-for="appointment in filteredAppointments" :key="appointment.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow border-blue-200">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ appointment.serviceName }}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="{
                  'bg-green-100 text-green-800': appointment.status === 'confirmed',
                  'bg-blue-100 text-blue-800': appointment.status === 'completed',
                  'bg-red-100 text-red-800': appointment.status === 'cancelled'
                }">
                  {{ getStatusText(appointment.status) }}
                </span>
              </div>
              <div class="flex items-center text-gray-500">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(appointment.date) }}</span>
              </div>
              <div class="flex items-center text-gray-500">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ appointment.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay reservas -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No hay reservas {{ currentTab === 'upcoming' ? 'próximas' : 'pasadas' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          No tienes ninguna reserva {{ currentTab === 'upcoming' ? 'programada' : 'realizada' }}.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getUserAppointments } from '@/modules/main/actions/appointments.actions';
import type { AppointmentResponse } from '@/modules/main/interfaces/appointment.interface';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { formatDate } from '@/modules/main/utils/dateUtils';

const authStore = useAuthStore();
// Estado para almacenar las reservas del usuario
const appointments = ref<AppointmentResponse[]>([]);
// Estado para indicar si se están cargando las reservas
const loading = ref(true);
// Estado para almacenar un posible error
const error = ref<string | null>(null);
// Estado para la pestaña activa ('upcoming' o 'past')
const currentTab = ref<'upcoming' | 'past'>('upcoming');

// Definición de las pestañas
const tabs: { label: string; value: 'upcoming' | 'past' }[] = [
  { label: 'Próximas', value: 'upcoming' },
  { label: 'Pasadas', value: 'past' },
];

/**
 * Función para convertir una fecha en formato DD-MM-YYYY a objeto Date.
 * @param dateString Fecha en formato DD-MM-YYYY.
 * @returns Objeto Date correspondiente a la fecha.
 */
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Propiedad computada para filtrar las reservas según la pestaña seleccionada.
 * Las reservas se ordenan por fecha (ascendente para 'upcoming', descendente para 'past').
 */
const filteredAppointments = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return appointments.value
    .filter(app => {
      const d = parseDate(app.date);
      d.setHours(0, 0, 0, 0);
      return currentTab.value === 'upcoming' ? d >= today : d < today;
    })
    .sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      return currentTab.value === 'upcoming'
        ? da.getTime() - db.getTime()
        : db.getTime() - da.getTime();
    });
});

/**
 * Traduce estados básicos
 * @param status Estado de la reserva
 * @returns string Estado traducido
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'pending':
      return 'Pendiente';
    case 'completed':
      return 'Completada';
    default:
      return status;
  }
};

/**
 * Función asíncrona para cargar las reservas del usuario desde la API.
 */
const loadReservations = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!authStore.user?.id) {
      throw new Error('ID de usuario no encontrado');
    }
    appointments.value = await getUserAppointments(authStore.user.id);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error cargando reservas';
  } finally {
    loading.value = false;
  }
};

/**
 * Cargar las reservas al montar el componente.
 */
onMounted(loadReservations);
</script>
