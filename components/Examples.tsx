import React from 'react';
import { Button } from "@/components/ui/button"

interface ExamplesProps {
  onCsvData: (data: string) => void;
}

export default function Examples({ onCsvData }: ExamplesProps) {

  const loadExampleCsv = async ( examplePath : string) => {
    try {
      const response = await fetch(examplePath);
      if (response.ok) {
        const text = await response.text();
        onCsvData(text);
      } else {
        console.error('Failed to load sample CSV');
      }
    } catch (error) {
      console.error('Error loading sample CSV', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }} className="space-x-4">
      <p className = "font-mono text-sm pt-6">
        You can also select an example dataset below:
      </p>
      <Button onClick={() => loadExampleCsv('/example_revenue.csv')} className="mt-4 px-4 py-2 bg-slate-500  font-mono text-sm text-white rounded hover:bg-slate-600">Company Revenue</Button>
    </div>
  );
}