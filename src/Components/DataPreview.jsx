function DataPreview({ data }) {
    if (!data || data.length === 0) {
        return null;
    }

    const columns = Object.keys(data[0]);

    return (
        <div className="data-preview">

            <div className="preview-header">
                <div>
                    <h2>Generated Data Preview</h2>
                    <p>
                        Showing {data.length} generated records
                    </p>
                </div>
            </div>

            <div className="preview-table-wrapper">
                <table className="preview-table">

                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column}>
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.slice(0, 20).map((row, index) => (
                            <tr key={index}>
                                {columns.map((column) => (
                                    <td key={column}>
                                        {typeof row[column] === "object"
                                            ? JSON.stringify(row[column])
                                            : String(row[column] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {data.length > 20 && (
                <p className="preview-note">
                    Showing first 20 records out of {data.length}.
                </p>
            )}

        </div>
    );
}

export default DataPreview;