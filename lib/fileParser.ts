'use server';

import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';
import csvParser from 'csv-parser';
import { generateSqlSchema } from '@/app/actions';
import { updateDatabase } from './updateDatabase';

export async function fileParse(file: File): Promise<void> {
    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Create the temporary file path
    const tempFilePath = path.join(uploadDir, file.name);

    // Write the uploaded file to the temporary file path
    await fs.promises.writeFile(tempFilePath, Buffer.from(await file.arrayBuffer()));

    let tableData: Record<string, any>[] = [];
    let tableData1: Record<string, any>[] = [];

    const fileExtension = path.extname(file.name).toLowerCase();

    if (fileExtension === '.csv') {
        tableData1 = await parseCsvLite(tempFilePath);
    } else if (fileExtension === '.xlsx') {
        tableData1 = await parseXlsxLite(tempFilePath);
    } else {
        throw new Error('Unsupported file format');
    }

    const tablename = file.name.split('.')[0];
    const tableSchema = await generateSqlSchema(tablename, tableData1);

    if (fileExtension === '.csv') {
        tableData = await parseCsv(tempFilePath);
    } else if (fileExtension === '.xlsx') {
        tableData = await parseXlsx(tempFilePath);
    } else {
        throw new Error('Unsupported file format');
    }

    await updateDatabase(tablename, tableSchema, tableData);

    // Clean up the temporary file
    await fs.promises.unlink(tempFilePath);
}

async function parseCsvLite(filePath: string): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
        const results: Record<string, any>[] = [];
        let rowCount = 0;
        const maxRows = 20;

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                if (rowCount < maxRows) {
                    results.push(row);
                    rowCount++;
                }
            })
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function parseCsv(filePath: string): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
        const results: Record<string, any>[] = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function parseXlsxLite(filePath: string): Promise<Record<string, any>[]> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const range = { s: { c: 0, r: 0 }, e: { c: 100, r: 50 } }; // Adjust range as needed
    const limitedSheet = xlsx.utils.sheet_to_json(sheet, { range });

    return limitedSheet as Record<string, any>[];
}

async function parseXlsx(filePath: string): Promise<Record<string, any>[]> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    return xlsx.utils.sheet_to_json(sheet);
}