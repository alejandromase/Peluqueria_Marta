import { ref, computed } from 'vue';
import {
  updateWorkHours as updateWorkHoursApi,
  getWorkHours,
  updateRestDays,
  getRestDays,
  saveBlockedDates,
  getBlockedDates,
  deleteBlockedDates,
} from '../actions/calendar.actions';
import type { WorkHours, RestDays, BlockedDate } from '../interfaces/calendar.interface';

/**
 * Genera todas las horas disponibles en intervalos de 15 minutos
 * @param workHours Horario de trabajo
 * @returns string[] Lista de horas disponibles
 */
const generateAvailableTimes = (workHours: WorkHours) => {
  const times: string[] = [];
  // Mañana
  const [mStartH, mStartM] = workHours.morningStart.split(':').map(Number);
  const [mEndH, mEndM] = workHours.morningEnd.split(':').map(Number);
  for (let h = mStartH; h <= mEndH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === mStartH && m < mStartM) continue;
      if (h === mEndH && m > mEndM) continue;
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  // Tarde
  const [aStartH, aStartM] = workHours.afternoonStart.split(':').map(Number);
  const [aEndH, aEndM] = workHours.afternoonEnd.split(':').map(Number);
  for (let h = aStartH; h <= aEndH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === aStartH && m < aStartM) continue;
      if (h === aEndH && m > aEndM) continue;
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return times;
};

/**
 * Composable para la gestión del calendario
 * @returns object Funciones y propiedades reactivas para la gestión del calendario
 */
export function useCalendar() {
  const selectedDate = ref<string | null>(null);
  const selectedDates = ref<string[]>([]);
  const selectedTime = ref<string | null>(null);

  // Estado para horarios y días de descanso, se cargan en loadSlots
  const workHours = ref<WorkHours>({
    morningStart: '',
    morningEnd: '',
    afternoonStart: '',
    afternoonEnd: '',
  });
  const restDays = ref<RestDays>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const isLoading = ref(true);
  const error = ref(false);

  const minDate = ref<Date>(new Date());
  const blockedDates = ref<BlockedDate[]>([]);

  // Lista interna de horas generadas cada 15 minutos
  let listTimes: string[] = [];

  /**
   * Carga horarios, días de descanso y genera slots de tiempo
   * @returns Promise<void>
   */
  const loadSlots = async () => {
    isLoading.value = true;
    error.value = false;
    try {
      // Obtener configuración desde API
      const [hrs, days] = await Promise.all([getWorkHours(), getRestDays()]);
      if (hrs) workHours.value = hrs;
      if (days) restDays.value = days;

      // Generar slots según horario cargado
      listTimes = generateAvailableTimes(workHours.value);
    } catch (e) {
      console.error('Error cargando horarios y días de descanso:', e);
      error.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Carga los días de descanso
   * @returns Promise<void>
   */
  const loadRestDays = async () => {
    try {
      const days = await getRestDays();
      if (days) restDays.value = days;
    } catch (e) {
      console.error('Error al cargar días de descanso:', e);
    }
  };

  /**
   * Propiedad computada para obtener la lista de horas disponibles
   * @returns string[] Lista de horas disponibles
   */
  const availableTimes = computed(() => listTimes);

  /**
   * Selecciona una hora
   * @param time Hora seleccionada
   * @returns void
   */
  const selectTime = (time: string) => {
    selectedTime.value = time;
  };

  /**
   * Confirma la selección de fecha y hora
   * @returns object Fecha y hora seleccionadas
   */
  const confirmSelection = () => {
    if (selectedDate.value && selectedTime.value) {
      const date = new Date(selectedDate.value).toISOString().split('T')[0];
      localStorage.setItem('selectedDateTime', JSON.stringify({ date, time: selectedTime.value }));
      return { date, time: selectedTime.value };
    }
    return null;
  };

  /**
   * Actualiza los horarios de trabajo
   * @param newHours Nuevo horario de trabajo
   * @returns Promise<boolean> Indica si la operación fue exitosa
   */
  const updateWorkHours = async (newHours: WorkHours) => {
    try {
      const ok = await updateWorkHoursApi(newHours);
      if (ok) {
        workHours.value = newHours;
        listTimes = generateAvailableTimes(newHours);
      }
      return ok;
    } catch (e) {
      console.error('Error actualizando horarios:', e);
      return false;
    }
  };

  /**
   * Actualiza los días de descanso
   * @param newRest Nuevos días de descanso
   * @returns Promise<boolean> Indica si la operación fue exitosa
   */
  const updateRestDaysState = async (newRest: RestDays) => {
    try {
      const ok = await updateRestDays(newRest);
      if (ok) restDays.value = newRest;
      return ok;
    } catch (e) {
      console.error('Error actualizando días de descanso:', e);
      return false;
    }
  };

  /**
   * Verifica si una fecha está deshabilitada basado en los días de descanso
   * @param date Fecha a verificar
   * @returns boolean Indica si la fecha está deshabilitada
   */
  const isDayDisabled = (date: Date) => {
    const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return restDays.value[names[date.getDay()] as keyof RestDays];
  };

  /**
   * Guarda los días bloqueados
   * @param dates Lista de fechas bloqueadas
   * @returns Promise<boolean> Indica si la operación fue exitosa
   */
  const saveBlockedDatesState = async (dates: BlockedDate[]) => {
    try {
      const ok = await saveBlockedDates(dates);
      if (ok) await loadBlockedDates();
      return ok;
    } catch (e) {
      console.error('Error guardando días bloqueados:', e);
      return false;
    }
  };

  /**
   * Carga los días bloqueados
   * @returns Promise<void>
   */
  const loadBlockedDates = async () => {
    try {
      blockedDates.value = await getBlockedDates();
    } catch (e) {
      console.error('Error al cargar días bloqueados:', e);
    }
  };

  /**
   * Elimina un día bloqueado
   * @param bd Día bloqueado a eliminar
   * @returns Promise<void>
   */
  const removeBlockedDate = async (bd: BlockedDate) => {
    try {
      const ok = await deleteBlockedDates([bd]);
      if (ok) await loadBlockedDates();
    } catch (e) {
      console.error('Error al eliminar día bloqueado:', e);
    }
  };

  // Inicializar sólo slots y bloqueos
  loadSlots();
  loadBlockedDates();

  return {
    restDays,
    workHours,
    minDate,
    blockedDates,
    selectedDate,
    selectedDates,
    selectedTime,
    isLoading,
    error,
    availableTimes,
    selectTime,
    confirmSelection,
    loadSlots,
    updateWorkHours,
    updateRestDays: updateRestDaysState,
    loadRestDays,
    isDayDisabled,
    saveBlockedDates: saveBlockedDatesState,
    loadBlockedDates,
    removeBlockedDate,
  };
}
