/**
 * Interfaz para definir los horarios de trabajo
 */
export interface WorkHours {
  afternoonStart: string;
  morningStart: string;
  morningEnd: string;
  afternoonEnd: string;
}

/**
 * Interfaz para definir los días de descanso
 */
export interface RestDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

/**
 * Interfaz para definir las fechas bloqueadas
 */
export interface BlockedDate {
  date: string;
  id?: string;
  blockType: 'full' | 'morning' | 'afternoon';
}

/**
 * Interfaz para definir las citas de un día
 */
export interface DayAppointments {
  afternoonAppointments: Array<{
    duration: number;
    time: string;
  }>;
  blockedAfternoon: boolean;
  blockedMorning: boolean;
  id: string;
  morningAppointments: Array<{
    duration: number;
    time: string;
  }>;
}