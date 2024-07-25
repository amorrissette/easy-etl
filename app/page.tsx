'use client';

import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import DataTable from '../components/Datatable';
import ResultTable from '../components/ResultTable';
import Examples from '../components/Examples';
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [csvData, setCsvData] = useState('');

  const handleClearData = () => {
    setCsvData('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Application powered by &nbsp;
          <code className="font-mono font-bold">Vercel | Next.js | OpenAI </code>
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

      {(!csvData && <p className="flex w-full items-center justify-center font-mono text-lg pt-4 pb-2">
        Import a csv document below and Easy ETL will process it for you.
      </p>)}

      <div className="pt-8">
        {!csvData && <Dropzone onCsvData={setCsvData} />}
      </div>

      <div className="w-full pt-8">
        
        {csvData && <div className="flex justify-center">
          <Tabs defaultValue="transform" className="w-full">
            <TabsList>
              <TabsTrigger value="orig">Original</TabsTrigger>
              <TabsTrigger value="transform">Transformed</TabsTrigger>
            </TabsList>
            <TabsContent value="orig"><DataTable csvData={csvData} /></TabsContent>
            <TabsContent value="transform"><ResultTable csvData={csvData} /></TabsContent>
          </Tabs>
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
