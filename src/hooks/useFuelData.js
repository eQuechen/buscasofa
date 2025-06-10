import {fetchFuelPrices} from "@/apis/fuelApiLib.js";

export const loadStations = async (setStations, setError, setLoading) => {
    try {
        const data = await fetchFuelPrices();
        setStations(data.ListaEESSPrecio);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
