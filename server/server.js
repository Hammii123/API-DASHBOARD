import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import "dotenv/config";

if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing");
    process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

const MAX_FIELDS = 200;

// Tried in order. If the first returns no JSON, the next one is used.
const MODELS = [
    "openai/gpt-oss-20b",
    
];

function extractJson(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) {
        throw new Error("No JSON found");
    }
    return JSON.parse(text.slice(start, end + 1));
}

async function askModel(model, prompt) {
    const completion = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_completion_tokens: 4000,
        response_format: { type: "json_object" }
    });

    const choice = completion.choices[0];

    console.log("MODEL:", model);
    console.log("FINISH REASON:", choice?.finish_reason);
    console.log("RAW OUTPUT:", choice?.message?.content);

    const text = choice?.message?.content ?? "";
    const result = extractJson(text);

    if (!Array.isArray(result.fields)) {
        throw new Error("Unexpected response shape");
    }

    return result;
}


app.post("/api/analyze-schema", async (req, res) => {

    const { schema } = req.body ?? {};

    if (!Array.isArray(schema) || schema.length === 0) {
        return res.status(400).json({
            error: "Schema must be a non-empty array."
        });
    }

    if (schema.length > MAX_FIELDS) {
        return res.status(400).json({
            error: `Schema too large (max ${MAX_FIELDS} fields).`
        });
    }

    const prompt = `
You are a data schema analysis expert.

Analyze the following dataset schema.

For every field, determine:

1. Semantic meaning
2. Suggested data category
3. Whether it is likely an identifier
4. Suggested synthetic data generation strategy

Return ONLY valid JSON.

Schema:
${JSON.stringify(schema, null, 2)}

Expected format:

{
    "fields": [
        {
            "field": "name",
            "meaning": "Person name",
            "category": "person_name",
            "identifier": false,
            "generationStrategy": "Generate realistic human names"
        }
    ]
}
`;

    let lastError;

    for (const model of MODELS) {
        try {
            const result = await askModel(model, prompt);
            return res.json(result);
        } catch (error) {
            lastError = error;
            console.error(`AI Schema Error (${model}):`, error.message);
        }
    }

    console.error("All models failed:", lastError);

    res.status(502).json({
        error: `AI analysis failed: ${lastError?.message || "unknown error"}`
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`AI server running on http://localhost:${PORT}`);
});