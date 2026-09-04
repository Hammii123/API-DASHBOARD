import SearchBar from "./Searchbar";
import SortDropdown from "./SortDropdown";

function Header({ searchTerm, onSearchChange, sortKey, sortOptions, onSortChange }) {
    return (
        <header className="dashboard-header">
            <div className="header-logo">
                <span className="logo-icon">⚡</span>
                <span className="logo-text">API Dashboard</span>
            </div>

            <div className="header-controls">
                <SearchBar value={searchTerm} onChange={onSearchChange} />
                <SortDropdown sortKey={sortKey} sortOptions={sortOptions} onChange={onSortChange} />
            </div>
        </header>
    );
}

export default Header;