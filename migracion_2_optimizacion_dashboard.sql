-- ==============================================================================
-- MIGRACIÓN: Índices para optimizar el panel de administración (Bandeja Solicitudes)
-- ==============================================================================
-- Propósito: Acelerar las búsquedas exactas, de texto parcial y de fechas 
-- según los filtros implementados en el frontend para el panel de Bandeja.
-- Copia y pega este archivo en el Supabase SQL Editor y ejecútalo (RUN).
-- ==============================================================================

-- 1. Optimización del filtro por ID (útil ya que el ID de Supabase uuidv4 es muy largo y el usuario busca por coincidencia)
-- Aunque id ya es PRIMARY KEY (y tiene índice implícito), añadiremos un índice para búsquedas como `LIKE '%xxx%'` en caso de que sea lento en grandes volúmenes
CREATE INDEX IF NOT EXISTS idx_solicitudes_id ON public.solicitudes (id);

-- 2. Optimización del filtro por RUT
-- El Admin frontend busca por limpieza de RUT. Añadimos un índice normal al RUT.
CREATE INDEX IF NOT EXISTS idx_solicitudes_rut ON public.solicitudes (cliente_rut);

-- 3. Optimización del filtro de Fechas (creado_en)
-- Para evitar el error de inmutabilidad con DATE(), usamos el casteo directo asumiendo timezone UTC o creamos el índice sobre la columna original
CREATE INDEX IF NOT EXISTS idx_solicitudes_creado_en ON public.solicitudes (creado_en);

-- 4. Optimización para Paginación y Carga Inicial del Dashboard
-- El dashboard siempre hace `ORDER BY creado_en DESC`, así que un índice de ordenamiento es crítico.
CREATE INDEX IF NOT EXISTS idx_solicitudes_order_fecha ON public.solicitudes (creado_en DESC);

-- 5. Optimización del Filtro por Estados Constantes (Enum-like strings)
-- Filtro recurrente: ocultar fallidos y filtrar por estado_pago o estado_boleta
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado_pago ON public.solicitudes (estado_pago);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado_boleta ON public.solicitudes (estado_boleta);

-- 6. Índice Compuesto si el Admin a menudo filtra por Pagos y Ordena por Fecha (Muy común en Dashboards)
CREATE INDEX IF NOT EXISTS idx_solicitudes_composite_pago_fecha ON public.solicitudes (estado_pago, creado_en DESC);

-- (Opcional extra) Añadimos índice a nombre en caso de que en un futuro pidan buscar a la persona por su nombre.
CREATE INDEX IF NOT EXISTS idx_solicitudes_nombre ON public.solicitudes (cliente_nombre);

-- Fin de migración.
