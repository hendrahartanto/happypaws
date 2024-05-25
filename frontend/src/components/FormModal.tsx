import React, { useState } from "react";
import InputForm from "./InputForm";
import closeIcon from "../assets/UI/close.svg";
import SelectForm from "./SelectForm";
import ButtonOrange from "./ButtonOrange";

interface FormModalProps {
  isOpen: boolean;
  onSubmit: (formData: FormData) => void;
  inputFormFields?: any;
  selectFormFields?: any;
  checkBoxFormFields?: any;
  numberFormFields?: any;
  modalFormData: any;
  title?: string;
  bookStartDate?: any | null;
  bookEndDate?: any | null;
  bookPrice?: number | null;
  modalError: any;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onSubmit,
  inputFormFields = null,
  selectFormFields = null,
  modalFormData,
  title = null,
  bookStartDate = null,
  bookEndDate = null,
  bookPrice = null,
  checkBoxFormFields = null,
  onClose,
  modalError,
  numberFormFields = null,
}) => {
  let currIndex = 0;

  const [formData, setFormData] = useState<any>(modalFormData);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    let inputValue;

    if (type === "checkbox") {
      inputValue = checked;
    } else if (name === "rating") {
      inputValue = Math.max(0, Math.min(10, parseInt(value, 10))) || 0;
    } else {
      inputValue = value;
    }

    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-modal">
      <div className={`overlay ${isOpen ? "open" : ""}`}></div>
      <div className={`form-modal-container ${isOpen ? "open" : ""}`}>
        <div className="exit">
          <img src={closeIcon} alt="" onClick={onClose} />
        </div>
        <div className="title">{title}</div>
        {bookStartDate != null && (
          <div className="book-date-container">
            <p>Start date: {bookStartDate}</p>
            <p>End date: {bookEndDate}</p>
          </div>
        )}
        {selectFormFields != null && (
          <div className="select-form-container">
            {selectFormFields.map((field: any, index: number) => (
              <SelectForm
                key={index}
                options={field.options.map(
                  (item: { id: number; name: string }) => ({
                    id: item.id,
                    name: item.name,
                  })
                )}
                label={field.label}
                name={field.name}
                value={formData[(currIndex = index)]}
                onChange={handleChange}
              />
            ))}
          </div>
        )}
        {inputFormFields != null && (
          <div className="input-form-container">
            {inputFormFields.map((field: any, index: number) => (
              <InputForm
                key={index}
                label={field.label}
                placeHolder={field.placeHolder}
                type={field.type}
                name={field.name}
                value={formData[index]}
                onChange={handleChange}
              />
            ))}
          </div>
        )}
        {bookPrice != null && (
          <div className="book-price">
            {bookPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "iDR",
            })}
          </div>
        )}
        {numberFormFields != null && (
          <InputForm
            type="number"
            value={formData.rating}
            name={numberFormFields.name}
            label={numberFormFields.label}
            onChange={handleChange}
            placeHolder=""
          />
        )}
        {checkBoxFormFields != null && (
          <InputForm
            type={"checkbox"}
            value={formData[currIndex]}
            name={checkBoxFormFields.name}
            placeHolder=""
            label={checkBoxFormFields.label}
            onChange={handleChange}
          />
        )}
        {modalError.isError && (
          <div className="error">{modalError.erroeMessage}</div>
        )}
        <div className="submit-button">
          <ButtonOrange
            label="Confirm"
            onClick={handleSubmit}
            type={"submit"}
          />
        </div>
      </div>
    </div>
  );
};

export default FormModal;
