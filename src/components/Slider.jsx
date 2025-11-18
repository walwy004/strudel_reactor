function Slider({ sliderId, name, onSlider }) {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			marginTop: '100px'
		}}>
			<input min="0" max="2" step="0.1" onMouseUp={onSlider} type="range" className="form-range" id={sliderId} defaultValue="0"
				style={{
					transform: 'rotate(-90deg)',
					transformOrigin: 'center',
					width: '200px',
					margin: '0px'
				}}>
			</input>
			<label htmlFor={sliderId} className="form-label"
				style={{ textAlign: 'center', marginTop: '90px' }}
			>
			{name}
			</label>
		</div>
	);
}

export default Slider;