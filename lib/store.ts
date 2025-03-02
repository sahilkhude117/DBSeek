// store.ts
import { create } from 'zustand';

type TableState = {
  tableName: string;
  tableSchema: string;
  setTableName: (name: string) => void;
  setTableSchema: (schema: string) => void;
};

export const useTableStore = create<TableState>((set) => ({
  tableName: '',
  tableSchema: '',
  setTableName: (name) => set({ tableName: name }),
  setTableSchema: (schema) => set({ tableSchema: schema }),
}));