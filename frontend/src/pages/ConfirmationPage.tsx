import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmedBookingDetails } from './BookingFormPage';
import { DOCTOR_INFO } from '../services/api';
import { formatFrenchFullDate } from '../utils/dateUtils';

interface ConfirmationPageProps {
  confirmedDetails: ConfirmedBookingDetails;
  onOpenLookupModal: (code?: string) => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  confirmedDetails,
  onOpenLookupModal,
}) => {
  const [copied, setCopied] = useState(false);

  const code = confirmedDetails.booking.confirmationCode;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden pb-20 pt-8">
        <div className="absolute -top-40 right-1/2 translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-secondary/10 via-surface-container-highest/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-[960px] mx-auto px-6 w-full relative z-10 space-y-8">
          {/* Stepper Horizontal — Étape 3 Confirmée */}
          <div className="bg-surface-container-lowest shadow-md rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Étape 1
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Motif &amp; Créneau
                </span>
              </div>
            </div>

            <div className="hidden md:block h-0.5 flex-1 mx-4 bg-tertiary-fixed-dim/60"></div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Étape 2
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Coordonnées Patient
                </span>
              </div>
            </div>

            <div className="hidden md:block h-0.5 flex-1 mx-4 bg-tertiary-fixed-dim/60"></div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center shadow-sm ring-4 ring-tertiary-fixed/30">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  done_all
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-tertiary-container font-bold uppercase tracking-wider">
                  Étape 3
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  Consultation confirmée
                </span>
              </div>
            </div>
          </div>

          {/* Carte Principale Pass Consultation */}
          <div className="bg-surface-container-lowest shadow-xl rounded-xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-tertiary-container via-secondary to-primary"></div>

            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full bg-tertiary-fixed/20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-tertiary-fixed-dim/30 animate-ping opacity-60"></div>
                <div className="w-20 h-20 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                  <span
                    className="material-symbols-outlined text-[48px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-fixed/25 text-tertiary-container font-label-md text-label-md mb-4 font-semibold">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
              <span>Dossier patient pré-enregistré • Rendez-vous validé</span>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-3">
              Consultation médicale confirmée avec succès !
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Votre rendez-vous avec le{' '}
              <strong className="text-on-surface font-semibold">
                {DOCTOR_INFO.name}
              </strong>{' '}
              ({confirmedDetails.serviceName}) a bien été enregistré dans le planning du cabinet médical.
            </p>

            <div className="mt-10 p-8 rounded-xl bg-surface-container-low shadow-sm max-w-2xl mx-auto text-left relative">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">
                    verified
                  </span>
                  VOTRE PASS CONSULTATION MÉDICALE
                </span>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-secondary/10 text-secondary font-medium">
                  Code Confidentiel
                </span>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center sm:items-start">
                  <span
                    className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg font-bold tracking-[0.15em] text-primary select-all font-mono"
                    id="bookingCode"
                  >
                    {code}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    À présenter sur écran ou justificatif à l&apos;accueil du cabinet
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="h-12 px-6 rounded-lg bg-primary hover:bg-secondary text-on-primary transition-all flex items-center gap-2 font-label-md text-label-md shadow-md active:scale-95 shrink-0 cursor-pointer"
                  id="copyBtn"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    id="copyIcon"
                  >
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span id="copyText">
                    {copied ? 'Copié !' : 'Copier le code'}
                  </span>
                </button>
              </div>

              <div className="mt-5 p-4 rounded-lg bg-surface-container-highest/60 flex items-start gap-3.5">
                <span className="material-symbols-outlined text-error text-[24px] shrink-0 mt-0.5">
                  warning
                </span>
                <div className="space-y-1">
                  <p className="font-label-md text-label-md text-on-surface font-bold">
                    ATTENTION : Conservez précieusement ce code de consultation.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Il est affiché une seule fois et vous servira lors de votre arrivée au cabinet du {DOCTOR_INFO.name} ainsi que pour consulter ou annuler votre rendez-vous si nécessaire.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grille 2 colonnes : Détails & Consignes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-container">
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">
                      clinical_notes
                    </span>
                  </div>
                  <div>
                    <h2 className="font-title-md text-title-md text-primary font-bold">
                      Détails de la consultation
                    </h2>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Récapitulatif de votre rendez-vous médical
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between py-2 border-b border-surface-container-low">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        event
                      </span>
                      Date prévue
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold text-right">
                      {formatFrenchFullDate(confirmedDetails.date)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2 border-b border-surface-container-low">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        schedule
                      </span>
                      Heure de consultation
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {confirmedDetails.startTime} – {confirmedDetails.endTime}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2 border-b border-surface-container-low">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        person
                      </span>
                      Médecin traitant
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {DOCTOR_INFO.name}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2 border-b border-surface-container-low">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        meeting_room
                      </span>
                      Lieu d&apos;examen
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold font-label-md text-label-md">
                        Cabinet de Consultation
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        (Rez-de-chaussée)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between py-2 border-b border-surface-container-low">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        badge
                      </span>
                      Patient bénéficiaire
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {confirmedDetails.fullName}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        alternate_email
                      </span>
                      Email déclaré
                    </span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      {confirmedDetails.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-tertiary-container">
                  verified_user
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Signature cryptographique {DOCTOR_INFO.cabinetName} • GMT+1
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-container">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">
                      health_and_safety
                    </span>
                  </div>
                  <div>
                    <h2 className="font-title-md text-title-md text-primary font-bold">
                      Consignes pour la Visite
                    </h2>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Modalités d&apos;accueil au cabinet du {DOCTOR_INFO.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-container-low">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">
                        timer
                      </span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">
                        Arrivée 10 min avant l&apos;horaire
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Présentez-vous au secrétariat du cabinet pour la préparation de votre dossier médical.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-container-low">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">
                        credit_card
                      </span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">
                        Pièce d&apos;identité &amp; Carte AMO / CNSS
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Obligatoires pour la prise en charge et l&apos;établissement de la feuille de soins.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-container-low">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">
                        folder_shared
                      </span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">
                        Dossier médical &amp; Ordonnances
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Munissez-vous de vos derniers bilans sanguins, examens ou traitements en cours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  pin_drop
                </span>
                <span>{DOCTOR_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Barre d'actions inférieure */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-md flex flex-col lg:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full lg:w-auto h-12 px-6 rounded-lg bg-primary text-on-primary hover:bg-secondary transition-all flex items-center justify-center gap-2.5 font-label-lg text-label-lg shadow-sm cursor-pointer order-1 lg:order-none"
            >
              <span className="material-symbols-outlined text-[20px]">
                print
              </span>
              <span>Télécharger la convocation médicale / Imprimer</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => onOpenLookupModal(code)}
                className="w-full sm:w-auto h-12 px-5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary transition-all flex items-center justify-center gap-2 font-label-lg text-label-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
                <span>Gérer / Annuler ma consultation</span>
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto h-12 px-5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2 font-label-lg text-label-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  home
                </span>
                <span>Retour à l&apos;accueil du cabinet</span>
              </Link>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Besoin d&apos;aide ? Contactez le secrétariat du {DOCTOR_INFO.name} au{' '}
              <strong className="text-on-surface">{DOCTOR_INFO.phone}</strong> ou écrivez à{' '}
              <span className="text-secondary font-medium">
                {DOCTOR_INFO.email}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification Copie */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 font-label-md text-label-md transition-opacity duration-300 ${
          copied ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        id="toast"
      >
        <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
          check_circle
        </span>
        <span>Code de confirmation copié dans le presse-papiers !</span>
      </div>
    </div>
  );
};
