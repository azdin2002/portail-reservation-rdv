import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceResponse } from '../types/api';
import {
  DOCTOR_INFO,
  DEFAULT_SERVICES,
  SERVICE_METADATA,
  fetchPublicServices,
} from '../services/api';

interface WelcomePageProps {
  onSelectService: (service: ServiceResponse) => void;
  onSearchCode: (code: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onSelectService,
  onSearchCode,
}) => {
  const [services, setServices] = useState<ServiceResponse[]>(DEFAULT_SERVICES);
  const [lookupInput, setLookupInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetchPublicServices().then((data) => {
      if (mounted && data.length > 0) {
        setServices(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleServiceChoose = (service: ServiceResponse) => {
    onSelectService(service);
    navigate(`/prendre-rdv?serviceId=${service.id}`);
  };

  const handleQuickLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchCode(lookupInput.trim());
  };

  return (
    <div className="flex flex-col w-full">
      {/* INSTITUTIONAL HERO SECTION — CABINET MÉDICAL INDIVIDUEL */}
      <section className="relative w-full bg-surface overflow-hidden py-14 lg:py-20">
        <div className="absolute -top-32 right-0 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-secondary/10 via-surface-container to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] rounded-full bg-tertiary-fixed/15 blur-3xl pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
                <span>
                  {DOCTOR_INFO.name} • {DOCTOR_INFO.title} Conventionnée
                </span>
              </div>
              <div className="space-y-4 max-w-xl">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight leading-tight">
                  Prenez votre rendez-vous au cabinet du {DOCTOR_INFO.name}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Consultez en temps réel les créneaux disponibles de votre médecin généraliste à Larache. Planifiez votre consultation individuelle sans attente en salle d&apos;attente.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/prendre-rdv"
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-secondary transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_month
                  </span>
                  <span>Prendre un rendez-vous médical</span>
                </Link>
                <a
                  href="#recherche-reservation"
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    manage_search
                  </span>
                  <span>Consulter ou annuler mon RDV</span>
                </a>
              </div>
              <div className="pt-2 flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
                <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[16px]">
                    health_and_safety
                  </span>
                </div>
                <span>
                  Prise en charge AMO / CNSS • Suivi personnalisé par le {DOCTOR_INFO.name}
                </span>
              </div>
            </div>

            {/* Right: Doctor Visual Bento */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-surface-container-lowest p-3 shadow-xl">
                <div className="relative w-full h-[360px] rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Cabinet médical du Dr. Sofia Benjelloun à Larache"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVUv-dAPdafr43l9-iRsa9giqB0iUJ_v7MiseuTYZcW808JcDb-3Ksk5GkNy3_T--cDWDh9vutmc87nNGYZo_jWa_SaP85S95vRLTwfTAMKyn40I0K9y_VkeolDTDK-wu2RZICqm0I7bpCgLXaeKUwSM0pPqP1Uxq1VhATy1R3arYHNblM38eTBCFkuWsgaqpKV86Q6ybzpTlqfSq7WHqgNQ3-SDdn0KYf1vcSN1E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[22px]">
                          timer
                        </span>
                      </div>
                      <div>
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">
                          Temps d&apos;attente estimé
                        </span>
                        <span className="block font-title-md text-title-md text-primary font-bold">
                          5 à 10 minutes
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-on-tertiary-container font-label-sm text-label-sm font-semibold bg-surface-container-high px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">
                        verified
                      </span>{' '}
                      Horaire garanti
                    </span>
                  </div>
                </div>
                <div className="-mt-4 -ml-4 absolute top-4 left-4 px-3.5 py-2 rounded-xl bg-primary text-on-primary shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    stethoscope
                  </span>
                  <span className="font-label-sm text-label-sm">
                    {DOCTOR_INFO.name} • Médecine Générale
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH INTERACTIVE MODULE */}
      <section className="w-full -mt-6 relative z-20" id="recherche-reservation">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[26px]">
                    medical_information
                  </span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-primary font-bold">
                    Déjà un rendez-vous au cabinet ?
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Retrouvez votre consultation avec le {DOCTOR_INFO.name} ou annulez votre créneau avec votre code de confirmation.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-7">
                <form
                  className="flex flex-col sm:flex-row items-center gap-3"
                  onSubmit={handleQuickLookupSubmit}
                >
                  <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      pin
                    </span>
                    <input
                      value={lookupInput}
                      onChange={(e) => setLookupInput(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all placeholder:text-outline"
                      placeholder="Ex: MED-2026-X9K4M2-8942B..."
                      type="text"
                    />
                  </div>
                  <button
                    className="w-full sm:w-auto shrink-0 h-12 px-6 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      search
                    </span>
                    <span>Retrouver ma consultation</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 HORIZONTAL COLUMNS) */}
      <section className="w-full py-20 lg:py-24 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <div className="flex items-center gap-2 text-secondary font-label-md text-label-md mb-2">
                <span className="material-symbols-outlined text-[16px]">
                  flowsheet
                </span>
                <span>PROCÉDURE MÉDICALE SIMPLIFIÉE</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                Comment ça marche ?
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Trois étapes rapides pour réserver votre consultation auprès du {DOCTOR_INFO.name} sans attente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="relative rounded-2xl bg-surface-container-lowest p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      clinical_notes
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md font-bold text-surface-container-highest">
                    01
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-3">
                  Choisir le motif de consultation
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Sélectionnez le motif de votre visite (Consultation générale, Bilan de santé, Suivi chronique ou Certificat médical) au cabinet du {DOCTOR_INFO.name}.
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center gap-2 text-secondary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  touch_app
                </span>
                <span>Sélection immédiate</span>
              </div>
            </div>

            <div className="relative rounded-2xl bg-surface-container-lowest p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]">
                      calendar_today
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md font-bold text-surface-container-highest">
                    02
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-3">
                  Sélectionner un créneau libre
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Choisissez la date et l&apos;heure de passage qui vous conviennent dans l&apos;agenda du médecin et renseignez vos coordonnées patient sans créer de compte.
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center gap-2 text-secondary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  schedule
                </span>
                <span>Créneaux dédiés de 30 minutes</span>
              </div>
            </div>

            <div className="relative rounded-2xl bg-surface-container-lowest p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-tertiary-container">
                    <span className="material-symbols-outlined text-[28px]">
                      badge
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md font-bold text-surface-container-highest">
                    03
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-3">
                  Recevoir son pass consultation
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Votre pass consultation avec code confidentiel unique est généré instantanément pour votre accueil au cabinet médical.
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center gap-2 text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  check_circle
                </span>
                <span>Confirmation instantanée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE SERVICES CATALOG (2X2 DESKTOP GRID) — UN SEUL MÉDECIN */}
      <section
        className="w-full py-16 lg:py-24 bg-surface-container-low"
        id="services-cabinet"
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-secondary font-label-md text-label-md mb-2">
                <span className="material-symbols-outlined text-[16px]">
                  stethoscope
                </span>
                <span>ACTES &amp; CONSULTATIONS DU CABINET</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                Motifs de Consultation — {DOCTOR_INFO.name}
              </h2>
            </div>
            <span className="text-on-surface-variant font-label-md text-label-md">
              Sélectionnez le type de consultation souhaité avec votre médecin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, idx) => {
              const meta =
                SERVICE_METADATA[service.id] ||
                SERVICE_METADATA[(idx % 4) + 1];

              return (
                <div
                  key={service.id}
                  className="rounded-2xl bg-surface-container-lowest p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="w-13 h-13 p-3 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">
                          {meta.icon}
                        </span>
                      </div>
                      {meta.badgeVariant === 'secondary' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          <span>{meta.badgeText}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                          <span>{meta.badgeText}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-title-md text-title-md text-primary font-bold group-hover:text-secondary transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="space-y-2 py-3 bg-surface-container-low rounded-xl px-4 mb-6">
                      {meta.bullets.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            check_circle
                          </span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      <span>{meta.roomInfo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleServiceChoose(service)}
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <span>Prendre RDV</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESKTOP INFORMATION & ASSISTANCE STRIP */}
      <section className="w-full py-16 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="rounded-3xl bg-primary text-on-primary p-8 lg:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary/30 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/20 text-inverse-primary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    support_agent
                  </span>
                  <span>Secrétariat du {DOCTOR_INFO.name}</span>
                </span>
                <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary">
                  Besoin d&apos;un renseignement avant votre consultation ?
                </h2>
                <p className="font-body-md text-body-md text-inverse-on-surface leading-relaxed max-w-lg">
                  Le secrétariat médical du {DOCTOR_INFO.name} vous accueille et répond à vos questions pour préparer votre visite. Munissez-vous de votre carte CNIE et de votre attestation AMO / CNSS lors de votre venue au cabinet.
                </p>
              </div>
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-inverse-primary mb-3">
                    <span className="material-symbols-outlined text-[20px]">
                      schedule
                    </span>
                  </div>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-primary mb-1">
                    Horaires du cabinet
                  </h3>
                  <p className="font-label-sm text-label-sm text-inverse-on-surface">
                    Lundi - Vendredi : {DOCTOR_INFO.hoursWeekdays}
                    <br />
                    Samedi : {DOCTOR_INFO.hoursSaturday}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-inverse-primary mb-3">
                    <span className="material-symbols-outlined text-[20px]">
                      pin_drop
                    </span>
                  </div>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-primary mb-1">
                    Adresse du cabinet
                  </h3>
                  <p className="font-label-sm text-label-sm text-inverse-on-surface">
                    Avenue Hassan II, Quartier Administratif
                    <br />
                    Rez-de-chaussée, Larache
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-inverse-primary mb-3">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </div>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-primary mb-1">
                    Contact &amp; Suivi
                  </h3>
                  <p className="font-label-sm text-label-sm text-inverse-on-surface">
                    {DOCTOR_INFO.email}
                    <br />
                    Réponse sous 2h ouvrées
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-inverse-primary mb-3">
                    <span className="material-symbols-outlined text-[20px]">
                      call
                    </span>
                  </div>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-primary mb-1">
                    Secrétariat téléphonique
                  </h3>
                  <p className="font-label-sm text-label-sm text-inverse-on-surface">
                    {DOCTOR_INFO.phone}
                    <br />
                    Accueil patients du lundi au samedi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
