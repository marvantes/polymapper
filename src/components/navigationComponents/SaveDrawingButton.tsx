import React from "react";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import useNavigationStore from "../../hooks/useNavigationStore";

const SaveDrawingButton: React.FC = () => {
  const { isSaving, isEditEnabled, setSaving } = useNavigationStore();

  return (
    <>
      <button
        className={`save-drawing-button ${isEditEnabled ? "open" : ""} ${
          isEditEnabled ? "editOpen" : ""
        }`}
        onClick={() => setSaving(!isSaving)}
        data-tooltip-id="save-button-tooltip"
        data-tooltip-content="Ukončit editaci"
        data-tooltip-place="top">
        <FontAwesomeIcon icon={faClose} />
      </button>
      <Tooltip id="save-button-tooltip" />
    </>
  );
};

export default SaveDrawingButton;
