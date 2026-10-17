// Formatea un número como moneda y devuelve un string.
// value: monto a formatear.
// currency: código de moneda (por defecto CLP); locale: formato regional.
export function formatCurrency(value, currency = 'CLP', locale = 'es-CL') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    // CLP no usa centavos (0 decimales); el resto de monedas usa 2.
    maximumFractionDigits: currency === 'CLP' ? 0 : 2,
  }).format(value)
}
