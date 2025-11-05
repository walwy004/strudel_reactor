function RadioButton({ backgroundColor }) {
    return (
        <button style={{
            width: '120px',
            height: '120px',
            backgroundColor: backgroundColor,
            borderRadius: '5px',
            margin: '5px'
        }}></button>
    );
}

export default RadioButton;