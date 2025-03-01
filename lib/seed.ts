
import "dotenv/config";

import { sql } from '@vercel/postgres';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

// Function to parse date strings into YYYY-MM-DD format
function parseDate(dateString: string): string | null {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    console.warn(`Could not parse date: ${dateString}`);
    return null;
}

// Interface for column definition
interface ColumnDefinition {
    name: string;
    type: string;
}

// Function to seed the database dynamically
export async function seed(csvFilePath: string, tableName: string): Promise<void> {
    try {
        // Read the CSV file and extract headers and sample rows
        const results: Record<string, string>[] = [];
        const columns: ColumnDefinition[] = [];

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('headers', (headers: string[]) => {
                    // Infer column types from the first row of data
                    headers.forEach((header) => {
                        const sanitizedHeader = header.trim().replace(/[^a-zA-Z0-9_]/g, '_'); // Sanitize column names
                        columns.push({ name: `"${sanitizedHeader}"`, type: 'VARCHAR(255)' }); // Default type
                    });
                })
                .on('data', (data: Record<string, string>) => {
                    results.push(data);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Infer column types based on sample data
        results.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
                const column = columns.find((col) => col.name === `"${key.trim().replace(/[^a-zA-Z0-9_]/g, '_')}"`);
                if (column && column.type === 'VARCHAR(255)') {
                    if (!isNaN(parseFloat(value))) {
                        column.type = 'DECIMAL(10, 2)';
                    } else if (value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
                        column.type = 'DATE';
                    }
                }
            });
        });

        // Create the table dynamically
        const columnDefinitions = columns.map((col) => `${col.name} ${col.type}`).join(', ');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS "${tableName}" (
                id SERIAL PRIMARY KEY,
                ${columnDefinitions}
            );
        `;
        await sql.query(createTableQuery);
        console.log(`Created '${tableName}' table`);

        // Insert rows into the table
        for (const row of results) {
            const values = columns.map((col) => {
                const columnName = col.name.replace(/"/g, ''); // Remove quotes for matching
                const value = row[columnName];

                if (col.type === 'DATE') {
                    return parseDate(value) || null;
                }
                if (col.type === 'DECIMAL(10, 2)') {
                    return value ? parseFloat(value.replace('$', '').replace(',', '')) || null : null;
                }
                return value || null; // Handle empty or undefined values
            });

            // Construct placeholders for the query
            const placeholders = columns.map(() => '?').join(', ');
            const columnNames = columns.map((col) => col.name).join(', ');

            // Construct the query manually
            const insertQuery = `
                INSERT INTO "${tableName}" (${columnNames})
                VALUES (${placeholders})
                ON CONFLICT DO NOTHING;
            `;

            // Execute the query with sanitized values
            await sql.query(insertQuery, values);
        }

        console.log(`Seeded ${results.length} rows into '${tableName}'`);
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error; // Re-throw the error for better debugging
    }
}