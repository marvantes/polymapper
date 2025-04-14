import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import MapOpenLayers from "../components/mapComponents/MapOpenLayers";
import Navigation from "../components/Navigation";
import useGeocoding from "../hooks/useGeocoding";
import "../styles/HomePage.less";
import "react-toastify/dist/ReactToastify.css";
import DrawnLines from "../components/mapComponents/DrawLines";

const HomePage = () => {
  const { center, zoom, error, errorCount, searchAddress } = useGeocoding(
    [10936462.11, 892671.88],
    10
  );

  const handleSearch = (query: string) => {
    searchAddress(query);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, errorCount]);

  return (
    <section className="homePage">
      <Navigation onSearch={handleSearch} />
      <ToastContainer />
      <DrawnLines />
      <MapOpenLayers center={center || [0, 0]} zoom={zoom} />
    </section>
  );
};

export default HomePage;
