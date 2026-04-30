'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { submitSolicitud } from '@/app/actions/solicitar';
import { validateRut } from '@/lib/rut';

// ── Google Maps type shims ────────────────────────────────────
// We load the API via CDN script, so we define minimal types here.
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          // Session token (groups keystrokes + final selection into one billing event)
          AutocompleteSessionToken: new () => object;
          // AutocompleteService: for getting predictions (uses session token)
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: {
                input: string;
                componentRestrictions?: { country: string };
                sessionToken?: object;
                types?: string[];
              },
              callback: (
                predictions: GMapsPrediction[] | null,
                status: string
              ) => void
            ) => void;
          };
          // PlacesService: for fetching full place details (uses same token to close session)
          PlacesService: new (attrContainer: HTMLElement) => {
            getDetails: (
              request: {
                placeId: string;
                fields: string[];
                sessionToken?: object;
              },
              callback: (place: GMapsPlace | null, status: string) => void
            ) => void;
          };
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}

type GMapsPrediction = {
  place_id: string;
  description: string;
  structured_formatting: { main_text: string; secondary_text: string };
};

type GMapsPlace = {
  formatted_address?: string;
};

// ── App types ─────────────────────────────────────────────────
type Servicio = {
  id: string;
  titulo: string;
  arancel: number;
  documentos_necesarios?: string;
};

// ── Helpers ───────────────────────────────────────────────────
function formatPrice(n: number) {
  return `$\u00a0${n.toLocaleString('es-CL')}`;
}

function parseReqs(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(',').map((r) => r.trim()).filter(Boolean);
}

const inputCls =
  'w-full bg-surface-container-highest border-none rounded-lg p-4 font-body text-on-surface focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline';

