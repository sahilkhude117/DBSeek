import { Config, Result, Unicorn } from "@/lib/types";
import { DynamicChart } from "./dynamic-chart";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const Results = ({
    results,
    columns,
    chartConfig,
}:{
    results: Result[];
    columns: string[];
    chartConfig: Config | null;
}) => {

}
