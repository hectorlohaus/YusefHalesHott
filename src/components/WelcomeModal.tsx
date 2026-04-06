'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomeModal', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl bg-surface-container-lowest flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button (Absolute) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 z-20 p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Left Column: Visual & Identity */}
        <div className="relative w-full md:w-5/12 min-h-[300px] md:min-h-full overflow-hidden bg-primary-container">
          <Image
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Pluma fuente sobre documento legal"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHxDabekC7MGYNqmvSJmGqC9_S1OMgeKcWo5hW0KWOf_5bwGzzd1V3ZHRfF8AUqzCouJN0asSzLGPPIdfZqZdX_2hNepi_2p6OozcqqzIqHiekYCdkn0wpqLIHRKyTUSIqi7fUtd1wDy2p3Yipun0SSmecSDfQJcAxL6dDgcZ7ZRGq4CBdZZRqIW9IUfvWc5E7sTdvw8Ml-sL0BmVX_g_O69wTFuk4eo0vAY4HzmVZshXsoIziRDI0UPuhNJlDL8lzhA5p91MzFA"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          <div className="relative h-full flex flex-col justify-between p-10 z-10">
            <div>
              <h1 id="modal-title" className="font-headline text-4xl md:text-5xl text-on-primary italic leading-tight tracking-tight">
                Notaría Yusef<br />Hales Hott
              </h1>
              <div className="w-12 h-1 bg-secondary mt-6"></div>
            </div>
            <div className="mt-auto">
              <p className="text-on-primary-container text-sm leading-relaxed max-w-xs font-light italic">
                "Excelencia jurídica y fe pública con el sello de distinción que su gestión merece."
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col gap-10 bg-surface-container-lowest">
          {/* Schedule Section */}
          <section>
            <h3 className="font-label text-xs font-bold tracking-widest text-on-surface-variant mb-8 uppercase">Horarios de Atención</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Morning Block */}
              <div className="group p-6 rounded-lg bg-surface-container-low transition-all duration-300 hover:bg-surface-container-high">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary">light_mode</span>
                  <span className="font-label text-sm font-semibold text-secondary">Jornada Mañana</span>
                </div>
                <p className="font-headline text-2xl text-on-surface">09:00 — 14:00</p>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">Lunes a Viernes</p>
              </div>
              {/* Afternoon Block */}
              <div className="group p-6 rounded-lg bg-surface-container-low transition-all duration-300 hover:bg-surface-container-high">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-on-surface">dark_mode</span>
                  <span className="font-label text-sm font-semibold text-on-surface">Jornada Tarde</span>
                </div>
                <p className="font-headline text-2xl text-on-surface">15:00 — 17:00</p>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">Lunes a Jueves</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 p-3 bg-surface-container text-on-surface-variant rounded-lg">
              <span className="material-symbols-outlined text-sm">info</span>
              <p className="text-[11px] font-medium italic">Viernes por la tarde: Cerrado.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h3 className="font-label text-xs font-bold tracking-widest text-on-surface-variant mb-6 uppercase">Contacto Directo</h3>
            <div className="flex flex-col gap-4">
              {/* Phone CTA */}
              <a className="group flex items-center justify-between p-4 rounded-xl border border-outline-variant/15 hover:bg-secondary transition-all duration-300" href="tel:+56443051909">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/10 group-hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-secondary group-hover:text-white transition-colors">call</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant group-hover:text-white/80 font-bold tracking-widest transition-colors uppercase">Teléfono Fijo</p>
                    <p className="text-lg font-headline text-on-surface group-hover:text-white transition-colors">44 305 1909</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-white transition-all group-hover:translate-x-1">arrow_forward</span>
              </a>
              {/* Email CTA */}
              <a className="group flex items-center justify-between p-4 rounded-xl border border-outline-variant/15 hover:bg-primary-container transition-all duration-300" href="mailto:contacto@notariatraiguen.cl" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest group-hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-on-surface group-hover:text-white transition-colors">mail</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant group-hover:text-white/80 font-bold tracking-widest transition-colors uppercase">Correo Electrónico</p>
                    <p className="text-lg font-headline text-on-surface group-hover:text-white transition-colors">contacto@notariatraiguen.cl</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-white transition-all group-hover:translate-x-1">arrow_forward</span>
              </a>
            </div>
          </section>

          {/* Location Snippet */}
          <section className="mt-auto pt-6 border-t border-outline-variant/10">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-on-surface-variant mt-1">location_on</span>
              <div>
                <p className="text-xs font-semibold text-on-surface">Dirección Traiguén</p>
                <p className="text-sm text-on-surface-variant">Errázuriz N°418, Traiguén, Región de la Araucanía.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
