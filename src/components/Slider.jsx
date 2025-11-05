function Slider({ sliderId, name }) {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			marginTop: '100px'
		}}>
			<input type="range" className="form-range" id={sliderId}
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