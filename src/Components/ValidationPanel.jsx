function getActualType(value) {
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


function ValidationPanel({ data, schema }) {

    if (!data || data.length === 0) {
        return null;
    }

    const errors = [];

    // 1. Check required values
    data.forEach((row, rowIndex) => {

        schema.forEach(({ key, type }) => {

            const value = row[key];

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                errors.push({
                    row: rowIndex + 1,
                    field: key,
                    message: "Missing value"
                });

                return;
            }

            // 2. Check data type
            const actualType = getActualType(value);

            if (actualType !== type) {
                errors.push({
                    row: rowIndex + 1,
                    field: key,
                    message: `Expected ${type}, got ${actualType}`
                });
            }
        });
    });


    // 3. Check duplicate IDs
    const idFieldExists = schema.some(
        (field) => field.key === "id"
    );

    if (idFieldExists) {

        const ids = new Set();

        data.forEach((row, rowIndex) => {

            const id = row.id;

            if (ids.has(id)) {
                errors.push({
                    row: rowIndex + 1,
                    field: "id",
                    message: "Duplicate ID"
                });
            }

            ids.add(id);
        });
    }


    return (
        <div className="validation-panel">

            <h2>Validation Report</h2>

            <div className="validation-summary">

                <div>
                    <strong>
                        {data.length}
                    </strong>

                    <span>
                        Total Records
                    </span>
                </div>


                <div>
                    <strong>
                        {errors.length}
                    </strong>

                    <span>
                        Errors
                    </span>
                </div>


                <div>
                    <strong>
                        {errors.length === 0
                            ? "Valid"
                            : "Invalid"}
                    </strong>

                    <span>
                        Status
                    </span>
                </div>

            </div>


            {errors.length === 0 ? (

                <p className="validation-success">
                    ✓ All generated data passed validation.
                </p>

            ) : (

                <div className="validation-errors">

                    <h3>
                        Validation Errors
                    </h3>

                    {errors
                        .slice(0, 50)
                        .map((error, index) => (

                            <div
                                className="validation-error"
                                key={index}
                            >

                                <strong>
                                    Row {error.row}
                                </strong>

                                <span>
                                    {error.field}
                                </span>

                                <span>
                                    {error.message}
                                </span>

                            </div>

                        ))}

                </div>
            )}

        </div>
    );
}

export default ValidationPanel;