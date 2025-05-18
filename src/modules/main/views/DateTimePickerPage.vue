<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Selecciona fecha y hora</h1>

        <!-- Estado de carga -->
        <div v-if="isLoading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Cargando horarios disponibles...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600">
            Error al cargar los horarios disponibles. Por favor, inténtalo de nuevo.
          </p>
          <button
            @click="loadSlots"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Reintentar
          </button>
        </div>

        <!-- Contenido principal -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Calendario -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-900">Fecha</h2>
            <Datepicker
              v-model="selectedDate"
              :disabled-dates="isDateDisabled"
              :min-date="minDate"
              :inline="true"
              :monday-first="true"
              :enable-time-picker="false"
              :auto-apply="true"
              locale="es"
              class="p-2"
            />
          </div>

          <!-- Selector de hora -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-900">Hora</h2>
            <div class="space-y-6">
              <!-- Horario de mañana -->
              <div>
                <h3 class="text-lg font-medium text-gray-700 mb-3">Mañana</h3>
                <div
                  class="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-2 bg-blue-50 rounded-lg"
                >
                  <button
                    v-for="time in morningTimes"
                    :key="time"
                    @click="selectTime(time)"
                    :class="[
                      'p-2 rounded-md text-center text-sm shadow-md',
                      selectedTime === time
                        ? 'bg-[#1976D2] text-white'
                        : 'hover:bg-gray-100 bg-blue-100',
                    ]"
                    :disabled="!isTimeAvailable(time)"
                  >
                    {{ time }}
                  </button>
                </div>
              </div>

              <!-- Horario de tarde -->
              <div>
                <h3 class="text-lg font-medium text-gray-700 mb-3">Tarde</h3>
                <div
                  class="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-2 bg-orange-50 rounded-lg"
                >
                  <button
                    v-for="time in afternoonTimes"
                    :key="time"
                    @click="selectTime(time)"
                    :class="[
                      'p-2 rounded-md text-center text-sm shadow-md',
                      selectedTime === time
                        ? 'bg-[#1976D2] text-white'
                        : 'hover:bg-gray-100 bg-orange-100',
                    ]"
                    :disabled="!isTimeAvailable(time)"
                  >
                    {{ time }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <RouterLink
            to="/service"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Volver</RouterLink
          >
          <button
            @click="handleConfirmSelection"
            :disabled="!selectedDate || !selectedTime"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCalendar } from '@/modules/main/composables/useCalendar';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { getDayAppointments } from '../actions/calendar.actions';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { formatDateForComparison, timeToMinutes, isTimeValid } from '../utils/dateUtils';
import type { DayAppointments } from '../interfaces/calendar.interface';

// Router para la navegación
const router = useRouter();
// Store de autenticación
const authStore = useAuthStore();

// Obtener el servicio seleccionado del localStorage
const selectedService = JSON.parse(localStorage.getItem('selectedService') || '{}');
const serviceDuration = selectedService.duration || 0; // Duración en minutos

// Composables para la gestión del calendario
const {
  selectedDate,
  selectedTime,
  isLoading,
  error,
  selectTime,
  confirmSelection,
  loadSlots,
  isDayDisabled,
  availableTimes,
  workHours,
  minDate,
  blockedDates,
  loadBlockedDates,
} = useCalendar();

// Estado para las citas del día
const dayAppointments = ref<DayAppointments | null>(null);
// Estado para indicar si se están cargando las citas del día
const isLoadingAppointments = ref(false);

/**
 * Función para verificar si una fecha está deshabilitada.
 * Se considera deshabilitada si es un día de descanso o si está bloqueada por la API.
 * @param date Fecha a verificar.
 * @returns boolean - true si la fecha está deshabilitada, false en caso contrario.
 */
const isDateDisabled = (date: Date) => {
  const dateStr = formatDateForComparison(date);

  // Verificar si es un día de descanso
  if (isDayDisabled(date)) {
    return true;
  }

  // Verificar si es un día bloqueado por la API y está bloqueado todo el día
  if (
    blockedDates.value.some(
      (blockedDate) => blockedDate.date === dateStr && blockedDate.blockType === 'full',
    )
  ) {
    return true;
  }

  return false;
};

/**
 * Función para filtrar las horas de la mañana.
 * @returns array - Lista de horas disponibles en la mañana.
 */
