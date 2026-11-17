import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PublicSlotResponse, ServiceResponse } from '../types/api';
import {
  DOCTOR_INFO,
  DEFAULT_SERVICES,
  fetchAvailableSlots,
  fetchPublicServices,
} from '../services/api';
import {
  formatFrenchFullDate,
  formatWeekRangeTitle,
  getWeekDaysFromMonday,
  parseIsoDate,
  toIsoDate,
} from '../utils/dateUtils';

interface SelectSlotPageProps {
  selectedService: ServiceResponse;
  selectedDate: string;
  selectedSlot: PublicSlotResponse | null;
  onChangeService: (service: ServiceResponse) => void;
  onChangeDate: (date: string) => void;
  onSelectSlot: (slot: PublicSlotResponse) => void;
}

export const SelectSlotPage: React.FC<SelectSlotPageProps> = ({
  selectedService,
  selectedDate,
  selectedSlot,
  onChangeService,
  onChangeDate,
  onSelectSlot,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceResponse[]>(DEFAULT_SERVICES);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [mondayIso, setMondayIso] = useState('2026-11-16');
  const [slots, setSlots] = useState<PublicSlotResponse[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [timeLeft, setTimeLeft] = useState(582); // 09:42

  // Synchronize URL query param serviceId if provided
  useEffect(() => {
    fetchPublicServices().then((list) => {
      if (list.length > 0) {
        setServices(list);
        const paramId = Number(searchParams.get('serviceId'));
        if (paramId) {
          const found = list.find((s) => s.id === paramId);
          if (found && found.id !== selectedService.id) {
            onChangeService(found);
          }
        }
      }
    });
  }, [searchParams]);

  // Load slots whenever service or date changes
  useEffect(() => {
    let mounted = true;
    setLoadingSlots(true);
    fetchAvailableSlots(selectedService.id, selectedDate).then((data) => {
      if (!mounted) return;
      setSlots(data);
      setLoadingSlots(false);
      // Select default slot (e.g. 09:30 or first available) if none selected or date/service changed
      const matchingCurrent = data.find(
        (s) => s.id === selectedSlot?.id && s.available
      );
      if (!matchingCurrent) {
        const preferred =
          data.find((s) => s.startTime === '09:30' && s.available) ||
          data.find((s) => s.available);
        if (preferred) {
          onSelectSlot(preferred);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedService.id, selectedDate]);

  // Session countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const weekDays = getWeekDaysFromMonday(mondayIso);

  const handleShiftWeek = (deltaDays: number) => {
    const cur = parseIsoDate(mondayIso);
    cur.setDate(cur.getDate() + deltaDays);
    const nextMonday = toIsoDate(cur);
    setMondayIso(nextMonday);
    // Select Tuesday of that week by default
    const tuesday = new Date(cur);
    tuesday.setDate(cur.getDate() + 1);
    onChangeDate(toIsoDate(tuesday));
  };

  const handleResetToday = () => {
    setMondayIso('2026-11-16');
    onChangeDate('2026-11-18');
  };

  const morningSlots = slots.filter((s) => s.startTime < '12:30');
  const afternoonSlots = slots.filter((s) => s.startTime >= '12:30');
  const morningAvailableCount = morningSlots.filter((s) => s.available).length;
  const afternoonAvailableCount = afternoonSlots.filter((s) => s.available).length;

  const handleContinue = () => {
    if (!selectedSlot) return;
    navigate('/coordonnees-patient');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb Bar */}
      <div className="w-full bg-surface-container-low/70 py-4 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-wrap items-center gap-2 font-label-md text-label-md"
          >
            <Link
              to="/"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Accueil</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">
              chevron_right
            </span>
            <Link
              to="/#services-cabinet"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <span>Motifs de Consultation</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">
              chevron_right
            </span>
            <span className="text-primary font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>
                {DOCTOR_INFO.name} ({selectedService.name})
              </span>
            </span>
          </nav>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm mb-2">
              <span className="material-symbols-outlined text-[14px]">
                event_available
              </span>
              <span>Étape 1 sur 3 • Choix du rendez-vous</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Sélectionnez la date &amp; l&apos;heure de votre consultation
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Choisissez une heure de passage garantie avec le {DOCTOR_INFO.name} pour éviter toute attente au cabinet.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-sm text-label-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span>
              </span>
              <span>Cabinet du {DOCTOR_INFO.name} ouvert</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Doctor & Motif Info */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-secondary/5 pointer-events-none"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">
                    stethoscope
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    Cabinet Médical Individuel
                  </span>
                  <h2 className="font-title-md text-title-md text-primary leading-snug">
                    {DOCTOR_INFO.name}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      apartment
                    </span>
                    <span>{DOCTOR_INFO.officeLocation}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 bg-surface-container-low/50 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md min-w-0">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                    healing
                  </span>
                  <div className="truncate">
                    <span className="block font-semibold text-on-surface text-[13px] truncate">
                      {selectedService.name}
                    </span>
                    <span className="block text-[11px] text-on-surface-variant">
                      Motif de consultation sélectionné
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowServiceSelector((prev) => !prev)}
                  className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-primary transition-colors font-semibold shrink-0 ml-2 cursor-pointer"
                >
                  <span>Changer</span>
                  <span className="material-symbols-outlined text-[16px]">
                    swap_horiz
                  </span>
                </button>
              </div>

              {showServiceSelector && (
                <div className="mt-3 p-3 rounded-xl bg-surface-container-low space-y-1.5">
                  <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Choisir un autre motif avec le {DOCTOR_INFO.name} :
                  </span>
                  {services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        onChangeService(srv);
                        setShowServiceSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                        srv.id === selectedService.id
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {srv.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-3.5 pt-5 border-t border-surface-container-low bg-surface-container-lowest">
                <div className="flex items-center justify-between text-body-md font-body-md">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      schedule
                    </span>
                    <span>Horaires du cabinet</span>
                  </span>
                  <span className="font-semibold text-on-surface">
                    08h30 - 17h30
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-md font-body-md">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      public
                    </span>
                    <span>Fuseau horaire</span>
                  </span>
                  <span className="font-semibold text-on-surface text-right">
                    GMT+1 (Casablanca)
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-md font-body-md">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      timer
                    </span>
                    <span>Durée de consultation</span>
                  </span>
                  <span className="font-semibold text-secondary">
                    {DOCTOR_INFO.consultationDuration}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3 text-primary">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  health_and_safety
                </span>
                <h3 className="font-title-md text-title-md font-semibold">
                  Consignes médicales préalables
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Pour assurer une prise en charge optimale par le {DOCTOR_INFO.name}, merci de vous munir de :
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                    clinical_notes
                  </span>
                  <span>
                    Carnet de santé ou ordonnances et traitements antérieurs.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                    badge
                  </span>
                  <span>
                    Carte d&apos;Assurance Maladie (AMO / CNOPS / CNSS) et CNIE originale.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                    lab_profile
                  </span>
                  <span>
                    Résultats d&apos;analyses biologiques ou examens récents.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  lock_clock
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    Session de réservation
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold"
                    id="session-timer"
                  >
                    {formatTimer(timeLeft)}
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  Créneau réservé temporairement pendant 10 minutes.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Main Content: Weekly Calendar & Slots */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Weekly Selector */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      calendar_month
                    </span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-primary font-semibold">
                      {formatWeekRangeTitle(mondayIso)}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Disponibilités de consultation — {DOCTOR_INFO.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleShiftWeek(-7)}
                    aria-label="Semaine précédente"
                    className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToday}
                    className="px-3 h-9 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Aujourd&apos;hui
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftWeek(7)}
                    aria-label="Semaine suivante"
                    className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2.5">
                {weekDays.map((day) => {
                  const isSelected = day.isoDate === selectedDate;
                  if (day.isClosed) {
                    return (
                      <div
                        key={day.isoDate}
                        className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low/40 opacity-50 cursor-not-allowed text-center"
                      >
                        <span className="font-label-sm text-label-sm text-outline uppercase">
                          {day.dayShort}
                        </span>
                        <span className="font-headline-sm text-headline-sm text-outline my-1">
                          {day.dayNumber}
                        </span>
                        <span className="font-label-sm text-[10px] text-outline">
                          Fermé
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={day.isoDate}
                      type="button"
                      onClick={() => onChangeDate(day.isoDate)}
                      className={
                        isSelected
                          ? 'group relative flex flex-col items-center p-3 rounded-xl bg-primary text-on-primary transition-all text-center shadow-md cursor-pointer'
                          : 'group flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all text-center cursor-pointer'
                      }
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[11px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check
                          </span>
                        </div>
                      )}
                      <span
                        className={
                          isSelected
                            ? 'font-label-sm text-label-sm text-on-primary/80 uppercase font-semibold'
                            : 'font-label-sm text-label-sm text-on-surface-variant uppercase'
                        }
                      >
                        {day.dayShort}
                      </span>
                      <span
                        className={
                          isSelected
                            ? 'font-headline-sm text-headline-sm text-on-primary my-1 font-bold'
                            : 'font-headline-sm text-headline-sm text-on-surface my-1'
                        }
                      >
                        {day.dayNumber}
                      </span>
                      <span
                        className={
                          isSelected
                            ? 'px-2 py-0.5 rounded-full bg-on-primary text-primary font-label-sm text-[10px] font-bold'
                            : 'px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px]'
                        }
                      >
                        {day.freeSlotsCount}{' '}
                        {day.freeSlotsCount > 1 ? 'libres' : 'libre'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Time Slots Grid */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <h3 className="font-title-md text-title-md text-primary font-bold">
                      {formatFrenchFullDate(selectedDate)} — Consultations
                    </h3>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    Choisissez l&apos;heure précise de votre passage avec le {DOCTOR_INFO.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-label-sm font-label-sm bg-surface-container-low px-3.5 py-2 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-surface-container-lowest shadow-sm"></span>
                    <span className="text-on-surface-variant">Disponible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-secondary shadow-sm"></span>
                    <span className="text-on-surface font-semibold">
                      Sélectionné
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-surface-container-high"></span>
                    <span className="text-outline">Réservé</span>
                  </div>
                </div>
              </div>

              {loadingSlots ? (
                <div className="py-12 text-center text-on-surface-variant font-body-md">
                  Chargement des créneaux du {DOCTOR_INFO.name}...
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Morning */}
                  <div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="material-symbols-outlined text-[20px] text-secondary">
                        wb_twilight
                      </span>
                      <h4 className="font-label-lg text-label-lg text-primary font-semibold uppercase tracking-wider">
                        Matinée • 09h00 à 12h00
                      </h4>
                      <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
                        {morningAvailableCount} créneaux disponibles
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {morningSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        if (!slot.available) {
                          return (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/50 cursor-not-allowed opacity-60 text-left"
                            >
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md font-medium text-outline">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span className="font-label-sm text-label-sm text-outline mt-0.5 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">
                                    block
                                  </span>
                                  Réservé
                                </span>
                              </div>
                              <span className="material-symbols-outlined text-[20px] text-outline">
                                lock
                              </span>
                            </div>
                          );
                        }

                        if (isSelected) {
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => onSelectSlot(slot)}
                              className="slot-card group flex items-center justify-between p-3.5 rounded-xl bg-primary text-on-primary shadow-md text-left cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md font-bold text-on-primary">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span className="font-label-sm text-label-sm text-on-primary/90 font-semibold flex items-center gap-1 mt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
                                  Sélectionné par vous
                                </span>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm">
                                <span
                                  className="material-symbols-outlined text-[18px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  check
                                </span>
                              </div>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => onSelectSlot(slot)}
                            className="slot-card group flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all text-left cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-title-md text-title-md font-semibold text-on-surface group-hover:text-primary">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className="font-label-sm text-label-sm text-on-tertiary-container font-medium flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                                Disponible
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary">
                              radio_button_unchecked
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="material-symbols-outlined text-[20px] text-secondary">
                        light_mode
                      </span>
                      <h4 className="font-label-lg text-label-lg text-primary font-semibold uppercase tracking-wider">
                        Après-midi • 14h00 à 17h00
                      </h4>
                      <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
                        {afternoonAvailableCount} créneaux disponibles
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {afternoonSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        if (!slot.available) {
                          return (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/50 cursor-not-allowed opacity-60 text-left"
                            >
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md font-medium text-outline">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span className="font-label-sm text-label-sm text-outline mt-0.5 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">
                                    block
                                  </span>
                                  Réservé
                                </span>
                              </div>
                              <span className="material-symbols-outlined text-[20px] text-outline">
                                lock
                              </span>
                            </div>
                          );
                        }

                        if (isSelected) {
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => onSelectSlot(slot)}
                              className="slot-card group flex items-center justify-between p-3.5 rounded-xl bg-primary text-on-primary shadow-md text-left cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md font-bold text-on-primary">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span className="font-label-sm text-label-sm text-on-primary/90 font-semibold flex items-center gap-1 mt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
                                  Sélectionné par vous
                                </span>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm">
                                <span
                                  className="material-symbols-outlined text-[18px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  check
                                </span>
                              </div>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => onSelectSlot(slot)}
                            className="slot-card group flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all text-left cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-title-md text-title-md font-semibold text-on-surface group-hover:text-primary">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className="font-label-sm text-label-sm text-on-tertiary-container font-medium flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                                Disponible
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary">
                              radio_button_unchecked
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Bottom Summary & Action Bar */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    event_seat
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                    Consultation médicale sélectionnée
                  </span>
                  <p className="font-title-md text-title-md text-primary font-bold">
                    {formatFrenchFullDate(selectedDate)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-label-md text-label-md mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      schedule
                    </span>
                    <span className="font-semibold text-on-surface">
                      {selectedSlot
                        ? `${selectedSlot.startTime} à ${selectedSlot.endTime}`
                        : 'Aucun créneau'}
                    </span>
                    <span>•</span>
                    <span>
                      {DOCTOR_INFO.name} — Cabinet de Consultation
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Link
                  to="/"
                  className="px-5 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-label-lg text-label-lg flex items-center justify-center"
                >
                  Précédent
                </Link>
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={handleContinue}
                  className="px-7 h-12 rounded-xl bg-primary hover:bg-secondary disabled:opacity-50 text-on-primary transition-all font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Continuer vers les coordonnées du patient</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
