import InputForm from "./InputForm";

interface FilterRangeInputProps {
  label: string;
  minValue: number;
  maxValue: number;
  minName: string;
  maxName: string;
  onChange: any;
}

const FilterRangeInput: React.FC<FilterRangeInputProps> = ({
  minValue,
  maxValue,
  minName,
  maxName,
  label,
  onChange,
}) => {
  return (
    <div className="filter-range-input">
      <div className="header">{label}</div>
      <div className="input-container">
        <InputForm
          label={"Min"}
          placeHolder={""}
          type={"number"}
          name={minName}
          value={minValue}
          onChange={onChange}
        />
        <InputForm
          label={"Max"}
          placeHolder={""}
          type={"number"}
          name={maxName}
          value={maxValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default FilterRangeInput;
