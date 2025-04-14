import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import useNavigationStore from "../../hooks/useNavigationStore";

const AllowDrawingButton: React.FC = () => {
  const { isDrawingEnabled, hasDrawn, setDrawingEnabled } =
    useNavigationStore();

  return (
    <>
      <button
        className={`allow-drawing-button ${isDrawingEnabled ? "cancel" : ""} ${
          hasDrawn ? "disabled" : ""
        }`}
        onClick={() => setDrawingEnabled(!isDrawingEnabled)}
        data-tooltip-id="allow-button-tooltip"
        data-tooltip-content={isDrawingEnabled ? "Zrušit" : "Začít kreslit"}
        data-tooltip-place="top">
        <FontAwesomeIcon icon={isDrawingEnabled ? faTimes : faPencilAlt} />
      </button>
      <Tooltip id="allow-button-tooltip" />
    </>
  );
};

export default AllowDrawingButton;
