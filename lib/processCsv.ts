'use server'
import fs from "fs";
import csvParser from "csv-parser";
import { CsvFile } from "@/lib/asset-config";
import { validateFile } from "@/lib/file-validation";
import { seed } from "@/lib/seed";
import os from "os";
import path from "path"

// Function to infer column types based on sample data
function inferColumnType(value: string): string {
    if (!isNaN(parseFloat(value))) {
        return 'DECIMAL(10, 2)';
    }
    if (value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        return 'DATE';
    }
    return 'VARCHAR(255)';
}

export async function processCsv(file: File): Promise<{ tableName: string; tableSchema: string }> {
    try {
        // Validate the file
        const validationResult = validateFile("CSV_FILE", file);

        if (!validationResult.isValid) {
            throw new Error(validationResult.error || "Invalid file.");
        }

        console.log("File is valid. Uploading:", file.name);

        // Save the file temporarily
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, file.name);
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempFilePath, fileBuffer);

        const tableName = "dynamic_data"; // Dynamic table name
        const columns: { name: string; type: string }[] = [];

        // Parse the CSV file to infer schema
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(tempFilePath)
                .pipe(csvParser())
                .on('headers', (headers: string[]) => {
                    headers.forEach((header) => {
                        columns.push({ name: header.trim(), type: 'VARCHAR(255)' }); // Default type
                    });
                })
                .on('data', (data: Record<string, string>) => {
                    Object.entries(data).forEach(([key, value]) => {
                        const column = columns.find((col) => col.name === key);
                        if (column && column.type === 'VARCHAR(255)') {
                            column.type = inferColumnType(value);
                        }
                    });
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Seed the data into the database
        await seed(tempFilePath, tableName);

        console.log(`Database seeded successfully with table '${tableName}'`);

        // Generate the schema string
        const tableSchema = columns.map((col) => `"${col.name}" ${col.type}`).join(', ');

        return { tableName, tableSchema };

    } catch (error) {
        console.error("Error during file processing:", error);
        throw new Error("An error occurred while processing the file.");
    }
}