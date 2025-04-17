
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type DataField = {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "checkbox";
  required: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
};

interface DataFieldTableProps {
  dataFields: DataField[];
  onEdit: (fieldId: string) => void;
  onDelete: (fieldId: string) => void;
}

const DataFieldTable: React.FC<DataFieldTableProps> = ({ dataFields, onEdit, onDelete }) => {
  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case "text": return "bg-blue-100 text-blue-800";
      case "number": return "bg-green-100 text-green-800";
      case "date": return "bg-purple-100 text-purple-800";
      case "select": return "bg-amber-100 text-amber-800";
      case "checkbox": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataFields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">{field.name}</TableCell>
              <TableCell>{field.label}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getFieldTypeColor(
                    field.type
                  )}`}
                >
                  {field.type}
                </span>
              </TableCell>
              <TableCell>
                {field.required ? (
                  <Badge variant="default">Required</Badge>
                ) : (
                  <Badge variant="outline">Optional</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(field.id)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(field.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataFieldTable;
