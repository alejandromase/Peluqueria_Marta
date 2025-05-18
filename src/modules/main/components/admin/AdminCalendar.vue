<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
    <div class="p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestión de disponibilidad</h2>

      <!-- Configuración de horarios -->
      <div class="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Configuración de horarios</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Horario de mañana -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-700">Horario de mañana</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
                <input
                  type="time"
                  v-model="workHours.morningStart"
                  class="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Hora de fin (de jornada)</label
                >
                <input
                  type="time"
                  v-model="workHours.morningEnd"
                  class="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <!-- Horario de tarde -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-700">Horario de tarde</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
                <input
                  type="time"
                  v-model="workHours.afternoonStart"
                  class="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Hora de fin (de jornada)</label
                >
                <input
                  type="time"
                  v-model="workHours.afternoonEnd"
                  class="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="handleUpdateWorkHours"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Guardar horarios
          </button>
        </div>
      </div>

      <!-- Días de descanso -->
      <div class="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Días de descanso semanales del año</h3>
        <form @submit.prevent="handleUpdateRestDays" class="space-y-4">
          <div class="flex flex-wrap gap-4 justify-between">
            <div v-for="day in orderedDays" :key="day.key" class="flex items-center">
              <input
                type="checkbox"
                :id="day.key"
                v-model="restDays[day.key]"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="day.key" class="ml-2 block text-sm text-gray-900">
                {{ day.label }}
              </label>
            </div>
          </div>
          <div class="mt-4">
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Guardar días de descanso
            </button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Calendario</h3>
          <div class="flex flex-col items-center p-4">
            <div>
              <Datepicker
                v-model="selectedDate"
                :disabled-dates="isDayDisabled"
                :markers="markers"
                :inline="true"
                :monday-first="true"
                :enable-time-picker="false"
                :auto-apply="true"
                :multi-dates="true"
                :multi-dates-limit="10"
                :min-date="minDate"
                locale="es"
                class="p-4"
                @update:model-value="handleDateSelection"
              />
            </div>
            <div class="mt-4 flex flex-col space-y-6">
              <div class="flex flex-col space-y-3">
                <h4 class="text-sm font-medium text-gray-700">Selecciona el tipo de bloqueo:</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <label
                    class="relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md group min-h-[60px]"
                    :class="[
                      selectedBlockType === 'full'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-200',
                    ]"
                  >
                    <input type="radio" v-model="selectedBlockType" value="full" class="sr-only" />
                    <div class="flex justify-center w-full">
                      <span class="font-medium text-gray-700 text-sm text-center">Todo el día</span>
                    </div>
                  </label>

                  <label
                    class="relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md group min-h-[60px]"
                    :class="[
                      selectedBlockType === 'morning'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-200',
                    ]"
                  >
                    <input
                      type="radio"
                      v-model="selectedBlockType"
                      value="morning"
                      class="sr-only"
                    />
                    <div class="flex justify-center w-full">
                      <span class="font-medium text-gray-700 text-sm text-center">Mañana</span>
                    </div>
                  </label>

                  <label
                    class="relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md group min-h-[60px]"
                    :class="[
                      selectedBlockType === 'afternoon'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200',
                    ]"
                  >
                    <input
                      type="radio"
                      v-model="selectedBlockType"
                      value="afternoon"
                      class="sr-only"
                    />
                    <div class="flex justify-center w-full">
                      <span class="font-medium text-gray-700 text-sm text-center">Tarde</span>
                    </div>
                  </label>

                  <label
                    class="relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md group min-h-[60px]"
                    :class="[
                      selectedBlockType === 'available'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-200',
                    ]"
                  >
                    <input
                      type="radio"
                      v-model="selectedBlockType"
                      value="available"
                      class="sr-only"
                    />
                    <div class="flex w-full justify-center">
                      <span class="font-medium text-gray-700 text-sm text-center"
                        >Hacer disponibles</span
                      >
                    </div>
                  </label>
                </div>
              </div>
              <div class="flex space-x-3">
                <button
                  @click="confirmMultipleSelection"
                  class="px-6 py-2.5 rounded-md transition-colors duration-200 font-medium"
                  :class="[
                    selectedBlockType === 'available'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white',
                  ]"
                >
                  {{
                    selectedBlockType === 'available'
                      ? 'Hacer disponibles'
                      : 'Marcar como no disponibles'
                  }}
                </button>
                <button
                  @click="clearDateSelection"
                  class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Limpiar selección
                </button>
              </div>
            </div>
            <div v-if="selectedDates.length > 0" class="mt-4 w-full">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Días seleccionados:</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="date in selectedDates"
                  :key="date"
                  class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm"
                >
                  {{ date }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Días no disponibles</h3>
          <div class="mb-4">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.name"
                  @click="activeTab = tab.name"
                  :class="[
                    activeTab === tab.name
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  ]"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>
          </div>

          <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
            <div
              v-for="blockedDate in filteredBlockedDates"
              :key="blockedDate.id"
              :class="[
                'flex items-center justify-between p-3 rounded-lg border transition-colors duration-200',
                getBlockTypeColor(blockedDate.blockType),
              ]"
            >
              <div class="flex items-center space-x-2">
                <span class="text-gray-700 font-medium">{{ formatDate(blockedDate.date) }}</span>
                <span class="text-sm text-gray-500">
                  ({{
                    blockedDate.blockType === 'full'
                      ? 'Todo el día'
                      : blockedDate.blockType === 'morning'
                        ? 'Mañana'
                        : 'Tarde'
                  }})
                </span>
              </div>
              <button
                @click="handleRemoveBlockedDate(blockedDate)"
                class="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useCalendar } from '@/modules/main/composables/useCalendar';
