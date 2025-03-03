import FileUploader from "@/components/FileUploader";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
            <h1 className="text-2xl font-bold text-center">
                Upload a CSV File
            </h1>
            <FileUploader />
        </div>
    );
}