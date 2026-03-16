-- Migración: Añadir documentos_necesarios a tabla servicios
ALTER TABLE public.servicios ADD COLUMN IF NOT EXISTS documentos_necesarios TEXT;

-- Comentario descriptivo
COMMENT ON COLUMN public.servicios.documentos_necesarios IS 'Lista de documentos requeridos para este trámite, separados por comas. Ej: Carnet de Identidad, Certificado de Nacimiento';
