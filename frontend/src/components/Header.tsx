import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DOCTOR_INFO } from '../services/api';

interface HeaderProps {
  onOpenLookupModal: (initialCode?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLookupModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isBookingFlow =
    location.pathname.startsWith('/prendre-rdv') ||
    location.pathname.startsWith('/coordonnees-patient') ||
    location.pathname.startsWith('/confirmation');

  const handleScrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#services-cabinet');
      setTimeout(() => {
        document.getElementById('services-cabinet')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('services-cabinet')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-4 shrink-0">
          <div className="w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">stethoscope</span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-primary leading-tight tracking-tight">
              {DOCTOR_INFO.cabinetName}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {DOCTOR_INFO.subtitle}
            </span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl">
          <Link
            to="/"
            aria-current={isHome ? 'page' : undefined}
            className={
              isHome
                ? 'px-3.5 py-2 transition-all bg-primary text-on-primary font-label-md text-label-md rounded-lg'
                : 'px-3.5 py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg'
            }
          >
            Accueil
          </Link>
          <a
            href="#services-cabinet"
            onClick={handleScrollToServices}
            className="px-3.5 py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg"
          >
            Motifs de Consultation
          </a>
          <Link
            to="/prendre-rdv"
            aria-current={isBookingFlow ? 'page' : undefined}
            className={
              isBookingFlow
                ? 'px-3.5 py-2 transition-all bg-primary text-on-primary font-label-md text-label-md rounded-lg'
                : 'px-3.5 py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg'
            }
          >
            Prendre un Rendez-vous
          </Link>
          <button
            type="button"
            onClick={() => onOpenLookupModal()}
            className="px-3.5 py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg cursor-pointer"
          >
            Consulter / Annuler mon RDV
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              schedule
            </span>
            <span className="font-label-sm text-label-sm">{DOCTOR_INFO.timezone}</span>
          </div>
          <Link
            to="/prendre-rdv"
            className="inline-flex items-center gap-2 h-11 px-4 rounded-lg bg-primary text-on-primary hover:bg-secondary transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>Réserver avec le Docteur</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
