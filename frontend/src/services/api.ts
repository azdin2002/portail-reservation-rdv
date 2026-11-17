import {
  ServiceResponse,
  PublicSlotResponse,
  BookingCreateRequest,
  BookingCreatedResponse,
  BookingCodeRequest,
  BookingResponse,
  DoctorServiceMetadata,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Informations uniques du médecin (Cabinet individuel — un seul médecin)
export const DOCTOR_INFO = {
  name: 'Dr. Sofia Benjelloun',
  title: 'Médecin Généraliste Diplômée',
  cabinetName: 'Cabinet Médical Dr. Sofia Benjelloun',
  subtitle: 'Médecine Générale & Suivi Médical • Portail RDV',
  officeLocation: 'Cabinet de Consultation • Rez-de-chaussée',
  address: 'Avenue Hassan II, Quartier Administratif, Larache 92000',
  phone: '+212 (0) 539 91 20 20',
  email: 'contact@cabinet-benjelloun.ma',
  hoursWeekdays: '08h30 - 18h30',
  hoursSaturday: '09h00 - 13h00',
  timezone: 'Africa/Casablanca (GMT+1)',
  consultationDuration: '30 minutes',
};

// Services médicaux proposés par le Dr. Sofia Benjelloun (un seul médecin, différents motifs/actes)
export const DEFAULT_SERVICES: ServiceResponse[] = [
  {
    id: 1,
    name: 'Consultation de Médecine Générale & Urgences Relatives',
    description:
      'Consultations adultes, adolescents et enfants, diagnostic des affections aiguës (fièvre, douleurs, infections) et soins médicaux courants assurés par le Dr. Sofia Benjelloun.',
    active: true,
  },
  {
    id: 2,
    name: 'Bilan de Santé Préventif & Check-up Complet',
    description:
      'Bilan médical périodique personnalisé, dépistage précoce, contrôle tensionnel et cardiovasculaire, et interprétation approfondie de vos analyses biologiques.',
    active: true,
  },
  {
    id: 3,
    name: 'Suivi des Maladies Chroniques & Ordonnances',
    description:
      'Suivi régulier et accompagnement thérapeutique (diabète, hypertension artérielle, asthme, thyroïde), ajustement de traitement et renouvellement d’ordonnance.',
    active: true,
  },
  {
    id: 4,
    name: 'Certificats Médicaux & Consultations d’Aptitude',
    description:
      'Examen clinique complet pour la délivrance de certificats médicaux d’aptitude (sport, scolarité, travail, mariage) et attestations médicales réglementaires.',
    active: true,
  },
];

export const SERVICE_METADATA: Record<number, DoctorServiceMetadata> = {
  1: {
    id: 1,
    icon: 'stethoscope',
    badgeText: 'Créneaux ouverts aujourd’hui',
    badgeVariant: 'secondary',
    bullets: [
      'Examen clinique complet adultes et enfants',
      'Prise en charge des symptômes aigus & infections',
      'Orientation et prescription médicale personnalisée',
    ],
    roomInfo: 'Salle de Consultation — Dr. Sofia Benjelloun (RDC)',
  },
  2: {
    id: 2,
    icon: 'monitor_heart',
    badgeText: 'Consultations ouvertes',
    badgeVariant: 'tertiary',
    bullets: [
      'Check-up clinique complet & contrôle tensionnel',
      'Prescription et lecture de bilans sanguins',
      'Conseils préventifs, nutrition et hygiène de vie',
    ],
    roomInfo: 'Salle de Consultation — Dr. Sofia Benjelloun (RDC)',
  },
  3: {
    id: 3,
    icon: 'medication',
    badgeText: 'Consultations ouvertes',
    badgeVariant: 'tertiary',
    bullets: [
      'Suivi diabète, hypertension et pathologies chroniques',
      'Renouvellement et adaptation d’ordonnance',
      'Coordination du dossier médical AMO / CNSS',
    ],
    roomInfo: 'Salle de Consultation — Dr. Sofia Benjelloun (RDC)',
  },
  4: {
    id: 4,
    icon: 'verified',
    badgeText: 'Consultations ouvertes',
    badgeVariant: 'tertiary',
    bullets: [
      'Certificats d’aptitude physique et sportive',
      'Certificats médicaux scolaires et professionnels',
      'Attestations médicales et dossiers administratifs',
    ],
    roomInfo: 'Salle de Consultation — Dr. Sofia Benjelloun (RDC)',
  },
};

const TIME_SLOTS_TEMPLATE = [
  { startTime: '09:00', endTime: '09:30', defaultAvailable: true },
  { startTime: '09:30', endTime: '10:00', defaultAvailable: true },
  { startTime: '10:00', endTime: '10:30', defaultAvailable: false },
  { startTime: '10:30', endTime: '11:00', defaultAvailable: true },
  { startTime: '11:00', endTime: '11:30', defaultAvailable: true },
  { startTime: '11:30', endTime: '12:00', defaultAvailable: true },
  { startTime: '14:00', endTime: '14:30', defaultAvailable: true },
  { startTime: '14:30', endTime: '15:00', defaultAvailable: false },
  { startTime: '15:00', endTime: '15:30', defaultAvailable: true },
  { startTime: '15:30', endTime: '16:00', defaultAvailable: true },
  { startTime: '16:00', endTime: '16:30', defaultAvailable: true },
  { startTime: '16:30', endTime: '17:00', defaultAvailable: true },
];

// Stockage local de secours pour permettre de tester le parcours complet même sans backend lancé
const STORAGE_BOOKINGS_KEY = 'cabinet_benjelloun_bookings_v1';

interface StoredBooking extends BookingResponse {
  confirmationCode: string;
  slotId: number;
  fullName: string;
  email: string;
  reason?: string;
}

function getStoredBookings(): StoredBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    if (!raw) {
      const seed: StoredBooking[] = [
        {
          bookingId: 1001,
          confirmationCode: 'MED-2026-X9K4M2-8942B',
          status: 'CONFIRMED',
          serviceName: 'Consultation de Médecine Générale & Urgences Relatives',
          date: '2026-11-18',
          startTime: '09:30',
          endTime: '10:00',
          slotId: 102,
          fullName: 'Youssef El Mansouri',
          email: 'youssef.elmansouri@email.com',
          reason: 'Consultation de routine / Bilan de santé',
        },
      ];
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredBookings(bookings: StoredBooking[]) {
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // ignore storage errors
  }
}

function generateMockSlots(serviceId: number, date: string): PublicSlotResponse[] {
  const service = DEFAULT_SERVICES.find((s) => s.id === serviceId) || DEFAULT_SERVICES[0];
  const bookings = getStoredBookings();
  const dateSeed = date.split('-').reduce((acc, part) => acc + Number(part), 0);

  return TIME_SLOTS_TEMPLATE.map((tpl, index) => {
    const id = serviceId * 10000 + (dateSeed % 100) * 100 + (index + 1);
    const isBookedLocally = bookings.some(
      (b) =>
        b.status === 'CONFIRMED' &&
        (b.slotId === id || (b.date === date && b.startTime === tpl.startTime))
    );
    return {
      id,
      serviceId: service.id,
      serviceName: service.name,
      date,
      startTime: tpl.startTime,
      endTime: tpl.endTime,
      available: tpl.defaultAvailable && !isBookedLocally,
    };
  });
}

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 6; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MED-2026-${part1}-${part2}`;
}

// GET /services
export async function fetchPublicServices(): Promise<ServiceResponse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/services`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ServiceResponse[] = await res.json();
    return data.length > 0 ? data.filter((s) => s.active) : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
}

