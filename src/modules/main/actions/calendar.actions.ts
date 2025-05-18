import type { WorkHours, RestDays, BlockedDate, DayAppointments } from '../interfaces/calendar.interface';
import { peluqueriaApi } from '@/api/peluqueriaApi';

/**
 * Actualiza los horarios de trabajo en el backend
 * @param workHours - Objeto con los horarios de mañana y tarde
 * @returns Promise<boolean> - Indica si la operación fue exitosa
 */
export const updateWorkHours = async (workHours: WorkHours): Promise<boolean> => {
  try {
    // Realiza la petición POST a la API para actualizar los horarios de trabajo
    await peluqueriaApi.post('/workday-schedules', workHours);
    return true;
  } catch (error) {
    console.error('Error en updateWorkHours:', error);
    return false;
  }
};

/**
 * Obtiene los horarios de trabajo actuales del backend
 * @returns Promise<WorkHours | null> - Los horarios actuales o null si hay error
 */
export const getWorkHours = async (): Promise<WorkHours | null> => {
  try {
    // Realiza la petición GET a la API para obtener los horarios de trabajo
    const response = await peluqueriaApi.get<WorkHours>('/workday-schedules');
    return response.data;
  } catch (error) {
    console.error('Error en getWorkHours:', error);
    return null;
  }
};

/**
 * Actualiza los días de descanso en el backend
 * @param restDays - Objeto con los días de descanso
 * @returns Promise<boolean> - Indica si la operación fue exitosa
 */
export const updateRestDays = async (restDays: RestDays): Promise<boolean> => {
  try {
    // Realiza la petición POST a la API para actualizar los días de descanso
    await peluqueriaApi.post('/weekly-config', restDays);
    return true;
  } catch (error) {
    console.error('Error en updateRestDays:', error);
    return false;
  }
};

/**
 * Obtiene los días de descanso actuales del backend
 * @returns Promise<RestDays | null> - Los días de descanso actuales o null si hay error
 */
export const getRestDays = async (): Promise<RestDays | null> => {
  try {
    // Realiza la petición GET a la API para obtener los días de descanso
    const response = await peluqueriaApi.get<RestDays>('/weekly-config');
    return response.data;
  } catch (error) {
    console.error('Error en getRestDays:', error);
    return null;
  }
};

/**
 * Guarda los días bloqueados en el backend
 * @param blockedDates - Array de fechas bloqueadas con su tipo
 * @returns Promise<boolean> - Indica si la operación fue exitosa
 */
export const saveBlockedDates = async (blockedDates: BlockedDate[]): Promise<boolean> => {
  try {
    // Realiza la petición POST a la API para guardar los días bloqueados
    await peluqueriaApi.post('/calendar/blocked', blockedDates);
    return true;
  } catch (error) {
    console.error('Error en saveBlockedDates:', error);
    return false;
  }
};

/**
 * Obtiene los días bloqueados del backend
 * @returns Promise<BlockedDate[]> - Array de fechas bloqueadas con sus IDs y tipos
 */
export const getBlockedDates = async (): Promise<BlockedDate[]> => {
  try {
    // Realiza la petición GET a la API para obtener los días bloqueados
    const response = await peluqueriaApi.get<BlockedDate[]>('/calendar/blocked');
    return response.data;
  } catch (error) {
    console.error('Error en getBlockedDates:', error);
    return [];
  }
};

/**
 * Elimina los días bloqueados del backend
 * @param blockedDates - Array de fechas bloqueadas a eliminar con su tipo
 * @returns Promise<boolean> - Indica si la operación fue exitosa
 */
export const deleteBlockedDates = async (blockedDates: BlockedDate[]): Promise<boolean> => {
  try {
    // Realiza la petición DELETE a la API para eliminar los días bloqueados
    await peluqueriaApi.delete('/calendar/blocked', { data: blockedDates });
    return true;
  } catch (error) {
    console.error('Error en deleteBlockedDates:', error);
    return false;
  }
};

/**
 * Obtiene las citas y el estado de bloqueo para un día específico
 * @param date - Fecha en formato DD-MM-YYYY
 * @returns Promise<DayAppointments | null> - Las citas del día o null si hay error
 */
export const getDayAppointments = async (date: string): Promise<DayAppointments | null> => {
  try {
    const response = await peluqueriaApi.get<DayAppointments>(`/calendar/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error en getDayAppointments:', error);
    return null;
  }
};