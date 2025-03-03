import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/fileParser";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded"}, { status: 400})
        }

        const { columns, data } = await parseFile(file);

        const columnTypes = inferColumnTypes(data[0]);

        const schema = columns.map((col, index) => ({
            name: col,
            type: columnTypes[index],
        }));

        return NextResponse.json({
            schema
        })
    } catch (e) {
        console.error('Error processing file:', e);
        return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
    }
}


/**
 * Infers column types based on sample data and maps them to PostgreSQL-compatible types.
 * @param rowData - The first row of data from the file.
 * @returns An array of inferred PostgreSQL types (e.g., 'INTEGER', 'TEXT', etc.).
 */
function inferColumnTypes(rowData: Record<string, any>): string[] {
    return Object.values(rowData).map((value) => {
      if (value === null || value === undefined || value === '') {
        // Default to TEXT for null or empty values
        return 'TEXT';
      }
  
      if (!isNaN(Number(value))) {
        // Check if the number is an integer or a decimal
        const num = Number(value);
        return Number.isInteger(num) ? 'INTEGER' : 'NUMERIC';
      }
  
      if (typeof value === 'string') {
        // Check if the string is a valid date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toTimeString() === '00:00:00 GMT+0000 (Coordinated Universal Time)'
            ? 'DATE' // Only date (no time)
            : 'TIMESTAMP'; // Includes time
        }
  
        // Check if the string is a boolean ("true"/"false")
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
          return 'BOOLEAN';
        }
  
        // Default to TEXT for other strings
        return 'TEXT';
      }
  
      if (typeof value === 'boolean') {
        return 'BOOLEAN';
      }
  
      // Handle arrays (e.g., JSONB in PostgreSQL)
      if (Array.isArray(value)) {
        return 'JSONB';
      }
  
      // Fallback for unknown types
      return 'TEXT';
    });
}