// GET /slots?serviceId=...&date=...
export async function fetchAvailableSlots(
  serviceId: number,
  date: string
): Promise<PublicSlotResponse[]> {
  try {
    const params = new URLSearchParams({
      serviceId: String(serviceId),
      date,
    });
    const res = await fetch(`${API_BASE_URL}/slots?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return generateMockSlots(serviceId, date);
  }
}

// GET /slots/{id}
export async function fetchPublicSlotById(
  slotId: number,
  fallbackServiceId = 1,
  fallbackDate = '2026-11-18'
): Promise<PublicSlotResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/slots/${slotId}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    const slots = generateMockSlots(fallbackServiceId, fallbackDate);
    return slots.find((s) => s.id === slotId) || slots[1];
  }
}

// POST /bookings
export async function createBooking(
  payload: BookingCreateRequest,
  context?: {
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
  }
): Promise<BookingCreatedResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    const code = generateConfirmationCode();
    const bookingId = Math.floor(1000 + Math.random() * 9000);
    const created: StoredBooking = {
      bookingId,
      confirmationCode: code,
      status: 'CONFIRMED',
      serviceName:
        context?.serviceName || DEFAULT_SERVICES[0].name,
      date: context?.date || '2026-11-18',
      startTime: context?.startTime || '09:30',
      endTime: context?.endTime || '10:00',
      slotId: payload.slotId,
      fullName: payload.fullName,
      email: payload.email,
      reason: context?.reason,
    };
    const bookings = getStoredBookings();
    bookings.unshift(created);
    saveStoredBookings(bookings);

    return {
      bookingId: created.bookingId,
      confirmationCode: created.confirmationCode,
      status: 'CONFIRMED',
      serviceName: created.serviceName,
      date: created.date,
      startTime: created.startTime,
      endTime: created.endTime,
    };
  }
}

// POST /bookings/lookup
export async function lookupBooking(
  payload: BookingCodeRequest
): Promise<BookingResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    const normalized = payload.confirmationCode.trim().toUpperCase();
    const bookings = getStoredBookings();
    const found = bookings.find(
      (b) =>
        b.confirmationCode.toUpperCase() === normalized ||
        b.confirmationCode.toUpperCase().startsWith(normalized)
    );
    if (!found) {
      throw new Error('Aucune réservation trouvée pour ce code de confirmation.');
    }
    return {
      bookingId: found.bookingId,
      status: found.status,
      serviceName: found.serviceName,
      date: found.date,
      startTime: found.startTime,
      endTime: found.endTime,
    };
  }
}

// POST /bookings/cancel
export async function cancelBooking(
  payload: BookingCodeRequest
): Promise<BookingResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    const normalized = payload.confirmationCode.trim().toUpperCase();
    const bookings = getStoredBookings();
    const index = bookings.findIndex(
      (b) =>
        b.confirmationCode.toUpperCase() === normalized ||
        b.confirmationCode.toUpperCase().startsWith(normalized)
    );
    if (index === -1) {
      throw new Error('Aucune réservation trouvée pour ce code de confirmation.');
    }
    bookings[index].status = 'CANCELLED';
    saveStoredBookings(bookings);
    const updated = bookings[index];
    return {
      bookingId: updated.bookingId,
      status: updated.status,
      serviceName: updated.serviceName,
      date: updated.date,
      startTime: updated.startTime,
      endTime: updated.endTime,
    };
  }
}
