function ToggleSwitch({ name, value, onToggle }) {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center'
		}}>
			<button
				className={`toggle-btn ${value ? "toggled" : ""}`}
				onClick={() => onToggle(!value)}>

				<div className="thumb"></div>
			</button>
			<label className="form-label" style={{ fontSize: "12px", margin: 0 }}>{name}</label>
		</div>
	);
}

export default ToggleSwitch;