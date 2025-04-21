
export interface ValidationError {
  field: string;
  message: string;
}

export const validateAsset = (assetData: any, existingAssets: any[] = []): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Required fields validation
  const requiredFields = ["name", "category", "location", "status"];
  requiredFields.forEach(field => {
    if (!assetData[field]) {
      errors.push({
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      });
    }
  });
  
  // Name validation
  if (assetData.name) {
    // Check for duplicate names
    if (existingAssets.some(asset => 
      asset.name.toLowerCase() === assetData.name.toLowerCase() && 
      asset.id !== assetData.id
    )) {
      errors.push({
        field: "name",
        message: "An asset with this name already exists"
      });
    }
    
    // Name length validation
    if (assetData.name.length < 3) {
      errors.push({
        field: "name",
        message: "Name must be at least 3 characters long"
      });
    }
    
    if (assetData.name.length > 100) {
      errors.push({
        field: "name",
        message: "Name must be less than 100 characters long"
      });
    }
  }
  
  // Validate purchase price if provided
  if (assetData.purchasePrice && !/^\d+(\.\d{1,2})?$/.test(assetData.purchasePrice)) {
    errors.push({
      field: "purchasePrice",
      message: "Purchase price must be a valid number"
    });
  }
  
  // Validate purchase date if provided
  if (assetData.purchaseDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(assetData.purchaseDate)) {
      errors.push({
        field: "purchaseDate",
        message: "Purchase date must be in YYYY-MM-DD format"
      });
    }
  }
  
  return errors;
};

export const displayValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return "";
  
  return errors.map(error => error.message).join("\n");
};
