import React, { useState } from "react";
import SearchInput from "./SearchInput";
import SearchButton from "./SearchButton";
import useNavigationStore from "../../hooks/useNavigationStore";
import { NavigationProps } from "../../interfaces/NavigationProps";

const AdressSearch: React.FC<NavigationProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDrawingEnabled } = useNavigationStore();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="adress-search">
      <SearchInput value={searchQuery} onChange={handleInputChange} />
      <SearchButton onClick={handleSearchClick} />
      {isDrawingEnabled ? <p>Poslední bod zadáte dvojklikem.</p> : null}
    </div>
  );
};

export default AdressSearch;
