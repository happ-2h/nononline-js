/**
 * @brief Restricts num to the provided minimum and maximum
 *
 * @param {Number} num - Number to restrict
 * @param {Number} min - Minimum bound
 * @param {Number} max - Maximum bound
 *
 * @returns A number bound to the limits
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);