import type { BlockedDate } from '@/modules/main/interfaces/calendar.interface';
import type { DatePickerMarker } from '@vuepic/vue-datepicker';
import { deleteBlockedDates } from '@/modules/main/actions/calendar.actions';
import { useToast } from 'vue-toastification';
import { formatDateForComparison, formatDate } from '../../utils/dateUtils';

// Utilidad para mostrar notificaciones
const toast = useToast();

// Tipo de bloqueo seleccionado por defecto
const selectedBlockType = ref<'full' | 'morning' | 'afternoon' | 'available'>('full');

// Composables para la gestión del calendario
const {
  selectedDate,
  selectedDates,
  loadSlots,
  workHours,
  updateWorkHours,
  restDays,
  updateRestDays,
  loadRestDays,
  isDayDisabled,
  blockedDates,
  saveBlockedDates,
  loadBlockedDates,
  minDate,
  removeBlockedDate,
} = useCalendar();

// Días de la semana ordenados para la interfaz
const orderedDays = [
  { key: 'monday' as keyof typeof restDays.value, label: 'Lunes' },
  { key: 'tuesday' as keyof typeof restDays.value, label: 'Martes' },
  { key: 'wednesday' as keyof typeof restDays.value, label: 'Miércoles' },
  { key: 'thursday' as keyof typeof restDays.value, label: 'Jueves' },
  { key: 'friday' as keyof typeof restDays.value, label: 'Viernes' },
  { key: 'saturday' as keyof typeof restDays.value, label: 'Sábado' },
  { key: 'sunday' as keyof typeof restDays.value, label: 'Domingo' },
];

/**
 * Maneja la selección de fechas en el calendario.
 * @param {Date | Date[]} dates - Fecha o array de fechas seleccionadas.
 */
const handleDateSelection = (dates: Date | Date[]) => {
  if (Array.isArray(dates)) {
    selectedDates.value = dates.map((date) => formatDateForComparison(date));
  } else if (dates) {
    const dateStr = formatDateForComparison(dates);
    const index = selectedDates.value.indexOf(dateStr);

    if (index === -1) {
      selectedDates.value.push(dateStr);
    } else {
      selectedDates.value.splice(index, 1);
    }
  }
};

/**
 * Confirma la selección múltiple de fechas y guarda la información en la API.
 */
