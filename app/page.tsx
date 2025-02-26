'use client'

import { useState } from "react";
import { motion , AnimatePresence } from "framer-motion"
//actions
import { Config, Result } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
    // clearExistingData();
  }

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
            {/* Header */}
            {/* Search */}
            <div
              id="main-container"
              className="flex-grow flex flex-col sm:min-h-[420px]"
            >
              <div className="flex-grow h-full">
                {/* <AnimatePresence>
                  {!submitted ? (
                    // suggestQuery
                  ):(
                    //motion div
                  )}
                </AnimatePresence> */}
              </div>
            </div>
          </div>
          {/* ProjectInfo */}
        </motion.div>
      </div>
    </div>
  )
}