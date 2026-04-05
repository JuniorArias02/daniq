/**
 * currencyFormatter: Helpers para formatear dinero en Pesos Colombianos (COP)
 */

/**
 * Formatea un número a Pesos Colombianos con el estilo estándar.
 * Ej: 50000 -> $ 50.000
 */
export const formatearCOP = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

/**
 * Formatea un número de forma abreviada para tarjetas pequeñas.
 * Ej: 1200000 -> 1.2M
 */
export const formatearCOPResumen = (valor: number): string => {
    if (valor >= 1000000) {
        return `${(valor / 1000000).toFixed(1)}M`;
    }
    if (valor >= 1000) {
        return `${(valor / 1000).toFixed(0)}k`;
    }
    return valor.toString();
};
