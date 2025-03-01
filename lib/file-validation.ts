import { CsvFile, FileConfig } from "./asset-config";

export const isFileSizeValid = (fileType: CsvFile, file: File): boolean => {
    return file.size <= FileConfig[fileType].maxSize;
};

export const isFileTypeValid = (fileType: CsvFile, file: File): boolean => {
    const acceptedTypes = FileConfig[fileType].acceptedTypes;
    return (
        acceptedTypes.includes(file.type) || // Check MIME type
        acceptedTypes.some((type) => file.name.endsWith(type.split('/')[1])) // Check file extension
    );
};

export const validateFile = (fileType: CsvFile, file: File): { isValid: boolean; error?: string } => {
    if (!isFileTypeValid(fileType, file)) {
        return { isValid: false, error: "Invalid file type. Only CSV files are allowed." };
    }
    if (!isFileSizeValid(fileType, file)) {
        return { isValid: false, error: `File size exceeds the maximum allowed size of ${FileConfig[fileType].maxSize / (1024 * 1024)}MB.` };
    }
    return { isValid: true };
};