function randomPercentage(rate) {
    return Math.random() * 100 < rate;
}


function generateValue(key, type, index) {

    const lowerKey = key.toLowerCase();

    if (type === "number") {
        return index + 1;
    }

    if (lowerKey.includes("email")) {
        return `synthetic${index + 1}@example.com`;
    }

    if (lowerKey.includes("username")) {
        return `synthetic_user_${index + 1}`;
    }

    if (
        lowerKey === "name" ||
        lowerKey.includes("name")
    ) {
        return `Synthetic User ${index + 1}`;
    }

    if (lowerKey.includes("phone")) {
        return `+1-555-010-${String(
            index + 1
        ).padStart(4, "0")}`;
    }

    if (lowerKey.includes("website")) {
        return `https://example.com/user${index + 1}`;
    }

    if (type === "string") {
        return `Synthetic ${key} ${index + 1}`;
    }

    if (type === "boolean") {
        return index % 2 === 0;
    }

    if (type === "object") {
        return {};
    }

    if (type === "array") {
        return [];
    }

    return null;
}


function generateOutlier(key, type, index) {

    const lowerKey = key.toLowerCase();

    if (type === "number") {
        return 999999;
    }

    if (lowerKey.includes("email")) {
        return `outlier${index + 1}@invalid-domain.xyz`;
    }

    if (lowerKey.includes("name")) {
        return "OUTLIER USER";
    }

    if (lowerKey.includes("username")) {
        return `outlier_user_${index + 1}`;
    }

    if (type === "string") {
        return `OUTLIER_${key}_${index + 1}`;
    }

    if (type === "boolean") {
        return true;
    }

    return generateValue(
        key,
        type,
        index
    );
}


function SyntheticGenerator({
    schema,
    settings,
    onGenerated
}) {

    const handleGenerate = () => {

        if (
            !schema ||
            schema.length === 0
        ) {
            alert(
                "Please load data before generating synthetic data."
            );

            return;
        }

        const generated = [];

        for (
            let i = 0;
            i < settings.rowCount;
            i++
        ) {

            const row = {};

            schema.forEach(
                ({ key, type }) => {

                    // Null value
                    if (
                        randomPercentage(
                            settings.nullRate
                        )
                    ) {
                        row[key] = null;
                        return;
                    }

                    // Outlier value
                    if (
                        randomPercentage(
                            settings.outlierRate
                        )
                    ) {
                        row[key] =
                            generateOutlier(
                                key,
                                type,
                                i
                            );

                        return;
                    }

                    // Normal value
                    row[key] =
                        generateValue(
                            key,
                            type,
                            i
                        );
                }
            );

            generated.push(row);
        }

        console.log(
            "Generated Data:",
            generated
        );

        onGenerated(generated);
    };


    return (
        <div className="synthetic-generator">

            <h2>
                Synthetic Data Generator
            </h2>

            <p>
                Generate synthetic data using
                the detected schema.
            </p>

            <button
                className="generate-button"
                onClick={handleGenerate}
            >
                Generate Data
            </button>

        </div>
    );
}

export default SyntheticGenerator;