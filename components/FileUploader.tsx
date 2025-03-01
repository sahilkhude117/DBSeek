"use client";

import { Input } from "./ui/input";
import { useState } from "react";
import { CsvFile, FileConfig } from "@/lib/asset-config";
import { uploadFile } from "@/lib/file-upload";
import { validateFile } from "@/lib/file-validation";
import { FileSizeErrorAlert } from "./FileSizeErrorAlert";


export type FileUploaderProps = {
    assetType: CsvFile;
};

export default function FileUploader({ assetType }: FileUploaderProps) {
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validationResult = validateFile(assetType, file);

        if (!validationResult.isValid) {
            setError(validationResult.error || "An error occurred.");
            return;
        }

        setError(null); // Clear any previous errors
        await uploadFile(assetType, file);
    };

    return (
        <div className="space-y-4">
            <Input
                id="csv-upload"
                type="file"
                accept={FileConfig[assetType].acceptedTypes.join(',')}
                onChange={handleFileChange}
            />

            {error && (
                <FileSizeErrorAlert
                    maxSizeMB={FileConfig[assetType].maxSize / (1024 * 1024)}
                    errorMessage={error}
                />
            )}
        </div>
    );
}