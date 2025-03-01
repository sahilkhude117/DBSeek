export type CsvFile = 'CSV_FILE';

interface FileConfig {
    maxSize: number;
    acceptedTypes: string[];
}

export const FileConfig: Record<CsvFile, FileConfig> = {
    CSV_FILE: {
        maxSize: 5 * 1024 * 1024,
        acceptedTypes: ['text/csv', 'application/vnd.ms-excel'],
    }
}