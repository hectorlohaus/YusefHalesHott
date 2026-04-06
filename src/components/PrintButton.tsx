'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-surface-variant text-on-surface-variant flex items-center justify-center gap-3 px-8 font-body font-bold py-4 hover:bg-outline-variant transition-all w-full sm:w-auto active:scale-95 shadow-md rounded-xl text-base"
    >
      <span className="material-symbols-outlined">print</span>
      Imprimir Comprobante
    </button>
  );
}
