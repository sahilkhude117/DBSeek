import fs from "fs";
import csvParser from "csv-parser";
import { CsvFile } from "@/lib/asset-config";
import { validateFile } from "@/lib/file-validation";
import { seed } from "@/lib/seed";

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

export const POST = async(req: any, res: any) => {

    try {
        const { file, assetType } = req.body;

        // Validate the file
        const validationResult = validateFile(assetType, file);

        if (!validationResult.isValid) {
            return res.status(400).json({ error: validationResult.error });
        }

        console.log("File is valid. Uploading:", file.name);

        // Save the file temporarily
        const tempFilePath = `/tmp/${file.name}`;
        const fileBuffer = Buffer.from(file.data); // Assuming `file.data` contains the file buffer
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

        // Return the table name and schema
        return res.status(200).json({ tableName, tableSchema });

    } catch (error) {
        console.error("Error during file seeding:", error);
        return res.status(500).json({ error: "An error occurred while processing the file." });
    }
}