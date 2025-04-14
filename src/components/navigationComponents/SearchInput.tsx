import React from "react";
import { SearchInputProps } from "../../interfaces/NavigationProps";

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Zadejte adresu..."
      value={value}
      onChange={onChange}
      className="adress-search-input"
    />
  );
};

export default SearchInput;
