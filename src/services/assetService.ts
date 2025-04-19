
import { v4 as uuidv4 } from 'uuid';

// Asset type definition
export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  assignedTo?: string;
  purchaseDate?: string;
  purchasePrice?: string;
  notes?: string;
  customFields?: Record<string, any>;
}

// Audit log entry type definition
export interface AuditEntry {
  id: string;
  assetId: string;
  assetName: string;
  action: 'Created' | 'Updated' | 'Deleted';
  user: string;
  timestamp: string;
  details: string;
}

// Mock data
const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Dell XPS 15 Laptop",
    category: "Electronics",
    location: "Main Office",
    status: "In Use",
    assignedTo: "John Doe",
    purchaseDate: "2023-01-15",
    purchasePrice: "1899.99",
    notes: "Developer workstation",
    customFields: {
      serial_number: "XPS123456",
      warranty_status: "Active",
    }
  },
  {
    id: "2",
    name: "Office Desk",
    category: "Furniture",
    location: "Marketing Department",
    status: "In Use",
    assignedTo: "Marketing Team",
    purchaseDate: "2022-10-05",
    purchasePrice: "349.99",
    customFields: {
      is_insured: true,
    }
  },
  {
    id: "3",
    name: "Canon Printer MG3620",
    category: "Office Equipment",
    location: "Reception",
    status: "Under Repair",
    purchaseDate: "2022-05-20",
    purchasePrice: "129.99",
    notes: "Paper jam issue",
    customFields: {
      serial_number: "CNP78901",
      warranty_status: "Expired",
    }
  },
];

// Mock audit log data
const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    assetId: "1",
    assetName: "Dell XPS 15 Laptop",
    action: "Created",
    user: "Admin",
    timestamp: "2023-01-15T10:30:00Z",
    details: "Initial asset creation"
  },
  {
    id: "2",
    assetId: "2",
    assetName: "Office Desk",
    action: "Created",
    user: "Admin",
    timestamp: "2022-10-05T14:15:00Z",
    details: "Initial asset creation"
  },
  {
    id: "3",
    assetId: "3",
    assetName: "Canon Printer MG3620",
    action: "Created",
    user: "Jane Smith",
    timestamp: "2022-05-20T09:45:00Z",
    details: "Initial asset creation"
  },
  {
    id: "4",
    assetId: "3",
    assetName: "Canon Printer MG3620",
    action: "Updated",
    user: "John Doe",
    timestamp: "2023-02-10T11:20:00Z",
    details: "Status changed to 'Under Repair'"
  }
];

// Delay helper to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all assets
export const getAssets = async (): Promise<Asset[]> => {
  await delay(800); // Simulate network request
  
  const storedAssets = localStorage.getItem('assets');
  if (storedAssets) {
    return JSON.parse(storedAssets);
  }
  
  // Initialize with mock data if no assets exist
  localStorage.setItem('assets', JSON.stringify(mockAssets));
  return mockAssets;
};

// Get all audit logs
export const getAuditLogs = (): AuditEntry[] => {
  const storedLogs = localStorage.getItem('auditLogs');
  if (storedLogs) {
    return JSON.parse(storedLogs);
  }
  
  // Initialize with mock data if no logs exist
  localStorage.setItem('auditLogs', JSON.stringify(mockAuditLog));
  return mockAuditLog;
};

// Add an audit log entry
export const addAuditLogEntry = (entry: Omit<AuditEntry, "id" | "timestamp">): AuditEntry => {
  const newEntry: AuditEntry = {
    ...entry,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  
  const storedLogs = localStorage.getItem('auditLogs');
  const logs: AuditEntry[] = storedLogs ? JSON.parse(storedLogs) : mockAuditLog;
  
  const updatedLogs = [newEntry, ...logs];
  localStorage.setItem('auditLogs', JSON.stringify(updatedLogs));
  
  return newEntry;
};

// Get asset by ID
export const getAssetById = (id: string): Asset | undefined => {
  const storedAssets = localStorage.getItem('assets');
  const assets: Asset[] = storedAssets ? JSON.parse(storedAssets) : mockAssets;
  return assets.find(asset => asset.id === id);
};

// Create a new asset
export const createAsset = async (assetData: Omit<Asset, "id">): Promise<Asset> => {
  await delay(800); // Simulate network request
  
  const storedAssets = localStorage.getItem('assets');
  const assets: Asset[] = storedAssets ? JSON.parse(storedAssets) : [];
  
  const newAsset: Asset = {
    ...assetData,
    id: uuidv4(),
  };
  
  const updatedAssets = [...assets, newAsset];
  localStorage.setItem('assets', JSON.stringify(updatedAssets));
  
  // Add audit log entry
  addAuditLogEntry({
    assetId: newAsset.id,
    assetName: newAsset.name,
    action: 'Created',
    user: 'Current User', // In a real app, this would be the authenticated user
    details: 'Initial asset creation'
  });
  
  return newAsset;
};

// Update an existing asset
export const updateAsset = async (assetData: Asset): Promise<Asset> => {
  await delay(800); // Simulate network request
  
  const storedAssets = localStorage.getItem('assets');
  const assets: Asset[] = storedAssets ? JSON.parse(storedAssets) : [];
  
  const assetIndex = assets.findIndex(asset => asset.id === assetData.id);
  if (assetIndex === -1) {
    throw new Error('Asset not found');
  }
  
  const updatedAssets = [...assets];
  updatedAssets[assetIndex] = assetData;
  
  localStorage.setItem('assets', JSON.stringify(updatedAssets));
  
  // Add audit log entry
  addAuditLogEntry({
    assetId: assetData.id,
    assetName: assetData.name,
    action: 'Updated',
    user: 'Current User', // In a real app, this would be the authenticated user
    details: 'Asset details updated'
  });
  
  return assetData;
};

// Delete an asset
export const deleteAsset = async (id: string): Promise<void> => {
  await delay(800); // Simulate network request
  
  const storedAssets = localStorage.getItem('assets');
  const assets: Asset[] = storedAssets ? JSON.parse(storedAssets) : [];
  
  // Find the asset to delete (for the audit log)
  const assetToDelete = assets.find(asset => asset.id === id);
  if (!assetToDelete) {
    throw new Error('Asset not found');
  }
  
  const updatedAssets = assets.filter(asset => asset.id !== id);
  localStorage.setItem('assets', JSON.stringify(updatedAssets));
  
  // Add audit log entry
  addAuditLogEntry({
    assetId: id,
    assetName: assetToDelete.name,
    action: 'Deleted',
    user: 'Current User', // In a real app, this would be the authenticated user
    details: 'Asset permanently removed'
  });
};
