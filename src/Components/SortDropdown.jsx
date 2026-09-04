import { useState, useRef, useEffect } from 'react';

function SortDropdown({ sortKey, sortOptions, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Outside click pe dropdown close karo
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (key) => {
        onChange(key);
        setIsOpen(false);
    };

    return (
        <div className="sort-dropdown" ref={dropdownRef}>
            <button
                className={`sort-dropdown-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>Sort: {sortOptions[sortKey].label}</span>
                <span className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}>▾</span>
            </button>

            {isOpen && (
                <ul className="sort-dropdown-menu">
                    {Object.entries(sortOptions).map(([key, option]) => (
                        <li
                            key={key}
                            className={`sort-dropdown-item ${key === sortKey ? 'selected' : ''}`}
                            onClick={() => handleSelect(key)}
                        >
                            {option.label}
                            {key === sortKey && <span className="check-mark">✓</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SortDropdown;