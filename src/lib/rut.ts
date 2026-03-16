/**
 * Valida un RUT chileno en múltiples formatos (ej. 12345678-9, 12.345.678-9, 123456789)
 */
export function validateRut(rut: string): boolean {
  if (!rut || typeof rut !== 'string') return false;

  // Limpiar el string de puntos y guiones
  let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  if (cleanRut.length < 2) return false;

  // Separar cuerpo y dígito verificador
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  // Calcular Dígito Verificador esperado
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += multiplier * parseInt(body.charAt(i), 10);
    multiplier = multiplier < 7 ? multiplier + 1 : 2;
  }

  const dvExpected = 11 - (sum % 11);
  const dvReal = dvExpected === 11 ? '0' : dvExpected === 10 ? 'K' : dvExpected.toString();

  return dv === dvReal;
}

/**
 * Formatea un RUT al estándar XX.XXX.XXX-X
 */
export function formatRut(rut: string | undefined): string {
  if (!rut) return '';
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanRut.length < 2) return cleanRut;

  let result = cleanRut.slice(-4, -1) + '-' + cleanRut.substr(cleanRut.length - 1);
  for (let i = 4; i < cleanRut.length; i += 3) {
    result = cleanRut.slice(-3 - i, -i) + '.' + result;
  }
  return result;
}
