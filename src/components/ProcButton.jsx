function ProcButton({ btnId, name }) {
    return (
        <button id={btnId} className="btn btn-outline-primary">{name}</button>
    );
}

export default ProcButton;