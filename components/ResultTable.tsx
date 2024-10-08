import React, { useEffect, useState, useRef } from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { 
  Progress 
} from "@/components/ui/progress";
import { Plus, Pencil, Check, Trash } from 'lucide-react';

interface DataTableProps {
  csvData: string;
}

interface JsonObject {
  [key: string]: string;
}

export default function ResultTable({ csvData }: DataTableProps) {
  const [jsonArray, setJsonArray] = useState<JsonObject[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [headersEdited, setHeadersEdited] = useState(false);
  const [visibleRows, setVisibleRows] = useState(10);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = React.useState(10);
  const [reTransformTrigger, setReTransformTrigger] = useState(0);
  const hasRunEffectRef = useRef(false);

  useEffect(() => {
    if (hasRunEffectRef.current || !csvData) {
      return
    }
    async function fetchResult() {
      try {
        setLoading(true);
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ csvData, headers })
        });

        if (response.ok) {
          const result = await response.json();
          const resultData = result.transformedData;
          // const resultHeaders = result.transformedHeaders;
          setJsonArray(resultData);
          setHeaders(resultData.length > 0 ? Object.keys(resultData[0]) : []);
          setHeadersEdited(false);
          setLoading(false);
        } else {
          const error = await response.json();
          console.error('Error:', error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Server Error:', error);
        setLoading(false);
      }
    }
    hasRunEffectRef.current = true;
    fetchResult();
  }, [csvData, reTransformTrigger]);

  useEffect(() => {
    if (!loading) {
      return;
    }
    // Example to simulate progress increase
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress * 0.95 + 5));
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  const handleHeaderChange = (index: number, newHeader: string) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = newHeader;
    setHeaders(updatedHeaders);
    setHeadersEdited(true);
  };
  
  const saveHeader = () => {
    setEditingHeaderIndex(null);
  };

  const addColumn = () => {
    const newHeader = `Column ${headers.length + 1}`;
    const updatedHeaders = [...headers, newHeader];
    const updatedJsonArray = jsonArray.map(row => ({ ...row, [newHeader]: '' }));

    setHeaders(updatedHeaders);
    setHeadersEdited(true);
    setJsonArray(updatedJsonArray);
  };

  const removeColumn = (index: number) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    setHeaders(updatedHeaders);
    setHeadersEdited(true);
    const updatedJsonArray = jsonArray.map(row => {
      const { [headers[index]]: _, ...rest } = row;
      return rest;
    });
    setJsonArray(updatedJsonArray);
  };

  const showMoreRows = () => {
    setVisibleRows(visibleRows + 10);
  };

  const saveAsCsv = () => {
    const rows = [
      headers.join(','), // join headers with commas
      ...jsonArray.map(row => headers.map(header => row[header]).join(',')) // map each row to CSV format
    ].join('\n'); // join rows with new line characters

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modified_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReTransform = () => {
    setLoading(true);
    setProgress(10);
    hasRunEffectRef.current = false;
    setReTransformTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="w-full items-center justify-center gap-2 pt-6 pb-6 text-lg">
        <div>Analyzing data...</div>
        <Progress value={progress} className="w-[100%]" />
      </div>
    );
  }

  return (
    <div>
      {/* <div className="bg-slate-100"> */}
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>
                  <div className="flex items-center">
                    {editingHeaderIndex === index ? (
                      <input 
                        type="text"
                        value={header} 
                        onChange={(e) => handleHeaderChange(index, e.target.value)} 
                        style={{ background: 'white', width: '100px', height: '20px'}} 
                      />
                    ) : (
                      <span>{header}</span>
                    )}
                  <div className="ml-2 mr-1">
                    <button
                      onClick={() => editingHeaderIndex === index ? saveHeader() : setEditingHeaderIndex(index)}
                      className={`flex items-center justify-center p-2 border border-gray-300 ${editingHeaderIndex ? 'hover:bg-green-200' : 'hover:bg-gray-200' }  rounded`}
                    >
                      {editingHeaderIndex === index ? <Check size={16} /> : <Pencil size={16} />}
                    </button>  
                  </div>               
                  <button onClick={() => removeColumn(index)} className="flex items-center justify-center p-2 border border-gray-300 hover:bg-red-200 rounded">
                    <Trash size={16} />
                  </button>
                  </div>
                </TableHead>
              ))}
              <TableHead>
                <button onClick={addColumn} className="flex items-center justify-center p-2 border border-gray-300 rounded">
                  <Plus size={16} />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jsonArray.slice(0, visibleRows).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            {visibleRows < jsonArray.length && (
              <button onClick={showMoreRows} className="mt-4 flex items-center justify-center p-2 border border-gray-300 rounded">
                Show More Rows
              </button>
            )}
          </TableCaption>
        </Table>
      {/* </div> */}

      <div className="flex justify-center mt-4 font-mono">
        <div className="pr-2">
          <button 
            className={`flex items-center justify-center p-6 border border-gray-400 ${headersEdited ? 'bg-green-100' : 'bg-gray-100'} hover:bg-green-200 rounded`}
            onClick={handleReTransform}
          >
            Re-Transform
          </button>
        </div>
        <div className="pr-2">
          <button 
            className="flex items-center justify-center p-6 border border-gray-400 hover:bg-gray-200 rounded"
            onClick={saveAsCsv}
          >
            Export as CSV
          </button>
        </div>
        <div className="pr-2">
          <button 
              className="flex items-center justify-center p-3 border border-gray-400 hover:bg-blue-200 rounded cursor-not-allowed"
            onClick={saveAsCsv}
            disabled={true}
          >
            Save Transform<br/>(Coming Soon)
          </button>
        </div>
      </div>    
    </div>  
  )
}
