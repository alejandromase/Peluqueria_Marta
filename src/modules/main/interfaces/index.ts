import type {User} from "@/modules/auth/interfaces/user.interface"
// Definición de tipos compartidos

/**
 * Interfaz para representar un servicio.
 */
export interface Service {
  id: string;
  description: string;
  duration: number;
}

/**
 * Interfaz para representar una reserva.
 */
export interface Reservation {
  id: number;
  user?: User;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}