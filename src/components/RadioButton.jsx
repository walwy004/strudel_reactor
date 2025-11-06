function RadioButton({ btnId, onClick, backgroundColor }) {
    return (
        <button id={btnId} onClick={onClick}
            style={{
            width: '120px',
            height: '120px',
            backgroundColor: backgroundColor,
            borderRadius: '5px',
            margin: '5px'
        }}></button>
    );
}

export default RadioButton;