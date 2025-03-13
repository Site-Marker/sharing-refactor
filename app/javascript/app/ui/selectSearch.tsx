import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select";

type Option = { value: number; label: string };

type Props = {
  options: Option[];
  onValueChange: (arg: SingleValue<Option>) => void;
  placeholder: string;
  value?: SingleValue<Option>;
};

const SelectSearch = ({
  options,
  onValueChange,
  placeholder,
  value,
}: Props) => {
  const customStyles: StylesConfig<Option, false> = {
    container: (p) => ({
      ...p,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: 36,
      height: 36,
      backgroundColor: "rgb(55, 65, 81)",
      color: "white",
      borderWidth: 0.5,
      borderColor: "rgb(75, 85, 99)",
      "&:focus-within": {
        borderColor: "#718096",
        boxShadow: "0 0 0 1px #718096",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#2d3748" : "rgb(55, 65, 81)",
      color: "white",
      "&:active": {
        backgroundColor: "#2d3748",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(55, 65, 81)",
      borderColor: "rgb(75, 85, 99)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0aec0",
      fontSize: "14px",
    }),
  };

  return (
    <Select<Option, false>
      key={`my_unique_select_key__${value}`}
      options={options}
      onChange={onValueChange}
      styles={customStyles}
      placeholder={placeholder}
      autoFocus={false}
      value={value}
    />
  );
};

export default SelectSearch;
