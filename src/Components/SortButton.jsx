function SortButton({ sortOrder, onToggle }) {
    const label =
        sortOrder === 'asc' ? 'Sort: A-Z ↑' :
        sortOrder === 'desc' ? 'Sort: Z-A ↓' :
        'Sort: Default';

    return (
        <button onClick={onToggle}>
            {label}
        </button>
    );
}

export default SortButton;