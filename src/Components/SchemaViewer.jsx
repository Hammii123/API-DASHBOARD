function getDataType(value) {
    if (value === null) {
        return "null";
    }

    if (Array.isArray(value)) {
        return "array";
    }

    if (typeof value === "object") {
        return "object";
    }

    return typeof value;
}

function SchemaViewer({ data }) {
    if (!data || data.length === 0) {
        return null;
    }

    const firstRecord = data[0];

    const schema = Object.entries(firstRecord).map(([key, value]) => ({
        key,
        type: getDataType(value)
    }));

    return (
        <div className="schema-viewer">

            <h2>Detected Schema</h2>

            <div className="schema-table">

                <div className="schema-row schema-header">
                    <span>Field</span>
                    <span>Type</span>
                </div>

                {schema.map(({ key, type }) => (
                    <div className="schema-row" key={key}>
                        <span>{key}</span>

                        <span className="type-badge">
                            {type}
                        </span>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default SchemaViewer;