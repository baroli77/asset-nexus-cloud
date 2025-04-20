import { Asset, AuditEntry } from "@/services/assetService";
import { AssetMetrics } from "@/services/reportService";

// Convert array to CSV string
const arrayToCSV = (data: any[]): string => {
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header];
        // Handle objects, arrays, and null values
        const value = typeof cell === 'object' ? 
          cell ? JSON.stringify(cell) : '' :
          cell?.toString() ?? '';
        // Escape commas and quotes
        return `"${value.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  return csvRows.join('\n');
};

// Parse CSV string to array of objects 
const csvToArray = (csv: string): any[] => {
  const rows = csv.split('\n').map(row => 
    row.split(',').map(cell => 
      cell.trim().replace(/(^"|"$)/g, '').replace(/""/g, '"')
    )
  );
  const headers = rows[0];
  return rows.slice(1).map(row => 
    Object.fromEntries(
      headers.map((header, i) => {
        let value = row[i] || '';
        // Try to parse JSON strings (for objects/arrays)
        try {
          if (value.startsWith('{') || value.startsWith('[')) {
            value = JSON.parse(value);
          }
        } catch (e) {
          // Keep as string if parsing fails
        }
        return [header, value];
      })
    )
  );
};

// Download data as CSV file
export const downloadCSV = (data: any[], filename: string) => {
  const csv = arrayToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a'); // Changed from 'link' to 'a'
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up the URL object
};

// Read CSV file
export const readCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = csvToArray(text);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
