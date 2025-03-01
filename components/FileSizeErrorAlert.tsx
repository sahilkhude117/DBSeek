import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FileSizeErrorAlertProps {
    maxSizeMB: number;
    errorMessage: string;
}

export function FileSizeErrorAlert({ maxSizeMB, errorMessage }: FileSizeErrorAlertProps) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {errorMessage} Maximum allowed size is {maxSizeMB}MB.
            </AlertDescription>
        </Alert>
    );
}