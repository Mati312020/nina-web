/**
 * proximityHelper.js
 * Ordena un array de items priorizando los más cercanos a la ubicación del usuario.
 * Prioridad: misma localidad (0) > misma provincia (1) > otra zona (2)
 */

const normalize = (s) => (s || '').toLowerCase().trim();

/**
 * Calcula la proximidad de un item respecto a la ubicación del usuario.
 * @returns {'local'|'province'|'other'}
 */
export function getProximityLabel(item, userLocality, userProvince, localityKey, provinceKey) {
    const ul = normalize(userLocality);
    const up = normalize(userProvince);
    const il = normalize(item[localityKey]);
    const ip = normalize(item[provinceKey]);

    if (ul && il && il === ul) return 'local';
    if (up && ip && ip === up) return 'province';
    return 'other';
}

/**
 * Ordena items: misma localidad primero, luego misma provincia, luego el resto.
 */
export function sortByProximity(items, userLocality, userProvince, localityKey, provinceKey) {
    if (!userProvince && !userLocality) return items;

    const score = (item) => {
        const label = getProximityLabel(item, userLocality, userProvince, localityKey, provinceKey);
        return label === 'local' ? 0 : label === 'province' ? 1 : 2;
    };

    return [...items].sort((a, b) => score(a) - score(b));
}
