import { ChangeEvent } from "react";

interface Option {
  id: string | number;
  name: string;
}

interface SelectFormProps {
  name: string;
  value: string | number;
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

const SelectForm: React.FC<SelectFormProps> = ({
  name,
  value,
  options,
  onChange,
  label,
}) => {
  return (
    <div className="select-form">
      <p>{label}</p>
      <div className="container">
        <select value={value} onChange={onChange} name={name}>
          <option value="" disabled hidden>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectForm;
