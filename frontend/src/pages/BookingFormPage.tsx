import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookingCreatedResponse,
  PublicSlotResponse,
  ServiceResponse,
} from '../types/api';
import { createBooking, DOCTOR_INFO } from '../services/api';
import { formatFrenchFullDate } from '../utils/dateUtils';

export interface ConfirmedBookingDetails {
  booking: BookingCreatedResponse;
  fullName: string;
  email: string;
  reason: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingFormPageProps {
  selectedService: ServiceResponse;
  selectedDate: string;
  selectedSlot: PublicSlotResponse;
  onBookingSuccess: (details: ConfirmedBookingDetails) => void;
}

export const BookingFormPage: React.FC<BookingFormPageProps> = ({
  selectedService,
  selectedDate,
  selectedSlot,
  onBookingSuccess,
}) => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 42);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createBooking(
        {
          slotId: selectedSlot.id,
          fullName: fullName.trim(),
          email: email.trim(),
        },
        {
          serviceName: selectedService.name,
          date: selectedSlot.date || selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          reason,
        }
      );

      setSubmitDone(true);

      setTimeout(() => {
        onBookingSuccess({
          booking: response,
          fullName: fullName.trim(),
          email: email.trim(),
          reason: reason || selectedService.name,
          serviceName: response.serviceName || selectedService.name,
          date: response.date || selectedSlot.date || selectedDate,
          startTime: response.startTime || selectedSlot.startTime,
          endTime: response.endTime || selectedSlot.endTime,
        });
        navigate('/confirmation');
      }, 600);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la validation du rendez-vous.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-8 py-8 md:py-12">
        {/* Stepper horizontal d'avancement */}
        <div className="mb-10">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Étape 1 : Validée */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 font-label-md">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Étape 1
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                  Motif &amp; Créneau
                </span>
              </div>
            </div>

            <div className="hidden md:block flex-1 h-[2px] bg-secondary mx-3"></div>

            {/* Étape 2 : Active */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-label-md shadow-sm">
                <span className="font-label-lg text-label-lg font-bold">2</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                  Étape 2 • En cours
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold truncate">
                  Informations Patient &amp; Motif
                </span>
              </div>
            </div>

            <div className="hidden md:block flex-1 h-[2px] bg-surface-container-high mx-3"></div>

            {/* Étape 3 : Suivante */}
            <div className="flex items-center gap-3 w-full md:w-auto opacity-50">
              <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 font-label-md">
                <span className="font-label-lg text-label-lg font-medium">
                  3
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Étape 3
                </span>
                <span className="font-label-lg text-label-lg text-on-surface truncate">
                  Confirmation &amp; Pass Consultation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout 2 Colonnes Asymétrique (60% / 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne Principale Gauche : Formulaire (lg:col-span-7) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm flex flex-col">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm mb-3">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    health_and_safety
                  </span>
                  <span>Dossier médical &amp; Prise de rendez-vous</span>
                </div>
                <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
                  Coordonnées du patient
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Renseignez l&apos;identité du patient pour la préparation de la fiche de consultation médicale auprès du {DOCTOR_INFO.name}.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-body-md text-body-md flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px]">
                    error
                  </span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form
                className="space-y-6"
                id="booking-form"
                onSubmit={handleSubmit}
              >
                {/* Champ Nom Complet */}
                <div className="space-y-2">
                  <label
                    className="flex items-center justify-between font-label-md text-label-md text-on-surface font-semibold"
                    htmlFor="full-name"
                  >
                    <span>
                      Nom et Prénom du patient{' '}
                      <span className="text-error">*</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      Max 100 car.
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                    </div>
                    <input
                      aria-describedby="full-name-help"
                      className="w-full h-12 pl-11 pr-4 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-all"
                      id="full-name"
                      maxLength={100}
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ex. Youssef El Mansouri"
                      required
                      type="text"
                    />
                  </div>
                  <p
                    className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5 pt-0.5"
                    id="full-name-help"
                  >
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      info
                    </span>
                    <span>
                      Conforme à la carte d&apos;identité CNIE ou carnet de soins pour l&apos;enregistrement.
                    </span>
                  </p>
                </div>

                {/* Champ Email */}
                <div className="space-y-2">
                  <label
                    className="flex items-center justify-between font-label-md text-label-md text-on-surface font-semibold"
                    htmlFor="student-email"
                  >
                    <span>
                      Adresse e-mail de contact{' '}
                      <span className="text-error">*</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      Validation stricte
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        alternate_email
                      </span>
                    </div>
                    <input
                      aria-describedby="student-email-help"
                      className="w-full h-12 pl-11 pr-4 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-all"
                      id="student-email"
                      maxLength={254}
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      required
                      type="email"
                    />
                  </div>
                  <p
                    className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5 pt-0.5"
                    id="student-email-help"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      mark_email_read
                    </span>
                    <span>
                      Votre convocation médicale avec le code confidentiel y sera transmise.
                    </span>
                  </p>
                </div>

                {/* Champ Déroulant : Motif */}
                <div className="space-y-2">
                  <label
                    className="flex items-center justify-between font-label-md text-label-md text-on-surface font-semibold"
                    htmlFor="visit-reason"
                  >
                    <span>Précision sur le motif de la consultation</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                      Recommandé pour le {DOCTOR_INFO.name}
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        medical_information
                      </span>
                    </div>
                    <select
                      className="w-full h-12 pl-11 pr-10 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-sm appearance-none cursor-pointer transition-all"
                      id="visit-reason"
                      name="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <option value="">
                        Sélectionnez le motif de consultation
                      </option>
                      <option value="Consultation de routine / Bilan de santé">
                        Consultation de routine / Bilan de santé
                      </option>
                      <option value="Renouvellement d'ordonnance">
                        Renouvellement d&apos;ordonnance
                      </option>
                      <option value="Symptômes aigus (fièvre, douleurs)">
                        Symptômes aigus (fièvre, douleurs)
                      </option>
                      <option value="Certificat médical d'aptitude">
                        Certificat médical d&apos;aptitude
                      </option>
                      <option value="Suivi post-traitement">
                        Suivi post-traitement
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Encadré Sécurité sans compte & Secret Médical */}
                <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">
                      verified
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-label-lg text-label-lg text-primary font-bold">
                      Confidentialité &amp; Secret Médical
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Aucun compte requis. Un{' '}
                      <strong>code secret unique de gestion</strong> vous sera attribué pour consulter ou annuler votre rendez-vous médical avec le {DOCTOR_INFO.name} à tout instant en toute autonomie. Données protégées selon les normes de santé CNDP.
                    </p>
                  </div>
                </div>

                {/* Actions Desktop */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <Link
                    to="/prendre-rdv"
                    className="w-full sm:w-auto h-12 px-6 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                    <span>Retour aux créneaux</span>
                  </Link>
                  <button
                    className={`w-full sm:w-auto min-w-[240px] h-12 px-8 rounded-lg font-label-lg text-label-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      submitDone
                        ? 'bg-tertiary-container text-on-tertiary'
                        : 'bg-primary hover:bg-secondary text-on-primary'
                    }`}
                    id="submit-btn"
                    disabled={submitting}
                    type="submit"
                  >
                    <span className="font-semibold" id="btn-text">
                      {submitDone
                        ? 'Réservation confirmée !'
                        : submitting
                        ? 'Enregistrement du créneau...'
                        : 'Confirmer la consultation médicale'}
                    </span>
                    {!submitting && (
                      <span
                        className="material-symbols-outlined text-[20px]"
                        id="btn-icon"
                      >
                        {submitDone ? 'done' : 'arrow_forward'}
                      </span>
                    )}
                    {submitting && !submitDone && (
                      <svg
                        className="animate-spin h-5 w-5 text-on-primary"
                        fill="none"
                        id="btn-spinner"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Carte Complémentaire Démarches et Pièces requises */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  clinical_notes
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-primary font-semibold">
                  Documents médicaux à présenter au cabinet
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-normal">
                  Merci de vous munir de votre carte nationale d&apos;identité (CNIE), de votre attestation AMO / Mutuelle en cours de validité, ainsi que d&apos;éventuelles ordonnances antérieures ou derniers bilans de santé.
                </p>
              </div>
            </div>
          </section>

          {/* Colonne Droite : Récapitulatif & Timer (lg:col-span-5) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            {/* Timer Badge Flottant */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] animate-pulse">
                    timer
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Créneau réservé temporairement
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Temps restant pour valider
                  </span>
                </div>
              </div>
              <div
                className="px-3.5 py-1.5 rounded-lg bg-error text-on-error font-title-md text-title-md font-bold tracking-wider"
                id="countdown-timer"
              >
                {formatCountdown(timeLeft)}
              </div>
            </div>

            {/* Carte Récapitulatif */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between pb-5 border-b border-surface-container-high">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    event_available
                  </span>
                  <h2 className="font-title-md text-title-md text-primary font-bold">
                    Détails de la consultation
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                  En cours
                </span>
              </div>

              <div className="py-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      stethoscope
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">
                      Médecin &amp; Motif de consultation
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {DOCTOR_INFO.name}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {selectedService.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      location_on
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">
                      Lieu de consultation
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {DOCTOR_INFO.officeLocation}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {DOCTOR_INFO.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      calendar_month
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">
                      Date retenue
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {formatFrenchFullDate(selectedSlot.date || selectedDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      schedule
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline">
                      Plage horaire &amp; Durée
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-primary font-bold">
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                        30 min
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      {DOCTOR_INFO.timezone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container-high">
                <div className="p-3.5 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                    lock_clock
                  </span>
                  <div className="space-y-0.5">
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                      Garantie de réservation &amp; Ponctualité
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant leading-snug">
                      Ce créneau avec le {DOCTOR_INFO.name} est bloqué à votre nom pendant le compte à rebours. Aucun chevauchement ni double attribution n&apos;est possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance et Support Rapide */}
            <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  contact_support
                </span>
                <span className="font-label-md text-label-md">
                  Besoin d&apos;assistance ?
                </span>
              </div>
              <span className="font-label-md text-label-md text-secondary font-semibold">
                {DOCTOR_INFO.phone}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
