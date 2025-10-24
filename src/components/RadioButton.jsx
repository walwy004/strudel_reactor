function RadioButton({ backgroundColor }) {
    return (
        <button style={{
            width: '150px',
            height: '150px',
            backgroundColor: backgroundColor,
            borderRadius: '5px',
            margin: '5px'
        }}></button>
    );
}

export default RadioButton;