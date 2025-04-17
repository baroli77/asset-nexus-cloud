
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DataFieldTable from "@/components/datafields/DataFieldTable";
import DataFieldForm from "@/components/datafields/DataFieldForm";
import DeleteDataFieldDialog from "@/components/datafields/DeleteDataFieldDialog";
import { 
  getDataFields, 
  createDataField, 
  updateDataField, 
  deleteDataField 
} from "@/services/dataFieldService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DataFields = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [isDeleteFieldOpen, setIsDeleteFieldOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<DataField | null>(null);

  // Fetch data fields
  const { data: dataFields = [], isLoading } = useQuery({
    queryKey: ['dataFields'],
    queryFn: getDataFields,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDataField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataFields'] });
      toast({
        title: "Success",
        description: "Field created successfully",
      });
      setIsAddFieldOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create field",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; field: Omit<DataField, "id"> }) => 
      updateDataField(data.id, data.field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataFields'] });
      toast({
        title: "Success",
        description: "Field updated successfully",
      });
      setIsEditFieldOpen(false);
      setSelectedField(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update field",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDataField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataFields'] });
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
      setIsDeleteFieldOpen(false);
      setSelectedField(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete field",
        variant: "destructive",
      });
    },
  });

  const handleAddField = (fieldData: Omit<DataField, "id">) => {
    createMutation.mutate(fieldData);
  };

  const handleEditField = (id: string) => {
    const field = dataFields.find((f) => f.id === id);
    if (field) {
      setSelectedField(field);
      setIsEditFieldOpen(true);
    }
  };

  const handleUpdateField = (fieldData: Omit<DataField, "id">) => {
    if (!selectedField) return;
    updateMutation.mutate({ id: selectedField.id, field: fieldData });
  };

  const handleDeleteClick = (id: string) => {
    const field = dataFields.find((f) => f.id === id);
    if (field) {
      setSelectedField(field);
      setIsDeleteFieldOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedField) return;
    deleteMutation.mutate(selectedField.id);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Data Fields</h1>
          <Button onClick={() => setIsAddFieldOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Custom Field Management</CardTitle>
              <CardDescription>
                Configure and manage custom data fields for assets
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {dataFields.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No custom fields defined yet.</p>
                    <Button onClick={() => setIsAddFieldOpen(true)} variant="outline" className="flex items-center gap-2 mx-auto">
                      <Plus className="h-4 w-4" />
                      Create your first custom field
                    </Button>
                  </div>
                ) : (
                  <DataFieldTable 
                    dataFields={dataFields}
                    onEdit={handleEditField}
                    onDelete={handleDeleteClick}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Add Field Form */}
        <DataFieldForm
          isOpen={isAddFieldOpen}
          onClose={() => setIsAddFieldOpen(false)}
          onSubmit={handleAddField}
          title="Add New Field"
        />

        {/* Edit Field Form */}
        {selectedField && (
          <DataFieldForm
            isOpen={isEditFieldOpen}
            onClose={() => {
              setIsEditFieldOpen(false);
              setSelectedField(null);
            }}
            onSubmit={handleUpdateField}
            defaultValues={selectedField}
            title="Edit Field"
          />
        )}

        {/* Delete Field Confirmation */}
        {selectedField && (
          <DeleteDataFieldDialog
            isOpen={isDeleteFieldOpen}
            onClose={() => {
              setIsDeleteFieldOpen(false);
              setSelectedField(null);
            }}
            onConfirm={handleDeleteConfirm}
            fieldName={selectedField.name}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default DataFields;
