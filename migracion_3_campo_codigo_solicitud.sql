-- ==============================================================================
-- MIGRACIÓN: Agregar campo 'codigo' a la tabla solicitudes
-- ==============================================================================
-- Propósito: Agregar un campo de búsqueda directo `codigo` que contenga
-- los primeros 8 caracteres del UUID, en mayúsculas, para permitir búsquedas
-- exactas y eficientes en el panel de administración y en la vista pública.
--
-- Instrucciones:
-- 1. Copia este archivo completo en el SQL Editor de Supabase.
-- 2. Haz clic en "Run" para ejecutarlo.
-- 3. Una vez ejecutado, actualiza tu código para usar .eq('codigo', ...) 
--    en vez de .ilike('id', ...) en el buscador de solicitudes.
-- ==============================================================================

-- 1. Agregar el campo `codigo` como TEXT, único, no nulo
ALTER TABLE public.solicitudes
  ADD COLUMN IF NOT EXISTS codigo TEXT;

-- 2. Rellenar el campo para los registros ya existentes
UPDATE public.solicitudes
  SET codigo = UPPER(SUBSTRING(id::text FROM 1 FOR 8))
  WHERE codigo IS NULL;

-- 3. Agregar la restricción NOT NULL y UNIQUE después de poblar los existentes
ALTER TABLE public.solicitudes
  ALTER COLUMN codigo SET NOT NULL;

ALTER TABLE public.solicitudes
  ADD CONSTRAINT solicitudes_codigo_unique UNIQUE (codigo);

-- 4. Crear un índice para búsquedas ultra-rápidas por código
CREATE INDEX IF NOT EXISTS idx_solicitudes_codigo ON public.solicitudes (codigo);

-- 5. Crear una función trigger que genere el código automáticamente en los INSERT nuevos 
CREATE OR REPLACE FUNCTION public.generar_codigo_solicitud()
RETURNS TRIGGER AS $$
BEGIN
  NEW.codigo := UPPER(SUBSTRING(NEW.id::text FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Asociar el trigger a la tabla para que se ejecute en cada INSERT
DROP TRIGGER IF EXISTS trigger_generar_codigo ON public.solicitudes;
CREATE TRIGGER trigger_generar_codigo
  BEFORE INSERT ON public.solicitudes
  FOR EACH ROW
  EXECUTE FUNCTION public.generar_codigo_solicitud();

-- Fin de migración.
-- Verificación: SELECT id, codigo FROM public.solicitudes LIMIT 10;
