import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parses a file (CSV or XLSX) and extracts columns and data.
 * @param file - The uploaded file.
 * @returns An object containing `columns` (array of column names) and `data` (array of rows).
*/

export async function parseFile(file: File): Promise<{ columns: string[]; data: Record<string, any>[]}> {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'csv') {
        return parseCSV(file);
    } else if (['xlsx', 'xls'].includes(fileType || '')) {
        return parseXLSX(file);
    } else {
        throw new Error('Unsupported file type. Please upload a CSV or XLSX file.');
    }
}

/**
 * Parses a CSV file using PapaParse.
 * @param file - The uploaded CSV file.
 * @returns An object containing `columns` and `data`.
*/

async function parseCSV(file: File): Promise<{ columns: string[]; data: Record<string, any>[] }> {
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true});

    if (!parsed.meta.fields) {
        throw new Error('Unable to parse CSV file. No columns found.');
    }

    return {
        columns: parsed.meta.fields,
        data: parsed.data as Record<string, any>[],
    };
}

/**
 * Parses an XLSX file using the `xlsx` library.
 * @param file - The uploaded XLSX file.
 * @returns An object containing `columns` and `data`.
*/

async function parseXLSX(file: File): Promise<{ columns: string[]; data: Record<string, any>[] }> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
  
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<Array<any>>;
  
    if (jsonData.length === 0) {
      throw new Error('Unable to parse XLSX file. No data found.');
    }
  
    const [headerRow, ...rows] = jsonData;
  
    // Extract columns from the header row
    const columns = headerRow.map((col: any) => String(col));
  
    // Map rows to objects with column names as keys
    const data = rows.map((row: Array<any>) =>
      row.reduce((obj, value, index) => {
        obj[columns[index]] = value;
        return obj;
      }, {} as Record<string, any>)
    );
  
    return { columns, data };
  }