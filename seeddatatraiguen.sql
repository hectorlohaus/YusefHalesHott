-- ==========================================
-- SCRIPT DE MIGRACIÓN: NUEVOS USUARIOS EMPLEADOS
-- ==========================================

-- 1. Insertamos en auth.users
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
  created_at, updated_at, raw_user_meta_data
) VALUES 
('11111111-1111-4111-a111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c.aguilera@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"CAROLINA ANDREA AGUILERA NAVARRETE","rut":"16.532.769-3"}'),
('22222222-2222-4222-a222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c.bizama@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"CARLOS PATRICIO BIZAMA MUÑOZ","rut":"12.921.044-3"}'),
('33333333-3333-4333-a333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 't.morales@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"TERESA GRUNILDA MORALES VENEGAS","rut":"5.537.72-6"}'),
('44444444-4444-4444-a444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'i.pirce@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"IVAN BORIS PIRCE VALENZUELA","rut":"10.794.291-2"}'),
('55555555-5555-4555-a555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'i.silva@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"IRIS ISABEL SILVA ZENTENO","rut":"8.141.512-9"}'),
('66666666-6666-4666-a666-666666666666', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.venegas@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"SYLVIA ELIANA VENEGAS LOPEZ","rut":"12.040.118-1"}'),
('77777777-7777-4777-a777-777777777777', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f.herrera@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"FERNANDA GUISELLA HERRERA CAYUL","rut":"21.347.962-8"}'),
('88888888-8888-4888-a888-888888888888', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.sepulveda@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"ALFREDO ENRIQUE SEPULVEDA CIFUENTES","rut":"8.653.188-7"}'),
('99999999-9999-4999-a999-999999999999', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'j.leiva@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"JULIO ALBERTO LEIVA BARRERA","rut":"8.512.061-1"}'),
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.silva@notariatraiguen.cl', crypt('Notaria2024!', gen_salt('bf')), now(), now(), now(), '{"name":"LYLI MARLEN SILVA ORELLANA","rut":"19.988.109-4"}');

-- 2. Insertamos en auth.identities
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES 
(gen_random_uuid(), '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', format('{"sub":"%s","email":"%s"}', '11111111-1111-4111-a111-111111111111', 'c.aguilera@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-222222222222', format('{"sub":"%s","email":"%s"}', '22222222-2222-4222-a222-222222222222', 'c.bizama@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '33333333-3333-4333-a333-333333333333', '33333333-3333-4333-a333-333333333333', format('{"sub":"%s","email":"%s"}', '33333333-3333-4333-a333-333333333333', 't.morales@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '44444444-4444-4444-a444-444444444444', '44444444-4444-4444-a444-444444444444', format('{"sub":"%s","email":"%s"}', '44444444-4444-4444-a444-444444444444', 'i.pirce@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '55555555-5555-4555-a555-555555555555', '55555555-5555-4555-a555-555555555555', format('{"sub":"%s","email":"%s"}', '55555555-5555-4555-a555-555555555555', 'i.silva@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '66666666-6666-4666-a666-666666666666', '66666666-6666-4666-a666-666666666666', format('{"sub":"%s","email":"%s"}', '66666666-6666-4666-a666-666666666666', 's.venegas@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '77777777-7777-4777-a777-777777777777', '77777777-7777-4777-a777-777777777777', format('{"sub":"%s","email":"%s"}', '77777777-7777-4777-a777-777777777777', 'f.herrera@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '88888888-8888-4888-a888-888888888888', '88888888-8888-4888-a888-888888888888', format('{"sub":"%s","email":"%s"}', '88888888-8888-4888-a888-888888888888', 'a.sepulveda@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), '99999999-9999-4999-a999-999999999999', '99999999-9999-4999-a999-999999999999', format('{"sub":"%s","email":"%s"}', '99999999-9999-4999-a999-999999999999', 'j.leiva@notariatraiguen.cl')::jsonb, 'email', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', format('{"sub":"%s","email":"%s"}', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'l.silva@notariatraiguen.cl')::jsonb, 'email', now(), now(), now());

-- 3. Insertamos en public.usuarios (perfiles de empleados vinculados)
INSERT INTO public.usuarios (id, auth_id, rol, nombre, email, sueldo, activo, rut) VALUES 
('11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 'empleado', 'CAROLINA ANDREA AGUILERA NAVARRETE', 'c.aguilera@notariatraiguen.cl', 0.00, true, '16.532.769-3'),
('22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-222222222222', 'empleado', 'CARLOS PATRICIO BIZAMA MUÑOZ', 'c.bizama@notariatraiguen.cl', 0.00, true, '12.921.044-3'),
('33333333-3333-4333-a333-333333333333', '33333333-3333-4333-a333-333333333333', 'empleado', 'TERESA GRUNILDA MORALES VENEGAS', 't.morales@notariatraiguen.cl', 0.00, true, '5.537.72-6'),
('44444444-4444-4444-a444-444444444444', '44444444-4444-4444-a444-444444444444', 'empleado', 'IVAN BORIS PIRCE VALENZUELA', 'i.pirce@notariatraiguen.cl', 0.00, true, '10.794.291-2'),
('55555555-5555-4555-a555-555555555555', '55555555-5555-4555-a555-555555555555', 'empleado', 'IRIS ISABEL SILVA ZENTENO', 'i.silva@notariatraiguen.cl', 0.00, true, '8.141.512-9'),
('66666666-6666-4666-a666-666666666666', '66666666-6666-4666-a666-666666666666', 'empleado', 'SYLVIA ELIANA VENEGAS LOPEZ', 's.venegas@notariatraiguen.cl', 0.00, true, '12.040.118-1'),
('77777777-7777-4777-a777-777777777777', '77777777-7777-4777-a777-777777777777', 'empleado', 'FERNANDA GUISELLA HERRERA CAYUL', 'f.herrera@notariatraiguen.cl', 0.00, true, '21.347.962-8'),
('88888888-8888-4888-a888-888888888888', '88888888-8888-4888-a888-888888888888', 'empleado', 'ALFREDO ENRIQUE SEPULVEDA CIFUENTES', 'a.sepulveda@notariatraiguen.cl', 0.00, true, '8.653.188-7'),
('99999999-9999-4999-a999-999999999999', '99999999-9999-4999-a999-999999999999', 'empleado', 'JULIO ALBERTO LEIVA BARRERA', 'j.leiva@notariatraiguen.cl', 0.00, true, '8.512.061-1'),
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'empleado', 'LYLI MARLEN SILVA ORELLANA', 'l.silva@notariatraiguen.cl', 0.00, true, '19.988.109-4');
