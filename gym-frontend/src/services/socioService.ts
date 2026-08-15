import { type Socio } from '../models/Socio';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const socioService = {
  getAllSocios: async (): Promise<Socio[]> => {
    const res = await fetch(`${baseUrl}/api/socios`);
    if(!res.ok) {
      throw new Error('Error al obtener socios')
    }
    return res.json();
  },
  
  createSocio: async (socio: Omit<Socio, 'id'>): Promise<Socio> => {
    const res = await fetch(`${baseUrl}/api/socios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(socio),
    })
    if (!res.ok) {
      throw new Error('Error al crear socio')
    }
    return res.json()
  },
};
