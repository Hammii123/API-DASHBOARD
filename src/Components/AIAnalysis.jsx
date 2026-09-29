import { useState } from "react";

const MAX_FIELDS = 50;
const MAX_SAMPLES = 3;
const MAX_TEXT_LENGTH = 80;

// Shrink one value so the prompt stays small
function trimValue(value) {
    if (Array.isArray(value)) {
        return value.slice(0, MAX_SAMPLES).map(trimValue);
    }
    if (typeof value === "string" && value.length > MAX_TEXT_LENGTH) {
        return value.slice(0, MAX_TEXT_LENGTH) + "...";
    }
    if (value && typeof value === "object") {
        return "[object]";
    }
    return value;
}

// Send only a small version of the schema to the AI
function compactSchema(schema) {
    return schema.slice(0, MAX_FIELDS).map((item) => {
        if (item && typeof item === "object") {
            return Object.fromEntries(
                Object.entries(item).map(([key, value]) => [key, trimValue(value)])
            );
        }
        return trimValue(item);
    });
}

function AIAnalysis({ schema }) {

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {

        if (!schema || schema.length === 0) {
            setError("Please load data first.");
            return;
        }

        setLoading(true);
        setError("");
        setAnalysis(null);

        try {

            const response = await fetch(
                "http://localhost:5000/api/analyze-schema",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        schema: compactSchema(schema)
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(
                    data.error || "AI analysis failed."
                );
            }

            const result =
                await response.json();

            console.log(
                "AI Analysis:",
                result
            );

            setAnalysis(result);

        } catch (error) {

            console.error(
                "AI Error:",
                error
            );

            if (error instanceof TypeError) {
                setError(
                    "Could not reach the AI server. Check that it is running on port 5000."
                );
            } else {
                setError(
                    error.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="ai-analysis">

            <div>
                <h2>
                    🤖 AI Schema Analyzer
                </h2>

                <p>
                    Let AI understand your dataset
                    and suggest semantic field types.
                </p>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading
                    ? "Analyzing..."
                    : "Analyze with AI"}
            </button>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {analysis && (
                <div className="ai-result">

                    <h3>
                        AI Analysis
                    </h3>

                    {analysis.fields?.map(
                        (field) => (

                            <div
                                className="ai-field"
                                key={field.field}
                            >

                                <strong>
                                    {field.field}
                                </strong>

                                <p>
                                    {field.meaning}
                                </p>

                                <span>
                                    Category:{" "}
                                    {field.category}
                                </span>

                                <span>
                                    Identifier:{" "}
                                    {field.identifier
                                        ? "Yes"
                                        : "No"}
                                </span>

                                <p>
                                    Strategy:{" "}
                                    {field.generationStrategy}
                                </p>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default AIAnalysis;
