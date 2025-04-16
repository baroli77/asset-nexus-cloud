
// Mock asset data
const defaultAssets = [
  { 
    id: "A-1001", 
    name: "MacBook Pro 16\"", 
    category: "Electronics", 
    location: "HQ - Floor 2", 
    status: "In Use", 
    assignedTo: "John Doe",
    purchaseDate: "2023-01-15", 
    purchasePrice: "$2,499.00"
  },
  { 
    id: "A-1002", 
    name: "Standing Desk", 
    category: "Furniture", 
    location: "HQ - Floor 1", 
    status: "In Use", 
    assignedTo: "Jane Smith",
    purchaseDate: "2023-02-20", 
    purchasePrice: "$350.00"
  },
  { 
    id: "A-1003", 
    name: "Projector", 
    category: "Office Equipment", 
    location: "Conference Room A", 
    status: "In Use", 
    assignedTo: "Meeting Room A",
    purchaseDate: "2022-11-05", 
    purchasePrice: "$799.00"
  },
  { 
    id: "A-1004", 
    name: "Server Rack", 
    category: "IT Hardware", 
    location: "Server Room", 
    status: "In Use", 
    assignedTo: "IT Department",
    purchaseDate: "2022-08-30", 
    purchasePrice: "$1,200.00"
  },
  { 
    id: "A-1005", 
    name: "Office Chair", 
    category: "Furniture", 
    location: "HQ - Floor 3", 
    status: "In Storage", 
    assignedTo: "Unassigned",
    purchaseDate: "2023-03-10", 
    purchasePrice: "$180.00"
  },
  { 
    id: "A-1006", 
    name: "Printer/Scanner", 
    category: "Office Equipment", 
    location: "HQ - Floor 2", 
    status: "Under Repair", 
    assignedTo: "Marketing Team",
    purchaseDate: "2022-05-15", 
    purchasePrice: "$450.00"
  },
  { 
    id: "A-1007", 
    name: "Software License - Adobe CC", 
    category: "Software Licenses", 
    location: "Digital Asset", 
    status: "In Use", 
    assignedTo: "Design Team",
    purchaseDate: "2023-04-01", 
    purchasePrice: "$599.99/yr"
  },
  { 
    id: "A-1008", 
    name: "Smartphone - iPhone 13", 
    category: "Electronics", 
    location: "Mobile", 
    status: "In Use", 
    assignedTo: "Alex Johnson",
    purchaseDate: "2022-10-12", 
    purchasePrice: "$999.00"
  },
];

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
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  assetId: string;
  assetName: string;
  details: string;
}

// Initialize localStorage with default assets if empty
const initializeAssets = () => {
  const storedAssets = localStorage.getItem('assets');
  if (!storedAssets) {
    localStorage.setItem('assets', JSON.stringify(defaultAssets));
  }
};

// Initialize localStorage with empty audit logs if not present
const initializeAuditLogs = () => {
  const storedLogs = localStorage.getItem('auditLogs');
  if (!storedLogs) {
    localStorage.setItem('auditLogs', JSON.stringify([]));
  }
};

// Get all assets
export const getAssets = (): Asset[] => {
  initializeAssets();
  try {
    const assets = localStorage.getItem('assets');
    return assets ? JSON.parse(assets) : [];
  } catch (error) {
    console.error("Error getting assets:", error);
    return [];
  }
};

// Get asset by ID
export const getAssetById = (id: string): Asset | undefined => {
  try {
    const assets = getAssets();
    return assets.find(asset => asset.id === id);
  } catch (error) {
    console.error("Error getting asset by ID:", error);
    return undefined;
  }
};

// Create a new asset
export const createAsset = (asset: Omit<Asset, 'id'>): Asset => {
  try {
    const assets = getAssets();
    
    // Generate a new ID
    const newId = `A-${1000 + assets.length + 1}`;
    
    const newAsset: Asset = {
      ...asset,
      id: newId,
    };
    
    const updatedAssets = [...assets, newAsset];
    localStorage.setItem('assets', JSON.stringify(updatedAssets));
    
    // Log this action
    addAuditLog({
      action: 'Created',
      assetId: newAsset.id,
      assetName: newAsset.name,
      details: `Created new asset: ${newAsset.name} (${newAsset.category})`
    });
    
    return newAsset;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

// Update an existing asset
export const updateAsset = (asset: Asset): Asset => {
  try {
    const assets = getAssets();
    const originalAsset = assets.find(a => a.id === asset.id);
    
    if (!originalAsset) {
      throw new Error(`Asset with ID ${asset.id} not found`);
    }
    
    const updatedAssets = assets.map(a => a.id === asset.id ? asset : a);
    localStorage.setItem('assets', JSON.stringify(updatedAssets));
    
    // Log this action
    addAuditLog({
      action: 'Updated',
      assetId: asset.id,
      assetName: asset.name,
      details: `Updated asset: ${asset.name} (${asset.category})`
    });
    
    return asset;
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
};

// Delete an asset
export const deleteAsset = (id: string): boolean => {
  try {
    const assets = getAssets();
    const assetToDelete = assets.find(a => a.id === id);
    
    if (!assetToDelete) {
      throw new Error(`Asset with ID ${id} not found`);
    }
    
    const updatedAssets = assets.filter(a => a.id !== id);
    
    // Store the updated assets list without the deleted asset
    localStorage.setItem('assets', JSON.stringify(updatedAssets));
    
    // Log this action
    addAuditLog({
      action: 'Deleted',
      assetId: id,
      assetName: assetToDelete.name,
      details: `Deleted asset: ${assetToDelete.name} (${assetToDelete.category})`
    });
    
    return true;
  } catch (error) {
    console.error("Error during asset deletion:", error);
    throw error;
  }
};

// Get all audit logs
export const getAuditLogs = (): AuditEntry[] => {
  initializeAuditLogs();
  try {
    const logs = localStorage.getItem('auditLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Error getting audit logs:", error);
    return [];
  }
};

// Add a new audit log entry
export const addAuditLog = (logData: Omit<AuditEntry, 'id' | 'timestamp' | 'user'>): AuditEntry => {
  try {
    const logs = getAuditLogs();
    
    // Mock user from sidebar component
    const mockUser = {
      name: "Demo User",
      email: "demo@example.com",
      role: "Admin"
    };
    
    const newLog: AuditEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: mockUser.name,
      ...logData
    };
    
    const updatedLogs = [newLog, ...logs];
    
    try {
      localStorage.setItem('auditLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Error adding audit log:", error);
    }
    
    return newLog;
  } catch (error) {
    console.error("Error adding audit log:", error);
    return {
      id: `LOG-ERROR-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "System",
      action: "Error",
      assetId: logData.assetId,
      assetName: logData.assetName,
      details: "Failed to log action due to an error"
    };
  }
};
