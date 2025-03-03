"use client";

import { Input } from "./ui/input";
import { useState } from "react";
import axios from 'axios';
import { uploadFile } from "@/lib/file-upload";

export default function FileUploader() {
    const [error, setError] = useState<string | null>(null);
    const [schema, setSchema] = useState<any[]>([]);
    const [query, setQuery] = useState<string>("");

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Step 1: Upload the file and get the schema
            const schema = await uploadFile(file);
            setSchema(schema);

            // Step 2: Call the /api/ai/generateQuery endpoint with the schema
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/generateSchema`, { schema });

            // Step 3: Extract the SQL query from the response
            const sqlQuery = response.data.sqlQuery;
            setQuery(sqlQuery); // Set the query in state for display
        } catch (e: any) {
            console.error("File processing failed: ", e);
            setError(e.message || "An error occurred while processing the file.");
        }
    };

    return (
        <div className="space-y-4">
            {/* File Upload Input */}
            <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
            />

            {/* Display Schema */}
            {schema.length > 0 && (
                <div>
                    <h3>Schema:</h3>
                    <ul>
                        {schema.map((column, index) => (
                            <li key={index}>
                                {column.name}: {column.type}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Display SQL Query */}
            {query && (
                <div>
                    <h3>Generated SQL Query:</h3>
                    <pre>{query}</pre>
                </div>
            )}

            {/* Display Error */}
            {error && (
                <div className="text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}
        </div>
    );
}