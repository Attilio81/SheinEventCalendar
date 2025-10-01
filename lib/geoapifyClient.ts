export const geoapifyApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

if (!geoapifyApiKey) {
    throw new Error("La chiave API di Geoapify non è stata impostata nelle variabili d'ambiente.");
}
