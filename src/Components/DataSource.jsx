import { useState } from "react";

function DataSource({ onDataLoad }) {
    const [sourceType, setSourceType] = useState("api");

    const [apiUrl, setApiUrl] = useState(
        "https://jsonplaceholder.typicode.com/users"
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLoadData = async () => {
        if (!apiUrl.trim()) {
            setError("Please enter an API URL.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(
                    `Server error: ${response.status}`
                );
            }

            const result = await response.json();

            if (!Array.isArray(result)) {
                throw new Error(
                    "API response must be an array."
                );
            }

            console.log("API Data:", result);

            onDataLoad(result);

        } catch (error) {
            console.error("API Error:", error);

            setError(
                error.message || "Failed to load data."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleJSONUpload = (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {

        try {

            const result = JSON.parse(e.target.result);

            if (!Array.isArray(result)) {
                throw new Error(
                    "JSON data must be an array."
                );
            }

            console.log("JSON Data:", result);

            onDataLoad(result);

        } catch (error) {

            console.error(
                "JSON Error:",
                error
            );

            setError(
                error.message ||
                "Invalid JSON file."
            );
        }
    };

    reader.onerror = () => {
        setError("Failed to read JSON file.");
    };

    reader.readAsText(file);
};

const handleCSVUpload = (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {

        try {

            const text = e.target.result;

            const lines = text
                .split(/\r?\n/)
                .filter((line) => line.trim() !== "");

            if (lines.length < 2) {
                throw new Error(
                    "CSV file must contain headers and data."
                );
            }

            const headers = lines[0]
                .split(",")
                .map((header) => header.trim());

            const result = lines
                .slice(1)
                .map((line) => {

                    const values = line
                        .split(",")
                        .map((value) => value.trim());

                    const row = {};

                    headers.forEach((header, index) => {
                        row[header] = values[index] || "";
                    });

                    return row;
                });

            console.log("CSV Data:", result);

            onDataLoad(result);

        } catch (error) {

            console.error(
                "CSV Error:",
                error
            );

            setError(
                error.message ||
                "Invalid CSV file."
            );
        }
    };

    reader.onerror = () => {
        setError("Failed to read CSV file.");
    };

    reader.readAsText(file);
};



    return (
        <div className="data-source">

            <h2>Data Source</h2>

            <div className="source-types">

                <button
                    onClick={() => setSourceType("api")}
                    className={
                        sourceType === "api"
                            ? "active"
                            : ""
                    }
                >
                    API
                </button>

                <button
                    onClick={() => setSourceType("json")}
                    className={
                        sourceType === "json"
                            ? "active"
                            : ""
                    }
                >
                    JSON
                </button>

                <button
                    onClick={() => setSourceType("csv")}
                    className={
                        sourceType === "csv"
                            ? "active"
                            : ""
                    }
                >
                    CSV
                </button>

            </div>

            {sourceType === "api" && (
                <div className="api-source">

                    <label>API URL</label>

                    <input
                        type="text"
                        value={apiUrl}
                        onChange={(e) =>
                            setApiUrl(e.target.value)
                        }
                    />

                    <button
                        onClick={handleLoadData}
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "Load Data"}
                    </button>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                </div>
            )}

          {sourceType === "json" && (
    <div className="file-source">

        <label>Upload JSON File</label>

        <input
            type="file"
            accept=".json,application/json"
            onChange={handleJSONUpload}
        />

        {error && (
            <p className="error-message">
                {error}
            </p>
        )}

    </div>
)}

          {sourceType === "csv" && (
    <div className="file-source">

        <label>Upload CSV File</label>

        <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleCSVUpload}
        />

        {error && (
            <p className="error-message">
                {error}
            </p>
        )}

    </div>
)}

        </div>
    );
}

export default DataSource;