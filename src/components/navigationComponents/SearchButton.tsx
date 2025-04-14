import React from "react";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SearchButtonProps } from "../../interfaces/NavigationProps";

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="adress-search-button"
        data-tooltip-id="search-button-tooltip"
        data-tooltip-content="Vyhledat"
        data-tooltip-place="top">
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <Tooltip id="search-button-tooltip" />
    </>
  );
};

export default SearchButton;
