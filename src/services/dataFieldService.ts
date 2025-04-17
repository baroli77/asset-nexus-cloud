
import { DataField } from "../components/datafields/DataFieldTable";
import { v4 as uuidv4 } from 'uuid';

// Initial mock data
const mockDataFields: DataField[] = [
  {
    id: "1",
    name: "serial_number",
    label: "Serial Number",
    type: "text",
    required: true,
  },
  {
    id: "2",
    name: "purchase_date",
    label: "Purchase Date",
    type: "date",
    required: true,
  },
  {
    id: "3",
    name: "warranty_status",
    label: "Warranty Status",
    type: "select",
    required: false,
    options: ["Active", "Expired", "Lifetime"],
  },
  {
    id: "4",
    name: "is_insured",
    label: "Insurance Coverage",
    type: "checkbox",
    required: false,
    defaultValue: false,
  },
];

// Helper to simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Load data fields from localStorage or use mock data if none exists
export const getDataFields = async (): Promise<DataField[]> => {
  await delay(600); // Simulate network request
  
  const storedFields = localStorage.getItem('dataFields');
  if (storedFields) {
    return JSON.parse(storedFields);
  }
  
  // Initialize with mock data if no fields exist
  localStorage.setItem('dataFields', JSON.stringify(mockDataFields));
  return mockDataFields;
};

// Create a new data field
export const createDataField = async (fieldData: Omit<DataField, "id">): Promise<DataField> => {
  await delay(600); // Simulate network request
  
  const storedFields = localStorage.getItem('dataFields');
  const fields: DataField[] = storedFields ? JSON.parse(storedFields) : [];
  
  const newField: DataField = {
    ...fieldData,
    id: uuidv4(),
  };
  
  const updatedFields = [...fields, newField];
  localStorage.setItem('dataFields', JSON.stringify(updatedFields));
  
  return newField;
};

// Update an existing data field
export const updateDataField = async (fieldId: string, fieldData: Omit<DataField, "id">): Promise<DataField> => {
  await delay(600); // Simulate network request
  
  const storedFields = localStorage.getItem('dataFields');
  const fields: DataField[] = storedFields ? JSON.parse(storedFields) : [];
  
  const fieldIndex = fields.findIndex(field => field.id === fieldId);
  if (fieldIndex === -1) {
    throw new Error('Field not found');
  }
  
  const updatedField: DataField = {
    ...fields[fieldIndex],
    ...fieldData,
  };
  
  fields[fieldIndex] = updatedField;
  localStorage.setItem('dataFields', JSON.stringify(fields));
  
  return updatedField;
};

// Delete a data field
export const deleteDataField = async (fieldId: string): Promise<void> => {
  await delay(600); // Simulate network request
  
  const storedFields = localStorage.getItem('dataFields');
  const fields: DataField[] = storedFields ? JSON.parse(storedFields) : [];
  
  const updatedFields = fields.filter(field => field.id !== fieldId);
  localStorage.setItem('dataFields', JSON.stringify(updatedFields));
};
