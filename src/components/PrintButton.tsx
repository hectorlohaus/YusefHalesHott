'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="text-[#000080] bg-blue-50 border border-blue-100 text-center font-medium px-8 py-3 rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto"
    >
      Imprimir Comprobante
    </button>
  );
}
