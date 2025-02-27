'use client'

import { useState } from "react";
import { motion , AnimatePresence } from "framer-motion"
//actions
import { Config, Result } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { SuggestedQueries } from "@/components/suggested-queries";
import { QueryViewer } from "@/components/query-viewer";
import { ProjectInfo } from "@/components/project-info";
// project info
// results
// suggested queries
// query viewer
// search
// header

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [colums, setColumns] = useState<string[]>([]);
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [chartConfig, setChartConfig] = useState<Config | null>(null);

  const handleSubmit = async (suggestion?: string) => {
    const question = suggestion ?? inputValue;

    if (inputValue.length === 0 && !suggestion) return;
    clearExistingData();

    if (question.trim()) {
      setSubmitted(true);
    }
    setLoading(true);
    setLoadingStep(1);
    setActiveQuery("");

    try {
      // const query = await generateQuery(question)
      const query = "";
      if (query === undefined) {
        toast.error("An error occured. Please try again.");
        setLoading(false);
        return;
      }
      setActiveQuery(query);
      setLoadingStep(2);
      // const companies = await runGenerateSQLQuery(query);
      const companies = ["a","b","c"];
      const columns = companies.length > 0 ? Object.keys(companies[0]) : [];
      // setResults(companies);
      setColumns(columns);
      setLoading(false);
      // const generation = await generateChartConfig(companies, question)
      // setChartConfig(generation.config)
    } catch (e) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSuggestionClick = async ( suggestion: string) => {
    setInputValue(suggestion);
    try {
      await handleSubmit(suggestion);
    } catch(e) {
      toast.error("An error occured. Please try again.");
    }
  };

  const clearExistingData = () => {
    setActiveQuery("");
    setResults([]);
    setColumns([]);
    setChartConfig(null);
  };

  const handleClear = () => {
    setSubmitted(false);
    setInputValue("");
    clearExistingData();
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 flex items-start justify-center p-0 sm-p-8">
      <div className="w-full max-w-4xl min-h-dvh dm:min-h-0 flex flex-col">
        <motion.div
          className="bg-card rounded-xl sm:border sm:border-border flex-grow flex flex-col"
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 0.5, ease: "easeOut"}}
        >
          <div className="p-6 sm:p-8 flex flex-col flex-grow">
            <Header handleClear={handleClear}/>
            <Search
              handleClear={handleClear}
              handleSubmit={handleSubmit}
              inputValue={inputValue}
              setInputValue={setInputValue}
              submitted={submitted}
            />
            <div
              id="main-container"
              className="flex-grow flex flex-col sm:min-h-[420px]"
            >
              <div className="flex-grow h-full">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <SuggestedQueries
                      handleSuggestionClick={handleSuggestionClick}
                    />
                  ): (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0}}
                      animate={{ opacity: 1}}
                      exit={{ opacity: 0}}
                      layout
                      className="sm:h-full min-h-[400px] flex flex-col"
                    >
                      {activeQuery.length > 0 && (
                        <QueryViewer
                          activeQuery={activeQuery}
                          inputValue={inputValue}
                        />
                      )}
                      {loading ? (
                        <div>
                          <Loader2/>
                            <p>
                              {loadingStep == 1
                                ? "Generating SQL query..."
                                : "Running SQL query..."}
                            </p>
                        </div>
                      ) : results.length === 0 ? (
                        <div>
                          <p>
                            No results found.
                          </p>
                        </div>
                      ): (
                        // <Results/>
                        <></>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <ProjectInfo/>
        </motion.div>
      </div>
    </div>
  )
}