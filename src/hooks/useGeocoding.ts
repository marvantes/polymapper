import { useState } from "react";
import axios from "axios";
import { fromLonLat } from "ol/proj";

interface GeocodingResult {
  center: [number, number] | null;
  zoom: number;
  error: string | null;
  errorCount: number;
  searchAddress: (query: string) => Promise<void>;
}

const useGeocoding = (
  initialCenter: [number, number],
  initialZoom: number
): GeocodingResult => {
  const [errorCount, setErrorCount] = useState(0);
  const [center, setCenter] = useState<[number, number] | null>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = async (query: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCenter(
          fromLonLat([parseFloat(lon), parseFloat(lat)]) as [number, number]
        );
        setZoom(10);
        setError(null);
      } else {
        setError("Adresa nebyla nalezena.");
        setErrorCount((prevCount: number) => prevCount + 1);
      }
    } catch (error) {
      setError("Chyba při vyhledávání adresy.");
      setErrorCount((prevCount: number) => prevCount + 1);
    }
  };

  return { center, zoom, error, errorCount, searchAddress };
};

export default useGeocoding;
