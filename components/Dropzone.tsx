import React from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import * as XLSX from 'xlsx';

interface DropzoneProps {
  onCsvData: (data: string) => void;
}

export default function Dropzone({ onCsvData }: DropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        if (file.name.endsWith('.csv')) {
          const text = e.target.result as string;
          onCsvData(text);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csvData = XLSX.utils.sheet_to_csv(worksheet);
          onCsvData(csvData);
        }
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { 
      'text/csv': ['.csv'], 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // Added Excel support
      'application/vnd.ms-excel': ['.xls'] // Added support for older Excel files
    }
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <div {...getRootProps({ className: 'dropzone font-mono' })} style={{ border: '2px dotted #262626', padding: '40px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag and drop a csv or excel file here, or click to select one</p>
    </div>
  );
}