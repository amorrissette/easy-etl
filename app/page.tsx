'use client';

import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import DataTable from '../components/Datatable';
import ResultTable from '../components/ResultTable';
import Examples from '../components/Examples';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronsUpDown } from 'lucide-react';

export default function Home() {
  const [csvData, setCsvData] = useState('');
  const [showOrigData, setShowOrigData] = useState(false);

  const handleClearData = () => {
    setCsvData('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Application powered by &nbsp;
          <code className="font-mono font-bold">Vercel | Next.js | Groq </code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none pt-8 pb-8">
          <a href={"https://github.com/amorrissette/easy-etl"} target="_blank" rel="noopener noreferrer">
              GitHub
          </a> 
        </div>
      </div>

      <p className="flex w-full items-center justify-center font-mono text-2xl pt-4">
        Easy ETL : Instantly build ETL pipelines to transform your csv for downstream analysis + tasks
      </p>

      {(!csvData && <p className="flex w-full items-center justify-center font-mono text-lg pt-2 pb-2">
        Upload a spreadsheet file below and Easy ETL will process it for you.
      </p>)}

      <div className="pt-8">
        {!csvData && <Dropzone onCsvData={setCsvData} />}
      </div>

      <div className="w-full items-center justify-center font-mono text-md pt-2 pb-2">
        AI inference is currently supported by <a href="https://groq.com/" target="_blank" rel="noopener noreferrer">Groq</a>. Easy ETL and Groq do not store any user data - <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Learn more.</a>
      </div>

      <div className="w-full pt-8">
        {csvData && <ResultTable csvData={csvData} />}
        {csvData && <div className="flex justify-center">
          <Collapsible
            open={showOrigData}
            onOpenChange={setShowOrigData}
            className="w-[350px] space-y-2"
          >
            <div className="flex items-center justify-center pt-4">
              <h4 className="text-md font-semibold font-mono">
                Show Original Data
              </h4>
              <CollapsibleTrigger asChild>
                <button className="w-3 p-2">
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <DataTable csvData={csvData} />
            </CollapsibleContent>
          </Collapsible>
        </div>}

        {!csvData && <Examples onCsvData={setCsvData} />}
        
        {csvData && (
          <div className="flex justify-center pt-4 pb-4">
            <Button 
              onClick={handleClearData} 
              className="mt-4 px-4 py-2 bg-slate-500 font-mono text-sm text-white rounded hover:bg-slate-600"
            >
              Clear Data
            </Button>
          </div>
        )}
      
      </div>

    </main>
  );
}
