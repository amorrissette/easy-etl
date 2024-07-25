import React from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

interface DropzoneProps {
  onCsvData: (data: string) => void;
}

export default function Dropzone({ onCsvData }: DropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        const text = e.target.result as string;
        onCsvData(text);
      }
    };

    reader.readAsText(file);
  };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { 'text/csv': ['.csv'] }
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <div {...getRootProps({ className: 'dropzone font-mono' })} style={{ border: '2px dotted #262626', padding: '40px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drop a CSV file here, or click to select one</p>
    </div>
  );
}