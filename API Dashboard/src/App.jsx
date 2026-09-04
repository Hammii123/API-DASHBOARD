import useFetch from "./Hooks/useFetch";
import useTableFilter from "./Hooks/useTableFilter";
import Header from "./Components/Header";
import UserTable from "./Components/UserTable";
import "./App.css";

function App() {
    const { data, loading, error, refetch } = useFetch("https://jsonplaceholder.typicode.com/users");

    const { filteredData, searchTerm, setSearchTerm, sortKey, setSortKey, sortOptions } =
        useTableFilter(data, ['name', 'email', 'username']);

    if (loading) {
        return (
            <div className="status-message">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="status-message">
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={refetch}>Retry</button>
            </div>
        );
    }

    if (data.length === 0) {
        return <p className="status-message empty-message">No user found</p>;
    }

    return (
        <div className="dashboard-container">
            <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortKey={sortKey}
                sortOptions={sortOptions}
                onSortChange={setSortKey}
            />

            <div className="table-wrapper">
                {filteredData.length === 0 ? (
                    <p className="empty-message">No matching results</p>
                ) : (
                    <UserTable data={filteredData} />
                )}
            </div>
        </div>
    );
}

export default App;