const morningTimes = computed(() => {
  const [morningStart] = workHours.value.morningStart.split(':').map(Number);
  const [morningEnd] = workHours.value.morningEnd.split(':').map(Number);
  return availableTimes.value.filter((time) => {
    const hour = parseInt(time.split(':')[0]);
    return (
      hour >= morningStart &&
      hour < morningEnd &&
      isTimeValid(time, workHours.value.morningEnd, serviceDuration) &&
      isTimeAvailable(time)
    );
  });
});

/**
 * Función para filtrar las horas de la tarde.
 * @returns array - Lista de horas disponibles en la tarde.
 */
const afternoonTimes = computed(() => {
  const [afternoonStart] = workHours.value.afternoonStart.split(':').map(Number);
  const [afternoonEnd] = workHours.value.afternoonEnd.split(':').map(Number);
  return availableTimes.value.filter((time) => {
    const hour = parseInt(time.split(':')[0]);
    return (
      hour >= afternoonStart &&
      hour < afternoonEnd &&
      isTimeValid(time, workHours.value.afternoonEnd, serviceDuration) &&
      isTimeAvailable(time)
    );
  });
});

/**
 * Función para cargar las citas del día seleccionado.
 * @param date Fecha seleccionada.
 */
const loadDayAppointments = async (date: Date) => {
  isLoadingAppointments.value = true;
  const dateStr = formatDateForComparison(date);
  dayAppointments.value = await getDayAppointments(dateStr);
  isLoadingAppointments.value = false;
};

/**
 * Observa los cambios en la fecha seleccionada y carga las citas del día correspondiente.
 */
watch(selectedDate, (newDate) => {
  if (newDate) {
    loadDayAppointments(new Date(newDate));
  }
});

/**
 * Función para verificar si una hora está disponible.
 * Se considera disponible si no está bloqueada y si no se solapa con otra cita.
 * @param time Hora a verificar.
 * @returns boolean - true si la hora está disponible, false en caso contrario.
 */
const isTimeAvailable = (time: string) => {
  if (!dayAppointments.value) return false;

  // Verificar si la mañana o tarde está bloqueada
  const hour = parseInt(time.split(':')[0]);
  const isMorning = hour < 14; // Asumiendo que la tarde empieza a las 14:00

  if (isMorning && dayAppointments.value.blockedMorning) return false;
  if (!isMorning && dayAppointments.value.blockedAfternoon) return false;

  // Verificar que no se sobrepase el horario de finalización
  const timeInMinutes = timeToMinutes(time);
  const serviceEndTime = timeInMinutes + serviceDuration;
  const endTimeInMinutes = timeToMinutes(
    isMorning ? workHours.value.morningEnd : workHours.value.afternoonEnd,
  );

  if (serviceEndTime > endTimeInMinutes) return false;

  // Verificar si la hora está ocupada o se solapa con otra cita
  const appointments = isMorning
    ? dayAppointments.value.morningAppointments
    : dayAppointments.value.afternoonAppointments;

  return !appointments.some((appointment) => {
    const appointmentStart = timeToMinutes(appointment.time);
    const appointmentEnd = appointmentStart + appointment.duration;

    // Verificar si hay solapamiento
    return (
      (timeInMinutes >= appointmentStart && timeInMinutes < appointmentEnd) || // La hora seleccionada está dentro de una cita existente
      (serviceEndTime > appointmentStart && timeInMinutes < appointmentEnd)
    ); // La cita seleccionada se solapa con una existente
  });
};

/**
 * Función para manejar la confirmación de la selección de fecha y hora.
 * Redirige al usuario a la página de detalles de la reserva o a la página de inicio de sesión si no está autenticado.
 */
const handleConfirmSelection = () => {
  const result = confirmSelection();
  localStorage.setItem('lastPath', '/datetime');

  if (result) {
    // Usar el estado reactivo de autenticación del store
    if (authStore.isAuthenticated) {
      router.push('/reservation-details');
    } else {
      router.push('/auth/login');
    }
  }
};

/**
 * Función para encontrar el próximo día disponible.
 */
const findNextAvailableDate = async () => {
  const today = new Date();
  const currentDate = new Date(today);

  // Buscar el próximo día disponible (máximo 30 días)
  for (let i = 0; i < 30; i++) {
    if (!isDateDisabled(currentDate)) {
      // Convertir la fecha al formato requerido
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      selectedDate.value = `${year}-${month}-${day}`;
      // Cargar las citas del día seleccionado
      await loadDayAppointments(currentDate);
      return;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
};

/**
 * Cargar datos al montar el componente.
 */
onMounted(async () => {
  await loadSlots();
  await loadBlockedDates();
  // Establecer el próximo día disponible después de cargar los datos
  setTimeout(findNextAvailableDate, 100);
});
</script>
