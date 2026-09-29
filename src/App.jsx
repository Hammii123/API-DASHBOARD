import { useState } from "react";
import AIAnalysis from "./Components/AIAnalysis";
import useFetch from "./Hooks/useFetch";
import useTableFilter from "./Hooks/useTableFilter";
import ValidationPanel from "./Components/ValidationPanel";
import Header from "./Components/Header";
import UserTable from "./Components/UserTable";
import DataSource from "./Components/DataSource";
import SchemaViewer from "./Components/SchemaViewer";
import GeneratorConfig from "./Components/GeneratorConfig";
import SyntheticGenerator from "./Components/SyntheticGenerator";
import DataPreview from "./Components/DataPreview";
import ExportButtons from "./Components/ExportButtons";

import "./App.css";


function App() {

    const {
        data,
        loading,
        error,
        refetch
    } = useFetch(
        "https://jsonplaceholder.typicode.com/users"
    );


    // Data loaded from DataSource
    const [sourceData, setSourceData] = useState([]);


    // Detected schema
    const [schema, setSchema] = useState([]);


    // Generation settings
    const [
        generationSettings,
        setGenerationSettings
    ] = useState({
        rowCount: 100,
        seed: 42,
        nullRate: 5,
        outlierRate: 2
    });


    // Generated data
    const [
        generatedData,
        setGeneratedData
    ] = useState([]);


    // Load data from API
    const handleDataLoad = (newData) => {

        console.log(
            "New source data:",
            newData
        );

        setSourceData(newData);


        // Automatically detect schema
        if (
            newData &&
            newData.length > 0
        ) {

            const firstRecord =
                newData[0];

            const detectedSchema =
                Object.entries(
                    firstRecord
                ).map(
                    ([key, value]) => {

                        let type;

                        if (value === null) {
                            type = "null";
                        }
                        else if (
                            Array.isArray(value)
                        ) {
                            type = "array";
                        }
                        else if (
                            typeof value === "object"
                        ) {
                            type = "object";
                        }
                        else {
                            type = typeof value;
                        }

                        return {
                            key,
                            type
                        };
                    }
                );

            setSchema(
                detectedSchema
            );
        }
    };


    // Save generation settings
    const handleGenerateSettings = (
        settings
    ) => {

        console.log(
            "New settings:",
            settings
        );

        setGenerationSettings(
            settings
        );
    };


    // Save generated data
    const handleGenerated = (
        newData
    ) => {

        console.log(
            "Generated data:",
            newData
        );

        setGeneratedData(
            newData
        );
    };


    const {
        filteredData,
        searchTerm,
        setSearchTerm,
        sortKey,
        setSortKey,
        sortOptions
    } = useTableFilter(
        data,
        [
            "name",
            "email",
            "username"
        ]
    );


    // Loading
    if (loading) {

        return (
            <div className="status-message">

                <div className="spinner"></div>

                <p>
                    Loading...
                </p>

            </div>
        );
    }


    // Error
    if (error) {

        return (
            <div className="status-message">

                <p className="error-message">
                    {error}
                </p>

                <button
                    className="retry-button"
                    onClick={refetch}
                >
                    Retry
                </button>

            </div>
        );
    }


    // Empty API data
    if (data.length === 0) {

        return (
            <p className="status-message empty-message">
                No user found
            </p>
        );
    }


    return (

        <div className="dashboard-container">

            <Header
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }
                sortKey={sortKey}
                sortOptions={
                    sortOptions
                }
                onSortChange={
                    setSortKey
                }
            />


            {/* DATA SOURCE */}

            <DataSource
                onDataLoad={
                    handleDataLoad
                }
            />


            {/* SCHEMA */}

            <SchemaViewer
                data={sourceData}
            />

            <AIAnalysis
    schema={schema}
/>   
            {/* GENERATION SETTINGS */}

            <GeneratorConfig
                onGenerate={
                    handleGenerateSettings
                }
            />


            {/* SYNTHETIC GENERATOR */}

            <SyntheticGenerator
                schema={schema}
                settings={
                    generationSettings
                }
                onGenerated={
                    handleGenerated
                }
            />


            {/* GENERATED DATA */}

            <DataPreview
                data={generatedData}
            />



              <ValidationPanel
    data={generatedData}
    schema={schema}
/>  




            <ExportButtons
              data={generatedData}
            />


            {/* ORIGINAL API TABLE */}

            <div className="table-wrapper">

                {
                    filteredData.length === 0 ? (

                        <p className="empty-message">
                            No matching results
                        </p>

                    ) : (

                        <UserTable
                            data={filteredData}
                        />

                    )
                }

            </div>

        </div>
    );
}


export default App;