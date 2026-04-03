"use client";

import Select, { StylesConfig } from "react-select";

export interface SelectOption {
  value: number | string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  isLoading?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  isLoading = false,
  isClearable = false,
  isDisabled = false,
}: SearchableSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  // Custom styles với support cho dark mode qua Tailwind CSS classes
  const customStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--select-bg, #ffffff)",
      borderColor: state.isFocused
        ? "#3b82f6"
        : "var(--select-border, #d1d5db)",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      minHeight: "38px",
      fontSize: "0.875rem",
      transition: "all 0.2s",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--select-menu-bg, #ffffff)",
      border: "1px solid var(--select-border, #e5e7eb)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      zIndex: 50,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "var(--select-option-hover, #dbeafe)"
        : state.isSelected
        ? "#3b82f6"
        : "var(--select-option-bg, #ffffff)",
      color: state.isSelected
        ? "#ffffff"
        : "var(--select-text, #111827)",
      cursor: "pointer",
      fontSize: "0.875rem",
      padding: "8px 12px",
      borderRadius: "4px",
      transition: "background-color 0.15s",
      "&:active": {
        backgroundColor: "var(--select-option-active, #bfdbfe)",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--select-text, #111827)",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "var(--select-text, #111827)",
      fontSize: "0.875rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--select-placeholder, #6b7280)",
      fontSize: "0.875rem",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "var(--select-border, #d1d5db)",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--select-icon, #6b7280)",
      "&:hover": {
        color: "var(--select-icon-hover, #111827)",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "var(--select-icon, #6b7280)",
      "&:hover": {
        color: "#dc2626",
      },
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: "#3b82f6",
    }),
  };

  return (
    <Select<SelectOption, false>
      value={selectedOption}
      onChange={(option) => onChange(option?.value || "all")}
      options={options}
      placeholder={placeholder}
      isSearchable={true}
      isLoading={isLoading}
      isClearable={isClearable}
      isDisabled={isDisabled}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={customStyles}
      noOptionsMessage={() => "Không tìm thấy kết quả"}
      loadingMessage={() => "Đang tải..."}
    />
  );
}
