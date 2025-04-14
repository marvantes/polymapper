import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import useNavigationStore from "../../hooks/useNavigationStore";

const EditButton: React.FC = () => {
  const { isEditEnabled, hasDrawn, setEditEnabled } = useNavigationStore();

  return (
    <>
      <button
        className={`edit-drawing-button ${isEditEnabled ? "hide" : ""} ${
          hasDrawn ? "enabled" : ""
        }`}
        onClick={() => setEditEnabled(!isEditEnabled)}
        data-tooltip-id="edit-button-tooltip"
        data-tooltip-content={"Upravit drag & drop"}
        data-tooltip-place="top">
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <Tooltip id="edit-button-tooltip" />
    </>
  );
};

export default EditButton;
