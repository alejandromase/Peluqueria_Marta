/**
 * Interfaz para representar la respuesta de una cita.
 */
export interface AppointmentResponse {
  id: string;
  date: string;
  userPhone: string;
  userEmail: string;
  time: string;
  serviceName: string;
  userName: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}