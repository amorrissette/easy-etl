import React, { useEffect, useState } from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

interface DataTableProps {
  csvData: string;
}

interface JsonObject {
  [key: string]: string;
}

export default function DataTable({ csvData }: DataTableProps) {
  const [jsonArray, setJsonArray] = useState<JsonObject[]>([]);

  useEffect(() => {
    if (csvData) {
      const result = csvToJson(csvData);
      setJsonArray(result);
    }
  }, [csvData]);

  const csvToJson = (csv: string): JsonObject[] => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const obj: JsonObject = {};
      const currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {jsonArray.length > 0 && Object.keys(jsonArray[0]).map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {jsonArray.slice(0, 10).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {Object.values(row).map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}