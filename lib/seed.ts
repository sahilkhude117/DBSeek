import { sql } from '@vercel/postgres';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import "dotenv/config";

// Helper function to parse date strings into the correct format
function parseDate(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  console.warn(`Could not parse date: ${dateString}`);
  throw new Error(`Invalid date format: ${dateString}`);
}

// Function to clean and validate numeric values
function parseValuation(valuation: string): number {
  const cleanedValue = valuation.replace('$', '').replace(',', '');
  const parsedValue = parseFloat(cleanedValue);
  if (isNaN(parsedValue)) {
    throw new Error(`Invalid valuation value: ${valuation}`);
  }
  return parsedValue;
}

export async function seed() {
  try {
    // Step 1: Create the table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS unicorns (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL UNIQUE,
        valuation DECIMAL(10, 2) NOT NULL,
        date_joined DATE,
        country VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        industry VARCHAR(255) NOT NULL,
        select_investors TEXT NOT NULL
      );
    `;
    console.log('Created "unicorns" table');

    // Step 2: Read and process the CSV file
    const csvFilePath = path.join(process.cwd(), 'test.csv');

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            // Parse and validate each row
            const company = row.Company.trim();
            const valuation = parseValuation(row['Valuation ($B)']);
            const dateJoined = parseDate(row['Date Joined']);
            const country = row.Country.trim();
            const city = row.City.trim() || null; // Handle empty city fields
            const industry = row.Industry.trim();
            const selectInvestors = row['Select Investors'].trim();

            // Insert the row into the database
            await sql`
              INSERT INTO unicorns (company, valuation, date_joined, country, city, industry, select_investors)
              VALUES (
                ${company},
                ${valuation},
                ${dateJoined},
                ${country},
                ${city},
                ${industry},
                ${selectInvestors}
              )
              ON CONFLICT (company) DO NOTHING;
            `;

            console.log(`Inserted company: ${company}`);
          } catch (error) {
            console.error(`Error processing row: ${JSON.stringify(row)}`, error);
          }
        })
        .on('end', () => {
          console.log('Finished processing CSV file');
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed().catch(console.error);