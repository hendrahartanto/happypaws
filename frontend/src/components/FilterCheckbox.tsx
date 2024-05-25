interface FilterCheckboxProps {
  filterItems: any;
  handleChange: any;
  label: string;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  filterItems,
  handleChange,
  label,
}) => {
  return (
    <div className="filter-checkbox">
      <div className="header">{label}</div>
      <div className="checkbox-container">
        {Object.entries(filterItems).map(([name, value]: any) => (
          <label key={name}>
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={handleChange}
            />
            {name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterCheckbox;
