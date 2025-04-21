
import { Asset } from "@/services/assetService";
import { toast } from "sonner";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateAsset = (asset: Partial<Asset>, assets: Asset[] = []): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!asset.name?.trim()) {
    errors.push({ field: 'name', message: 'Asset name is required' });
  }
  
  if (!asset.category?.trim()) {
    errors.push({ field: 'category', message: 'Category is required' });
  }
  
  if (!asset.location?.trim()) {
    errors.push({ field: 'location', message: 'Location is required' });
  }
  
  if (!asset.status?.trim()) {
    errors.push({ field: 'status', message: 'Status is required' });
  }
  
  // Check for duplicate asset names
  if (asset.name && assets.some(a => a.id !== asset.id && a.name.toLowerCase() === asset.name.toLowerCase())) {
    errors.push({ field: 'name', message: 'An asset with this name already exists' });
  }
  
  // Price validation
  if (asset.purchasePrice) {
    const price = parseFloat(asset.purchasePrice);
    if (isNaN(price) || price < 0) {
      errors.push({ field: 'purchasePrice', message: 'Purchase price must be a positive number' });
    }
  }
  
  // Date validation
  if (asset.purchaseDate) {
    const purchaseDate = new Date(asset.purchaseDate);
    const today = new Date();
    
    if (isNaN(purchaseDate.getTime())) {
      errors.push({ field: 'purchaseDate', message: 'Invalid purchase date' });
    } else if (purchaseDate > today) {
      errors.push({ field: 'purchaseDate', message: 'Purchase date cannot be in the future' });
    }
  }
  
  return errors;
};

export const displayValidationErrors = (errors: ValidationError[]): void => {
  if (errors.length === 0) return;
  
  if (errors.length === 1) {
    toast.error(errors[0].message);
  } else {
    toast.error(`Validation errors (${errors.length})`, {
      description: (
        <ul className="list-disc pl-4 mt-2">
          {errors.slice(0, 3).map((error, index) => (
            <li key={index} className="text-sm">{error.message}</li>
          ))}
          {errors.length > 3 && <li className="text-sm">...and {errors.length - 3} more</li>}
        </ul>
      ),
    });
  }
};

export const checkDuplicateAssets = (
  assets: Asset[], 
  fields: ('name' | 'serial_number')[] = ['name']
): Asset[] => {
  const duplicates: Asset[] = [];
  const seen: Record<string, string[]> = {};
  
  fields.forEach(field => {
    seen[field] = [];
  });
  
  assets.forEach(asset => {
    fields.forEach(field => {
      let value = field === 'name' 
        ? asset.name.toLowerCase() 
        : asset.customFields?.serial_number?.toLowerCase();
        
      if (value && seen[field].includes(value)) {
        if (!duplicates.includes(asset)) {
          duplicates.push(asset);
        }
      } else if (value) {
        seen[field].push(value);
      }
    });
  });
  
  return duplicates;
};
