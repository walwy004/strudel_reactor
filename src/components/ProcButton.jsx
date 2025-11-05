function ProcButton({ btnId, name }) {
    return (
        <button
            id={btnId}
            className="btn btn-outline-primary"
            style={{
                margin: "5px"
            }}>
            {name}
        </button>
    );
}

export default ProcButton;