function RadioButton({ name, onClick, backgroundColor }) {
    return (
        <button onClick={onClick}
            style={{
                width: '120px',
                height: '120px',
                backgroundColor: backgroundColor,
                borderRadius: '5px',
                margin: '5px',
                fontSize: '12px'
            }}>
            {name}
        </button>
    );
}

export default RadioButton;