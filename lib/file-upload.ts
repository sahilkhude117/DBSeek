import { useTableContext } from "@/contexts/TableContext";
import { processCsv } from "@/lib/processCsv";

export const uploadFile = async (assetType: string, file: File): Promise<void> => {
    try {
        // Process the CSV file
        const { tableName, tableSchema } = await processCsv(file);

        // Update the context with the table name and schema
        const { setTableName, setTableSchema } = useTableContext();
        setTableName(tableName);
        setTableSchema(tableSchema);

        console.log(`File uploaded and database seeded successfully with table '${tableName}'`);
    } catch (error) {
        console.error("Error during file upload:", error);
        throw new Error("An error occurred while processing the file.");
    }
};