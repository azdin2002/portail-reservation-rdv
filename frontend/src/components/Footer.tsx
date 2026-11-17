import React from 'react';
import { DOCTOR_INFO } from '../services/api';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[20px]">
                  stethoscope
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-primary font-bold">
                  {DOCTOR_INFO.cabinetName}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {DOCTOR_INFO.title} • Larache
                </span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Cabinet médical individuel du {DOCTOR_INFO.name}, médecin généraliste à Larache. Plateforme sécurisée de prise de rendez-vous en ligne pour vos consultations médicales, bilans de santé et suivis réguliers.
            </p>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">
                pin_drop
              </span>
              <span>{DOCTOR_INFO.address}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-title-md text-title-md text-primary font-semibold">
              Horaires du Cabinet
            </h3>
            <ul className="space-y-2.5 font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-start justify-between">
                <span className="font-medium">Lundi - Vendredi :</span>
                <span>{DOCTOR_INFO.hoursWeekdays}</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="font-medium">Samedi :</span>
                <span>{DOCTOR_INFO.hoursSaturday}</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="font-medium">Dimanche :</span>
                <span className="text-error font-medium">Cabinet fermé</span>
              </li>
            </ul>
            <div className="p-3 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                info
              </span>
              <span>
                Présentez-vous 10 min avant l&apos;horaire avec votre carnet de santé ou CNIE.
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-title-md text-title-md text-primary font-semibold">
              Motifs de Consultation
            </h3>
            <ul className="space-y-2.5 font-body-md text-body-md">
              <li className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span>Consultation de Médecine Générale</span>
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span>Bilan de Santé Préventif &amp; Check-up</span>
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span>Suivi des Maladies Chroniques</span>
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span>Renouvellement d&apos;Ordonnance</span>
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span>Certificats Médicaux &amp; Aptitude</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-title-md text-title-md text-primary font-semibold">
              Conformité &amp; Secret Médical
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Dossier médical patient hautement sécurisé, strictement soumis au secret professionnel médical du {DOCTOR_INFO.name}, aux normes CNDP (Loi 09-08) et au Code de déontologie médicale.
            </p>
            <div className="flex flex-col gap-2 font-label-md text-label-md text-on-surface-variant">
              <span className="hover:text-primary transition-colors cursor-pointer">
                Charte des Droits du Patient
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Secret Médical &amp; Confidentialité CNDP
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Convention AMO &amp; Organismes Mutuelles
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-4 border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-on-surface-variant">
          <p>
            Copyright © 2026 {DOCTOR_INFO.cabinetName} — Larache. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span>Portail Santé Homologué CNDP</span>
            <span>•</span>
            <span>Version 2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
