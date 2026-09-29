import { useState } from "react";

function GeneratorConfig({ onGenerate }) {

    const [rowCount, setRowCount] = useState(100);
    const [seed, setSeed] = useState(42);
    const [nullRate, setNullRate] = useState(5);
    const [outlierRate, setOutlierRate] = useState(2);

    const handleGenerate = () => {

        const settings = {
            rowCount,
            seed,
            nullRate,
            outlierRate
        };

        console.log(
            "Generation Settings:",
            settings
        );

        onGenerate(settings);
    };

    return (
        <div className="generator-config">

            <h2>Generation Settings</h2>

            <div className="config-grid">

                <div className="config-field">

                    <label>
                        Row Count
                    </label>

                    <input
                        type="number"
                        min="1"
                        max="10000"
                        value={rowCount}
                        onChange={(e) =>
                            setRowCount(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

                <div className="config-field">

                    <label>
                        Random Seed
                    </label>

                    <input
                        type="number"
                        value={seed}
                        onChange={(e) =>
                            setSeed(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

                <div className="config-field">

                    <label>
                        Null Rate (%)
                    </label>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={nullRate}
                        onChange={(e) =>
                            setNullRate(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

                <div className="config-field">

                    <label>
                        Outlier Rate (%)
                    </label>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={outlierRate}
                        onChange={(e) =>
                            setOutlierRate(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

            </div>

            <button
                className="generate-button"
                onClick={handleGenerate}
            >
                Generate Synthetic Data
            </button>

        </div>
    );
}

export default GeneratorConfig;