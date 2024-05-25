interface FilterRadioButtonProps {
	label: string;
	items: any;
	onChange: any;
	name: string;
	value: any;
}

const FilterRadioButton: React.FC<FilterRadioButtonProps> = ({
	label,
	items,
	name,
	value,
	onChange,
}) => {
	return (
		<div className="filter-radio-button">
			<div className="header">{label}</div>
			<div className="radio-button-container">
				{items.map((item: any) => (
					<div className="radio-button" key={item.value}>
						<input
							type="radio"
							name={name}
							value={item.value}
							checked={value == item.value}
							onChange={onChange}
						/>
						<label htmlFor={item.value}>{item.label}</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default FilterRadioButton;