const confirmMultipleSelection = async () => {
  if (selectedDates.value.length > 0) {
    if (selectedBlockType.value === 'available') {
      // Si se seleccionó "Hacer disponibles", eliminamos los días bloqueados
      const blockedDatesToDelete = blockedDates.value.filter((blockedDate) =>
        selectedDates.value.includes(blockedDate.date),
      );

      const success = await deleteBlockedDates(blockedDatesToDelete);
      if (success) {
        selectedDates.value = [];
        selectedDate.value = null;
        await loadBlockedDates();
      }
      return success;
    } else {
      // Si se seleccionó otro tipo, guardamos los días bloqueados
      const blockedDatesToSave: BlockedDate[] = selectedDates.value.map((date) => ({
        date,
        blockType: selectedBlockType.value as 'full' | 'morning' | 'afternoon',
      }));

      const success = await saveBlockedDates(blockedDatesToSave);
      if (success) {
        selectedDates.value = [];
        selectedDate.value = null;
        await loadBlockedDates();
      }
      return success;
    }
  }
  return false;
};

/**
 * Limpia la selección de fechas en el calendario.
 */
const clearDateSelection = () => {
  selectedDates.value = [];
  selectedDate.value = null; // Esto limpiará la selección del DatePicker
};

/**
 * Maneja la actualización de los horarios de trabajo.
 */
const handleUpdateWorkHours = async () => {
  const success = await updateWorkHours(workHours.value);
  if (success) {
    toast.success('Horarios actualizados');
    // Recargar los slots disponibles
    await loadSlots();
  }
};

/**
 * Maneja la actualización de los días de descanso.
 */
const handleUpdateRestDays = async () => {
  await updateRestDays(restDays.value);
  toast.success('Días de descanso actualizados');
};

/**
 * Maneja la eliminación de un día bloqueado.
 * @param {BlockedDate} blockedDate - Día bloqueado a eliminar.
 */
const handleRemoveBlockedDate = async (blockedDate: BlockedDate) => {
  await removeBlockedDate(blockedDate);
};

/**
 * Propiedad computada para los marcadores de días bloqueados en el calendario.
 */
const markers = computed<DatePickerMarker[]>(() => {
  return blockedDates.value.map((blockedDate) => {
    const [day, month, year] = blockedDate.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    let color = 'red';
    if (blockedDate.blockType === 'morning') {
      color = 'yellow';
    } else if (blockedDate.blockType === 'afternoon') {
      color = 'orange';
    }

    return {
      date,
      type: 'line' as const,
      color,
      tooltip: [
        {
          text:
            blockedDate.blockType === 'full'
              ? 'Día completo bloqueado'
              : blockedDate.blockType === 'morning'
                ? 'Mañana bloqueada'
                : 'Tarde bloqueada',
          color,
        },
      ],
    };
  });
});

/**
 * Propiedad computada para ordenar los días bloqueados.
 */
const sortedBlockedDates = computed(() => {
  return [...blockedDates.value].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-').map(Number);
    const [dayB, monthB, yearB] = b.date.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime();
  });
});

/**
 * Obtiene el color de fondo según el tipo de bloqueo.
 * @param {string} blockType - Tipo de bloqueo ('full', 'morning', 'afternoon').
 */
const getBlockTypeColor = (blockType: 'full' | 'morning' | 'afternoon') => {
  switch (blockType) {
    case 'full':
      return 'bg-red-50 border-red-100 hover:bg-red-100';
    case 'morning':
      return 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100';
    case 'afternoon':
      return 'bg-orange-50 border-orange-100 hover:bg-orange-100';
  }
};

// Estado para las pestañas
const activeTab = ref('upcoming');

// Definición de las pestañas
const tabs = [
  { name: 'upcoming', label: 'Próximos' },
  { name: 'past', label: 'Pasados' },
];

/**
 * Propiedad computada para filtrar las fechas bloqueadas según la pestaña activa.
 */
const filteredBlockedDates = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return sortedBlockedDates.value.filter((blockedDate) => {
    const [day, month, year] = blockedDate.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (activeTab.value === 'upcoming') {
      return date >= today;
    } else {
      return date < today;
    }
  });
});


// Cargar datos al montar el componente
onMounted(() => {
  loadSlots();
  loadRestDays();
});
</script>
