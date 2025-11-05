import { useState } from "react";

function ToggleSwitch() {
	const [toggled, setToggle] = useState(false)

	return (
		<button
			className={`toggle-btn ${toggled ? "toggled" : ""}`}
			onClick={() => setToggle(!toggled)}
		>
			<div className="thumb"></div>
		</button>
	);
}

export default ToggleSwitch;