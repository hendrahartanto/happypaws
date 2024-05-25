interface EmptyProps {
  label: string;
}

const Empty: React.FC<EmptyProps> = ({ label }) => {
  return <div className="empty">{label}</div>;
};

export default Empty;
