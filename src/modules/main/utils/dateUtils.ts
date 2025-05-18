/**
 * Formatea una fecha para comparación en formato DD-MM-YYYY
 * @param date Fecha a formatear
 * @returns Fecha en formato DD-MM-YYYY
 */
export const formatDateForComparison = (date: Date): string => {
  // Obtiene día, mes y año y los formatea con ceros a la izquierda si es necesario
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Formatea una fecha en español con formato completo
 * @param dateStr Fecha en formato DD-MM-YYYY
 * @returns Fecha formateada en español (ej: lunes, 1 de enero de 2024)
 */
export const formatDate = (dateStr: string): string => {
  // Divide la fecha y crea un objeto Date
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Utilidad para transformar YYYY-MM-DD a DD-MM-YYYY
 * @param dateStr Fecha en formato YYYY-MM-DD
 * @returns Fecha en formato DD-MM-YYYY
 */
export const formatToDDMMYYYY = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
};

/**
 * Convierte una hora en formato string a minutos
 * @param time Hora en formato HH:mm
 * @returns Número total de minutos
 */
export const timeToMinutes = (time: string): number => {
  // Separa horas y minutos y los convierte a minutos totales
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Verifica si una hora es válida considerando la duración del servicio
 * @param time Hora de inicio en formato HH:mm
 * @param endTime Hora de fin en formato HH:mm
 * @param serviceDuration Duración del servicio en minutos
 * @returns true si la hora es válida, false en caso contrario
 */
export const isTimeValid = (time: string, endTime: string, serviceDuration: number): boolean => {
  // Calcula los minutos totales de inicio, fin y fin del servicio
  const [startHour, startMinute] = time.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const serviceEndMinutes = startTotalMinutes + serviceDuration;

  return serviceEndMinutes <= endTotalMinutes;
};
