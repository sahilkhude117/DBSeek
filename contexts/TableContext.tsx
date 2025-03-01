'use client'
import { createContext, useContext, useState } from "react";

// Define the shape of the context
interface TableContextType {
    tableName: string | null;
    setTableName: (name: string) => void;
    tableSchema: string | null;
    setTableSchema: (schema: string) => void;
}

// Create the context
const TableContext = createContext<TableContextType | undefined>(undefined);

// Custom hook to use the context
export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error("useTableContext must be used within a TableProvider");
    }
    return context;
};

// Provider component to wrap around the app
export const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [tableName, setTableName] = useState<string | null>(null);
    const [tableSchema, setTableSchema] = useState<string | null>(null);

    return (
        <TableContext.Provider value={{ tableName, setTableName, tableSchema, setTableSchema }}>
            {children}
        </TableContext.Provider>
    );
};