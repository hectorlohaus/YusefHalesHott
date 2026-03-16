-- ==========================================
-- MIGRACIÓN: ÍNDICES DE BÚSQUEDA PARA SERVICIOS
-- ==========================================
-- Estos índices mejoran el rendimiento de las consultas al buscar trámites 
-- por coincidencias en el título o descripción en la base de datos de Supabase.

-- Índice estándar de tipo B-Tree para búsquedas exactas o prefijos del título
CREATE INDEX IF NOT EXISTS idx_servicios_titulo_btree ON public.servicios (titulo);

-- Extensión requerida para Trigramas (Búsquedas parciales en ILIKE)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índice GIN y Trigramas para búsquedas avanzadas e ilike '%texto%' en título y descripción
CREATE INDEX IF NOT EXISTS idx_servicios_titulo_trgm ON public.servicios USING gin (titulo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_servicios_desc_trgm ON public.servicios USING gin (descripcion gin_trgm_ops);
