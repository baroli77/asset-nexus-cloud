
import { Asset, AuditEntry } from "@/services/assetService";
import { AssetMetrics } from "@/services/reportService";
import { format } from "date-fns";

// Export data as PDF
export const exportToPDF = async (
  data: any[], 
  title: string,
  columns: { key: string; label: string }[]
) => {
  try {
    // Dynamically import jspdf and jspdf-autotable
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    
    if (!data || data.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);
    
    // Prepare columns and rows for the table
    const headers = columns.map(col => col.label);
    
    const rows = data.map(item => {
      return columns.map(col => {
        let value = item[col.key];
        
        // Handle complex fields
        if (col.key.includes('.')) {
          const keys = col.key.split('.');
          value = keys.reduce((obj, key) => obj && obj[key], item);
        }
        
        // Handle objects, arrays, booleans and null values
        if (typeof value === 'object') {
          return value ? JSON.stringify(value) : '';
        } else if (typeof value === 'boolean') {
          return value ? 'Yes' : 'No';
        }
        
        return value?.toString() ?? '';
      });
    });
    
    // Create table with auto-layout
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [67, 97, 238], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export PDF. Please try again.");
  }
};

// Export assets to PDF
export const exportAssetsToPDF = async (assets: Asset[]) => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'purchaseDate', label: 'Purchase Date' },
    { key: 'purchasePrice', label: 'Purchase Price' }
  ];
  
  return exportToPDF(assets, 'Assets Report', columns);
};

// Export audit log to PDF
export const exportAuditLogToPDF = async (auditLog: AuditEntry[]) => {
  const columns = [
    { key: 'assetId', label: 'Asset ID' },
    { key: 'assetName', label: 'Asset Name' },
    { key: 'action', label: 'Action' },
    { key: 'user', label: 'User' },
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'details', label: 'Details' }
  ];
  
  return exportToPDF(auditLog, 'Audit Log Report', columns);
};

// Export asset metrics to PDF
export const exportMetricsToPDF = async (metrics: AssetMetrics) => {
  // Create a flattened version of metrics for the PDF
  const flattenedMetrics = [
    { key: 'Total Assets', value: metrics.totalAssets },
    { key: 'Total Value', value: `$${metrics.totalValue.toFixed(2)}` },
    { key: 'Average Age (days)', value: metrics.averageAssetAge },
    ...Object.entries(metrics.assetsByCategory).map(([category, count]) => ({
      key: `Category: ${category}`,
      value: count
    })),
    ...Object.entries(metrics.assetsByStatus).map(([status, count]) => ({
      key: `Status: ${status}`,
      value: count
    }))
  ];
  
  const columns = [
    { key: 'key', label: 'Metric' },
    { key: 'value', label: 'Value' }
  ];
  
  return exportToPDF(flattenedMetrics, 'Asset Metrics Report', columns);
};
