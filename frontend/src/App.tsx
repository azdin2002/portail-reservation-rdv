import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BookingLookupModal } from './components/BookingLookupModal';
import { WelcomePage } from './pages/WelcomePage';
import { SelectSlotPage } from './pages/SelectSlotPage';
import {
  BookingFormPage,
  ConfirmedBookingDetails,
} from './pages/BookingFormPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { DEFAULT_SERVICES } from './services/api';
import { PublicSlotResponse, ServiceResponse } from './types/api';

const DEFAULT_SLOT: PublicSlotResponse = {
  id: 102,
  serviceId: 1,
  serviceName: DEFAULT_SERVICES[0].name,
  date: '2026-11-18',
  startTime: '09:30',
  endTime: '10:00',
  available: true,
};

const DEFAULT_CONFIRMED: ConfirmedBookingDetails = {
  booking: {
    bookingId: 1001,
    confirmationCode: 'MED-2026-X9K4M2-8942B',
    status: 'CONFIRMED',
    serviceName: DEFAULT_SERVICES[0].name,
    date: '2026-11-18',
    startTime: '09:30',
    endTime: '10:00',
  },
  fullName: 'Youssef El Mansouri',
  email: 'youssef.elmansouri@email.com',
  reason: 'Consultation de routine / Bilan de santé',
  serviceName: DEFAULT_SERVICES[0].name,
  date: '2026-11-18',
  startTime: '09:30',
  endTime: '10:00',
};

export const App: React.FC = () => {
  const location = useLocation();

  const [selectedService, setSelectedService] = useState<ServiceResponse>(
    DEFAULT_SERVICES[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-18');
  const [selectedSlot, setSelectedSlot] = useState<PublicSlotResponse | null>(
    DEFAULT_SLOT
  );
  const [confirmedDetails, setConfirmedDetails] =
    useState<ConfirmedBookingDetails>(DEFAULT_CONFIRMED);

  const [lookupModalOpen, setLookupModalOpen] = useState(false);
  const [lookupInitialCode, setLookupInitialCode] = useState('');

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const handleOpenLookupModal = (initialCode = '') => {
    setLookupInitialCode(initialCode);
    setLookupModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Header onOpenLookupModal={handleOpenLookupModal} />

      <main className="w-full pt-20 bg-background flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <WelcomePage
                onSelectService={(srv) => setSelectedService(srv)}
                onSearchCode={(code) => handleOpenLookupModal(code)}
              />
            }
          />
          <Route
            path="/prendre-rdv"
            element={
              <SelectSlotPage
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onChangeService={(srv) => setSelectedService(srv)}
                onChangeDate={(date) => setSelectedDate(date)}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
              />
            }
          />
          <Route
            path="/coordonnees-patient"
            element={
              <BookingFormPage
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot || DEFAULT_SLOT}
                onBookingSuccess={(details) => setConfirmedDetails(details)}
              />
            }
          />
          <Route
            path="/confirmation"
            element={
              <ConfirmationPage
                confirmedDetails={confirmedDetails}
                onOpenLookupModal={handleOpenLookupModal}
              />
            }
          />
        </Routes>
      </main>

      <Footer />

      <BookingLookupModal
        isOpen={lookupModalOpen}
        initialCode={lookupInitialCode}
        onClose={() => setLookupModalOpen(false)}
      />
    </div>
  );
};

export default App;
