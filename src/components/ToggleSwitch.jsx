function ToggleSwitch({ value, onToggle }) {
	return (
		<button
			className={`toggle-btn ${value ? "toggled" : ""}`}
			onClick={() => onToggle(!value)}
		>
			<div className="thumb"></div>
		</button>
	);
}

export default ToggleSwitch;