const labelCls =
  'font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant break-words mb-2';

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2${full ? ' md:col-span-2' : ''}`}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ── Address Autocomplete with Session Tokens ──────────────────
function AddressField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [suggestions, setSuggestions] = useState<GMapsPrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs for Maps service instances and session token
  const serviceRef = useRef<ReturnType<NonNullable<NonNullable<NonNullable<Window['google']>['maps']>['places']>['AutocompleteService']['prototype']['constructor']> | null>(null);
  const sessionTokenRef = useRef<object | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a fresh session token (called once per search session)
  const newToken = useCallback(() => {
    if (window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  // Initialize AutocompleteService lazily
  const getService = useCallback(() => {
    if (!serviceRef.current && window.google?.maps?.places?.AutocompleteService) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
    return serviceRef.current;
  }, []);

  // Fetch predictions — debounced, with session token
  const fetchPredictions = useCallback(
    (input: string) => {
      const svc = getService();
      if (!svc || !input.trim()) { setSuggestions([]); setOpen(false); return; }
      if (!sessionTokenRef.current) newToken(); // Create token on first keystroke of session

      setLoading(true);
      svc.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'cl' },
          sessionToken: sessionTokenRef.current!,
          types: ['address'],
        },
        (predictions: GMapsPrediction[] | null, status: string) => {
          setLoading(false);
          const OK = window.google?.maps?.places?.PlacesServiceStatus?.OK ?? 'OK';
          if (status === OK && predictions) {
            setSuggestions(predictions);
            setOpen(true);
          } else {
            setSuggestions([]);
            setOpen(false);
          }
        }
      );
    },
    [getService, newToken]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(v), 300);
  };

  // Select a suggestion: call PlacesService.getDetails with SAME token, then discard token
  const handleSelect = (prediction: GMapsPrediction) => {
    if (!window.google?.maps?.places?.PlacesService) {
      onChange(prediction.description);
      setSuggestions([]);
      setOpen(false);
      sessionTokenRef.current = null; // discard — start fresh next time
      return;
    }

    const attrContainer = document.createElement('div');
    const placesService = new window.google.maps.places.PlacesService(attrContainer);

    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'address_components', 'geometry'],
        sessionToken: sessionTokenRef.current!, // Same token closes the billing session
      },
      (place, status) => {
        const OK = window.google?.maps?.places?.PlacesServiceStatus?.OK ?? 'OK';
        onChange(status === OK && place?.formatted_address ? place.formatted_address : prediction.description);
        setSuggestions([]);
        setOpen(false);
        sessionTokenRef.current = null; // Session complete — next search creates a new token
      }
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className="flex flex-col gap-2 md:col-span-2 group" ref={containerRef}>
      <label className={labelCls}>Dirección Completa *</label>
      <div className="relative">
        <input
          ref={inputRef}
          required
          type="text"
          name="direccion"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 2 && suggestions.length > 0 && setOpen(true)}
          className={inputCls}
          placeholder="Calle, Número, Ciudad — empiece a escribir..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {/* Map pin / loading icon */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <svg className="h-4 w-4 text-secondary animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          )}
        </span>

        {/* Suggestions dropdown */}
        {open && suggestions.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            {suggestions.map((pred) => (
              <li
                key={pred.place_id}
                role="option"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(pred); }}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-surface-container last:border-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <p className="font-body text-sm font-semibold text-slate-900 leading-tight">
                    {pred.structured_formatting.main_text}
                  </p>
                  <p className="font-body text-xs text-slate-400 mt-0.5">
                    {pred.structured_formatting.secondary_text}
                  </p>
                </div>
              </li>
            ))}
            {/* Attribution required by Google TOS */}
            <li className="flex justify-end px-4 py-2 bg-slate-50">
              <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" alt="Powered by Google" className="h-4 opacity-60" />
            </li>
          </ul>
        )}
      </div>
      <p className="font-label text-[10px] text-slate-400 mt-2 italic">
        Sugerencias de Google Maps — seleccione una dirección de la lista.
      </p>
    </div>
  );
}

// ── Main form component ───────────────────────────────────────

export default function SolicitudForm({
  servicios,
  preselectedId,
}: {
  servicios: Servicio[];
  preselectedId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successId, setSuccessId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedId || '');
  const [direccion, setDireccion] = useState('');

  // Dropdown states for services
  const preselectedService = servicios.find(s => s.id === preselectedId);
  const [searchService, setSearchService] = useState(preselectedService ? `${preselectedService.titulo} - $${(preselectedService.arancel || 0).toLocaleString('es-CL')}` : '');
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  const filteredServices = useMemo(() => {
    if (!searchService) return servicios;
    const q = searchService.toLowerCase();
    return servicios.filter(s => s.titulo.toLowerCase().includes(q));
  }, [searchService, servicios]);

  const selectedService = servicios.find((s) => s.id === selectedServiceId);
  const requisitos = parseReqs(selectedService?.documentos_necesarios);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.set('direccion', direccion);

    const formRut = formData.get('rut') as string;
    if (!validateRut(formRut)) {
      setErrorMsg('El RUT ingresado no es válido. Por favor verifíquelo.');
      setLoading(false);
      return;
    }

    try {
      const result = await submitSolicitud(formData);
      if (result.success) {
        setSuccessId(result.solicitudId);
        setSuccess(true);
      } else {
        setErrorMsg(result.error || 'Ocurrió un error al enviar la solicitud.');
      }
    } catch {
      setErrorMsg('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────
  if (success) {
    return (
      <div className="p-10 md:p-16 text-center">
        <div className="w-20 h-20 bg-secondary-fixed text-on-secondary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-3">¡Solicitud Enviada!</h2>
        <p className="font-body text-on-surface-variant mb-8 max-w-md mx-auto text-lg leading-relaxed">
          Hemos recibido sus datos correctamente. Haga clic en el siguiente botón para realizar el pago de su trámite.
        </p>
        <button
          className="bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold px-12 py-5 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center gap-3 mx-auto focus:outline-none"
          onClick={() => (window.location.href = `/checkout?solicitudId=${successId}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          Continuar al Pago
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Error banner */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-body text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* ── SECCIÓN 1: Información Personal ── */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed flex-shrink-0">
            <span className="material-symbols-outlined text-lg">person</span>
          </span>
          <h2 className="text-xl font-headline font-bold text-on-surface">Información Personal</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Nombre Completo *">
            <input required type="text" name="nombre" className={inputCls} placeholder="Ej: Juan Pérez Soto" />
          </Field>
          <Field label="RUT *">
            <input required type="text" name="rut" className={inputCls} placeholder="12.345.678-9" />
          </Field>
          <Field label="Correo Electrónico *">
            <input required type="email" name="email" className={inputCls} placeholder="nombre@ejemplo.com" />
          </Field>
          <Field label="Teléfono Móvil *">
            <input required type="tel" name="telefono" className={inputCls} placeholder="+56 9 1234 5678" />
          </Field>

          {/* Address with Session Token autocomplete */}
          <AddressField value={direccion} onChange={setDireccion} />
        </div>
      </section>

      {/* ── SECCIÓN 2: Detalle del Trámite ── */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed flex-shrink-0">
            <span className="material-symbols-outlined text-lg">gavel</span>
          </span>
          <h2 className="text-xl font-headline font-bold text-on-surface">Detalle del Trámite</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className={labelCls}>Servicio a Solicitar *</label>
            <div className="relative">
            <input type="hidden" name="servicio_id" value={selectedServiceId} required />
              <input
              type="text"
              required={!selectedServiceId}
              value={searchService}
              onChange={(e) => {
                setSearchService(e.target.value);
                setSelectedServiceId('');
                setIsServiceDropdownOpen(true);
              }}
              onFocus={() => setIsServiceDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsServiceDropdownOpen(false), 200)}
              className={inputCls}
              placeholder="🔎 Buscar el trámite legal..."
            />
            {isServiceDropdownOpen && (
              <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredServices.length > 0 ? (
                  filteredServices.map((s: any) => (
                    <li
                      key={s.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedServiceId(s.id);
                        setSearchService(`${s.titulo} - ${formatPrice(s.arancel)}`);
                        setIsServiceDropdownOpen(false);
                      }}
                      className={`px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-surface-container last:border-0 ${selectedServiceId === s.id ? 'bg-surface-container-low' : ''}`}
                    >
                      <div className={`font-body text-sm ${selectedServiceId === s.id ? 'font-bold text-secondary' : 'font-semibold text-on-surface'}`}>
                        {s.titulo}
                      </div>
                      <div className="font-body text-xs text-secondary font-bold mt-0.5">
                        {formatPrice(s.arancel)}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-slate-500 italic">No se encontraron trámites con ese nombre.</li>
                )}
              </ul>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {selectedService && (
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold">
                Documentos Requeridos
              </h4>
              <span className="font-label text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                {formatPrice(selectedService.arancel)}
              </span>
            </div>
            {requisitos.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requisitos.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface-variant">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-sm text-on-surface-variant italic">Sin documentos adicionales requeridos.</p>
            )}
          </div>
        )}
      </div>
    </section>

      {/* ── CTA ── */}
      <div className="pt-6 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-surface-container">
        <div className="flex items-center gap-3 text-on-surface-variant italic text-sm">
          <span className="material-symbols-outlined text-secondary">shield_lock</span>
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface">Datos protegidos</span>
            <span className="opacity-80">Información cifrada y segura</span>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-4 w-full md:w-auto">
          <button type="button" className="w-full sm:w-auto px-6 sm:px-8 py-4 text-on-surface-variant font-medium hover:text-on-surface transition-colors text-center" onClick={() => window.history.back()}>Cancelar</button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 font-label text-[11px] uppercase tracking-widest font-bold px-6 sm:px-12 py-4 sm:py-5 rounded-xl text-on-primary transition-all active:scale-[0.98] focus:outline-none ${
              loading ? 'bg-outline cursor-not-allowed' : 'bg-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:bg-primary/90'
            }`}
          >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              Continuar al Pago
            </>
          )}
        </button>
      </div>
      </div>
    </form>
  );
}
