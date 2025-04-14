import AdressSearch from "../components/navigationComponents/AdressSearch";
import { NavigationProps } from "../interfaces/NavigationProps";
import AllowDrawingButton from "./navigationComponents/AllowDrawingButton";
import SaveDrawingButton from "./navigationComponents/SaveDrawingButton";
import "../styles/Navigation.less";
import ResetButton from "./navigationComponents/ResetButton";
import EditButton from "./navigationComponents/EditButton";

const Navigation: React.FC<NavigationProps> = ({ onSearch }) => {
  return (
    <header className="header">
      <div className="wrap">
        <AdressSearch onSearch={onSearch} />

        <ResetButton />
        <div className="action-buttons">
          <AllowDrawingButton />
          <SaveDrawingButton />
          <EditButton />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
