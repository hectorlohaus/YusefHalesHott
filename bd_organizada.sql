-- ==========================================
-- ESQUEMA DE BASE DE DATOS: NOTARÍA TRAIGUEN
-- ==========================================

-- 1. Tabla de Empleados / Usuarios del Sistema (Notario y Empleados)
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Vinculación con Supabase Auth
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('notario', 'empleado')),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    sueldo NUMERIC(15, 2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Políticas RLS recomendadas:
-- Sólo el notario debiese poder ver y modificar los sueldos en la vista de administración, o que sean públicos en la landing de transparencia.

-- 2. Tabla de Servicios y Aranceles
CREATE TABLE public.servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    arancel NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Tabla de Solicitudes (Generadas por clientes)
CREATE TABLE public.solicitudes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50),
    cliente_direccion TEXT,
    cliente_rut VARCHAR(20),
    servicio_id UUID REFERENCES public.servicios(id) ON DELETE RESTRICT,
    estado_trabajo VARCHAR(50) DEFAULT 'pendiente' CHECK (estado_trabajo IN ('pendiente', 'en_proceso', 'listo')),
    estado_pago VARCHAR(50) DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'pagado', 'fallido')),
    estado_boleta VARCHAR(50) DEFAULT 'sin enviar' CHECK (estado_boleta IN ('sin enviar', 'enviada')),
    getnet_session_id VARCHAR(255), -- Para relacionar con el pago
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Tabla de Documentos Adjuntos (Relacionados a una solicitud)
CREATE TABLE public.documentos_adjuntos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitud_id UUID REFERENCES public.solicitudes(id) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo TEXT NOT NULL, -- Ruta en Supabase Storage
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- TABLAS LEGACY (WEB EXISTENTE)
-- ==========================================

CREATE TABLE public.repertorio_conservador (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  interesado text NOT NULL,
  acto_o_contrato text NOT NULL,
  clase_inscripcion text NOT NULL,
  hora time without time zone NOT NULL,
  registro_parcial text NOT NULL,
  observaciones text,
  fecha date DEFAULT CURRENT_DATE,
  numero_inscripcion text,
  CONSTRAINT repertorio_conservador_pkey PRIMARY KEY (id)
);

CREATE TABLE public.repertorio_instrumentos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  fecha date NOT NULL,
  n_rep text NOT NULL,
  acto_o_contrato text NOT NULL,
  abogado_redactor text NOT NULL,
  n_agregado text,
  contratante_1_nombre text DEFAULT ''::text,
  contratante_1_apellido text DEFAULT ''::text,
  contratante_2_nombre text DEFAULT ''::text,
  contratante_2_apellido text DEFAULT ''::text,
  CONSTRAINT repertorio_instrumentos_pkey PRIMARY KEY (id)
);

-- Habilitar Row Level Security (RLS) en tablas legacy
ALTER TABLE public.repertorio_conservador ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repertorio_instrumentos ENABLE ROW LEVEL SECURITY;

-- Políticas para repertorio_conservador
-- Todo el mundo puede leer (modo invitado en web antigua)
CREATE POLICY "Public Read Access Cons" ON public.repertorio_conservador FOR SELECT TO public USING (true);
-- Empleados pueden insertar
CREATE POLICY "Empleados Insert Cons" ON public.repertorio_conservador FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios WHERE auth_id = auth.uid() AND rol = 'empleado')
);
-- Notario (Admin) puede hacer todo
CREATE POLICY "Admin Full Access Cons" ON public.repertorio_conservador FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.usuarios WHERE auth_id = auth.uid() AND rol = 'notario')
);

-- Políticas para repertorio_instrumentos
-- Todo el mundo puede leer (modo invitado en web antigua)
CREATE POLICY "Public Read Access Inst" ON public.repertorio_instrumentos FOR SELECT TO public USING (true);
-- Empleados pueden insertar
CREATE POLICY "Empleados Insert Inst" ON public.repertorio_instrumentos FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios WHERE auth_id = auth.uid() AND rol = 'empleado')
);
-- Notario (Admin) puede hacer todo
CREATE POLICY "Admin Full Access Inst" ON public.repertorio_instrumentos FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.usuarios WHERE auth_id = auth.uid() AND rol = 'notario')
);
