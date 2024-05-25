import React from "react";

interface InputFormProps {
  label: any;
  placeHolder: string;
  type: string;
  name: string;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  label,
  placeHolder,
  type,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="input-form">
      <p className={type == "file" ? "file" : ""}>{label}</p>
      <input
        className={
          type == "date"
            ? "date"
            : type == "checkbox"
            ? "checkbox"
            : type == "file"
            ? "file"
            : ""
        }
        checked={value}
        placeholder={placeHolder}
        name={name}
        value={value}
        required
        type={type}
        onChange={onChange}
      />
    </div>
  );
};

export default InputForm;
