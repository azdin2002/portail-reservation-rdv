import React, { useState, useEffect } from 'react';
import { BookingResponse } from '../types/api';
import { lookupBooking, cancelBooking, DOCTOR_INFO } from '../services/api';
import { formatFrenchFullDate } from '../utils/dateUtils';

interface BookingLookupModalProps {
  isOpen: boolean;
  initialCode?: string;
  onClose: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  initialCode = '',
  onClose,
}) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(initialCode);
      setError(null);
      setBooking(null);
      if (initialCode.trim().length >= 4) {
        handleLookup(initialCode.trim());
      }
    }
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  const handleLookup = async (codeToSearch: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await lookupBooking({ confirmationCode: codeToSearch });
      setBooking(res);
    } catch (err) {
      setBooking(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de retrouver cette consultation médicale.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    handleLookup(code.trim());
  };

  const handleCancelBooking = async () => {
    if (!code.trim()) return;
    setCancelling(true);
    setError(null);
    try {
      const updated = await cancelBooking({ confirmationCode: code.trim() });
      setBooking(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de l’annulation du rendez-vous.'
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">
              manage_search
            </span>
          </div>
          <div>
            <h2 className="font-title-md text-title-md text-primary font-bold">
              Consulter ou annuler mon rendez-vous
            </h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {DOCTOR_INFO.cabinetName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="modal-booking-code"
              className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5"
            >
              Code confidentiel de confirmation
            </label>
            <div className="flex gap-2">
              <input
                id="modal-booking-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: MED-2026-X9K4M2-8942B"
                className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-mono font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 px-5 rounded-xl bg-primary hover:bg-secondary text-on-primary font-label-md text-label-md transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  search
                </span>
                <span>{loading ? 'Recherche...' : 'Rechercher'}</span>
              </button>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1.5">
              Astuce démo : essayez le code <code className="font-mono text-primary font-semibold">MED-2026-X9K4M2-8942B</code> ou le code reçu après réservation.
            </p>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-error-container text-on-error-container font-body-md text-body-md flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {booking && (
          <div className="mt-6 p-5 rounded-xl bg-surface-container-low space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Dossier RDV #{booking.bookingId}
                </span>
                <h3 className="font-title-md text-title-md text-primary font-bold">
                  {DOCTOR_INFO.name}
                </h3>
              </div>
              <span
                className={
                  booking.status === 'CONFIRMED'
                    ? 'px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold'
                    : 'px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold'
                }
              >
                {booking.status === 'CONFIRMED' ? 'CONFIRMÉ' : 'ANNULÉ'}
              </span>
            </div>

            <div className="space-y-2 font-body-md text-body-md">
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Motif / Service :</span>
                <span className="font-semibold text-on-surface text-right">
                  {booking.serviceName}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Date :</span>
                <span className="font-semibold text-on-surface">
                  {formatFrenchFullDate(booking.date)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Horaire :</span>
                <span className="font-semibold text-secondary">
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
            </div>

            {booking.status === 'CONFIRMED' && (
              <div className="pt-3 border-t border-surface-container-high flex justify-end">
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelBooking}
                  className="h-10 px-4 rounded-lg bg-error text-on-error hover:opacity-90 font-label-md text-label-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    cancel
                  </span>
                  <span>
                    {cancelling
                      ? 'Annulation en cours...'
                      : 'Annuler ce rendez-vous'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
