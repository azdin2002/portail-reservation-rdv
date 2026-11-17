// Types générés directement depuis openapi.yaml

export interface ServiceResponse {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
}

export interface PublicSlotResponse {
  id: number;
  serviceId: number;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
}

export interface BookingCreateRequest {
  slotId: number;
  fullName: string;
  email: string;
}

export interface BookingCreatedResponse {
  bookingId: number;
  confirmationCode: string;
  status: 'CONFIRMED';
  serviceName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface BookingCodeRequest {
  confirmationCode: string;
}

export interface BookingResponse {
  bookingId: number;
  status: 'CONFIRMED' | 'CANCELLED';
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Métadonnées d'affichage enrichies pour le cabinet médical individuel (Dr. Sofia Benjelloun)
export interface DoctorServiceMetadata {
  id: number;
  icon: string;
  badgeText: string;
  badgeVariant: 'secondary' | 'tertiary';
  bullets: string[];
  roomInfo: string;
}
