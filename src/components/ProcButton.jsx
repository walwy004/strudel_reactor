function ProcButton({ btnId, name, backgroundColor, onClick }) {
    return (
        <button
            onClick={onClick} id={btnId} className="btn"
            style={{
                width: '60px',
                height: '40px',
                backgroundColor: backgroundColor,
                color: "black",
                border: "2px solid black",
                borderRadius: "0px",
                margin: "5px"
            }}>
            {name}
        </button>
    );
}

export default ProcButton;