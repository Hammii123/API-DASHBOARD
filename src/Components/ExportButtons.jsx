function ExportButtons({ data }) {

    const downloadFile = (content, fileName, type) => {
        const blob = new Blob(
            [content],
            { type }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };


    const exportJSON = () => {

        if (!data || data.length === 0) {
            alert("No generated data available.");
            return;
        }

        const jsonData = JSON.stringify(
            data,
            null,
            2
        );

        downloadFile(
            jsonData,
            "synthetic-data.json",
            "application/json"
        );
    };


    const exportCSV = () => {

        if (!data || data.length === 0) {
            alert("No generated data available.");
            return;
        }

        const columns = Object.keys(data[0]);

        const header = columns.join(",");

        const rows = data.map((row) => {

            return columns
                .map((column) => {

                    const value = row[column];

                    if (
                        typeof value === "object" &&
                        value !== null
                    ) {
                        return `"${JSON.stringify(value)
                            .replace(/"/g, '""')}"`;
                    }

                    return `"${String(value ?? "")
                        .replace(/"/g, '""')}"`;
                })
                .join(",");
        });

        const csv = [
            header,
            ...rows
        ].join("\n");

        downloadFile(
            csv,
            "synthetic-data.csv",
            "text/csv"
        );
    };


    return (
        <div className="export-buttons">

            <h2>Export Data</h2>

            <div className="export-actions">

                <button
                    onClick={exportCSV}
                    disabled={!data || data.length === 0}
                >
                    Download CSV
                </button>

                <button
                    onClick={exportJSON}
                    disabled={!data || data.length === 0}
                >
                    Download JSON
                </button>

            </div>

        </div>
    );
}

export default ExportButtons;