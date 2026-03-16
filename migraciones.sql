-- Archivo de migraciones manuales
-- Inserta al usuario "hector lohaus" como notario y rescata el email de auth.users

INSERT INTO public.usuarios (auth_id, nombre, email, rol, sueldo, activo, creado_en)
SELECT 
    '86659a26-8ce7-433f-8a17-96d1026f71cc',
    'hector lohaus',
    email,
    'notario',
    850000,
    true,
    NOW()
FROM auth.users
WHERE id = '86659a26-8ce7-433f-8a17-96d1026f71cc'
ON CONFLICT (auth_id) 
DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    rol = EXCLUDED.rol,
    sueldo = EXCLUDED.sueldo,
    activo = EXCLUDED.activo;
