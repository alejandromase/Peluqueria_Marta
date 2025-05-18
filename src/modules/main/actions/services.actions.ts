import { peluqueriaApi } from '@/api/peluqueriaApi';
import type { Service } from '../interfaces';

/**
 * Obtiene la lista de servicios desde la API.
 * @returns Promesa que resuelve a un array de servicios.
 * @throws Error si no se pueden obtener los servicios.
 */
export const getServicesAction = async (): Promise<Service[]> => {
  try {
    const resp = await peluqueriaApi.get<Service[]>('/services');
    return resp.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

/**
 * Añade un nuevo servicio a la API.
 * @param service Servicio a añadir (sin el ID).
 * @returns Promesa que resuelve al servicio añadido, incluyendo el ID.
 * @throws Error si no se puede añadir el servicio.
 */
export const addServiceAction = async (service: Omit<Service, 'id'>): Promise<Service> => {
  try {
    const resp = await peluqueriaApi.post<Service>('/services', service);
    return resp.data;
  } catch (error) {
    console.error('Error al añadir servicio:', error);
    throw error;
  }
};

/**
 * Elimina un servicio de la API.
 * @param id ID del servicio a eliminar.
 * @throws Error si no se puede eliminar el servicio.
 */
export const deleteServiceAction = async (id: string): Promise<void> => {
  try {
    await peluqueriaApi.delete(`/services/${id}`);
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    throw error;
  }
};