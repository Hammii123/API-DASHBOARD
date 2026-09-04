function SearchBar({ value, onChange }) {
    return (
        <input
            type="text"
            placeholder="Search by name or email..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ padding: '6px 10px', marginRight: '10px' }}
        />
    );
}

export default SearchBar;