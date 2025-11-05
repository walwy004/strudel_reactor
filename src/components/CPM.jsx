function CPM() {
	return (
		<div className="input-group"
			style={{
				width: '140px'
			}}>
			<span className="input-group-text" id="cpmId"
				style={{
					backgroundColor: 'grey',
					border: "1px solid black"
				}}
			>CPM</span>
			<input type="text" class="form-control" placeholder="120"
				style={{
					backgroundColor: 'white',
					border: "1px solid black"
				}}
			></input>
		</div>
	);
}

export default CPM;