
import { useTableStore } from './store';
import { sql } from '@vercel/postgres';
import fs from 'fs';

function extractColumnNames(tableSchema: string): string[] {
  // Match the column definitions inside the parentheses of the CREATE TABLE statement
  const match = tableSchema.match(/\(([\s\S]+?)\)/);
  if (!match) {
    throw new Error('Invalid table schema format');
  }

  // Extract the column definitions and split them into individual lines
  const columnDefinitions = match[1].split(',').map((line) => line.trim());

  // Extract column names (the first word in each line)
  return columnDefinitions.map((line) => line.split(/\s+/)[0]);
}

export async function updateDatabase(
  tableName: string,
  tableSchema: string,
  tableData: Record<string, any>[]
): Promise<void> {
  const { setTableName, setTableSchema } = useTableStore.getState();

  try {
    // Step 1: Create the table if it doesn't exist
    await sql`
      ${tableSchema}
    `;
    console.log(`Created "${tableName}" table`);
    setTableName(tableName);
    setTableSchema(tableSchema);

    // Step 2: Insert data into the table
    const columns = extractColumnNames(tableSchema);

    for (const row of tableData) {
      try {
        // Prepare values for insertion
        const values = columns.map((col) => {
          const value = row[col];
          return value === '' || value === null ? null : value.trim(); // Handle empty fields
        });

        // Use tagged template literals to safely construct the query
        const insertQuery = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${values.map(() => '?').join(', ')})
          ON CONFLICT DO NOTHING
        `;
        //@ts-ignore
        await sql(insertQuery, ...values);
        console.log(`Inserted row: ${JSON.stringify(row)}`);
      } catch (error) {
        console.error(`Error inserting row: ${JSON.stringify(row)}`, error);
      }
    }

    console.log(`Inserted ${tableData.length} rows into "${tableName}"`);
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update database');
  }
}