
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
  
  return assetData;
};

// Delete an asset
export const deleteAsset = async (id: string): Promise<void> => {
  await delay(800); // Simulate network request
  
  const storedAssets = localStorage.getItem('assets');
  const assets: Asset[] = storedAssets ? JSON.parse(storedAssets) : [];
  
  const updatedAssets = assets.filter(asset => asset.id !== id);
  localStorage.setItem('assets', JSON.stringify(updatedAssets));
};
