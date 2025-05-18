import { peluqueriaApi } from '@/api/peluqueriaApi';
import type { AppointmentResponse } from '../interfaces/appointment.interface';

// Define la estructura del payload para crear una cita
interface CreateAppointmentPayload {
  userId: string;
  date: string;
  time: string;
  serviceId: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

/**
 * Obtiene las reservas del usuario especificado
 * @param userId - ID del usuario
 * @returns Promise<AppointmentResponse[]> - Lista de reservas del usuario
 */
export const getUserAppointments = async (userId: string): Promise<AppointmentResponse[]> => {
  try {
    // Realiza la petición a la API para obtener las citas del usuario
    const response = await peluqueriaApi.get<AppointmentResponse[]>(`/appointments/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las reservas del usuario:', error);
    return [];
  }
};

/**
 * Obtiene todas las reservas de todos los usuarios
 * @returns Promise<AppointmentResponse[]> - Lista de todas las reservas
 */
export const getAllAppointments = async (): Promise<AppointmentResponse[]> => {
  try {
    // Realiza la petición a la API para obtener todas las citas
    const response = await peluqueriaApi.get<AppointmentResponse[]>('/appointments');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error);
    return [];
  }
};

/**
 * Crea una nueva reserva
 * @param payload - Datos de la reserva a crear
 * @returns Promise<AppointmentResponse> - La reserva creada
 */
export const createAppointment = async (payload: CreateAppointmentPayload): Promise<AppointmentResponse> => {
  try {
    // Realiza la petición a la API para crear una nueva cita
    const response = await peluqueriaApi.post<AppointmentResponse>('/appointments', payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    throw error;
  }
};