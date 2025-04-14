import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateBack } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import useNavigationStore from "../../hooks/useNavigationStore";
import useMapStore from "../../hooks/useMapStore";

const ResetButton: React.FC = () => {
  const { isCreated, hasDrawn, setCreated, reset } = useNavigationStore();
  const { resetMapStore } = useMapStore();

  const handleClick = () => {
    setCreated(!isCreated);
    reset();
    resetMapStore();
  };

  return (
    <>
      <button
        className={`reset-button ${hasDrawn ? "open" : ""}`}
        onClick={handleClick}
        data-tooltip-id="reset-button-tooltip"
        data-tooltip-content={"Začít znovu"}
        data-tooltip-place="top">
        <FontAwesomeIcon icon={faRotateBack} />
      </button>
      <Tooltip id="reset-button-tooltip" />
    </>
  );
};

export default ResetButton;
