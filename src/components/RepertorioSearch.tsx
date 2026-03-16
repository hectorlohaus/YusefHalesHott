'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Column {
  key: string;
  label: string;
}

interface RepertorioSearchProps {
  tableName: string;
  title: string;
  columns: Column[];
  searchFields: { id: string; label: string; type: string; options?: string[] }[];
  defaultSort?: { column: string; ascending: boolean };
}

export default function RepertorioSearch({
  tableName,
  title,
  columns,
  searchFields,
  defaultSort = { column: 'fecha', ascending: false }
}: RepertorioSearchProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const recordsPerPage = 20;
  
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (!value) return;
        
        if (key === 'fecha_desde') {
          query = query.gte('fecha', value);
        } else if (key === 'fecha_hasta') {
          query = query.lte('fecha', value);
        } else if (typeof value === 'string' && value.trim() !== '') {
          // Si es un número (como n_rep o numero_inscripcion), usamos eq o ilike según convenga
          if (['n_rep', 'numero_inscripcion'].includes(key)) {
            query = query.ilike(key, `%${value}%`);
          } else {
            query = query.ilike(key, `%${value}%`);
          }
        }
      });

      // Pagination
      const from = (page - 1) * recordsPerPage;
      const to = from + recordsPerPage - 1;

      const { data: results, count, error } = await query
        .order(defaultSort.column, { ascending: defaultSort.ascending })
        .range(from, to);

      if (error) throw error;
      
      setData(results || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching repertorio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-CL', { timeZone: 'UTC' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 font-serif">Buscador Personalizado</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchFields.map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={filters[field.id] || ''}
                  onChange={(e) => setFilters({ ...filters, [field.id]: e.target.value })}
                >
                  <option value="">Cualquiera</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={`Buscar por ${field.label.toLowerCase()}...`}
                  value={filters[field.id] || ''}
                  onChange={(e) => setFilters({ ...filters, [field.id]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron registros que coincidan con su búsqueda.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-slate-50 transition-colors group">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-slate-700">
                        {col.key === 'fecha' ? formatDate(row[col.key]) : (row[col.key] || '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalCount > recordsPerPage && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mostrando <span className="font-bold text-slate-900">{(page - 1) * recordsPerPage + 1}</span> a <span className="font-bold text-slate-900">{Math.min(page * recordsPerPage, totalCount)}</span> de <span className="font-bold text-slate-900">{totalCount}</span> registros
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <button
                disabled={page >= Math.ceil(totalCount / recordsPerPage)}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
