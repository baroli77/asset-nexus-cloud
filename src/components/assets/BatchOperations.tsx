
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Asset, updateAsset, deleteAsset } from "@/services/assetService";
import { FileText, Trash, ChevronDown, Move, Edit, Tag } from "lucide-react";

interface BatchOperationsProps {
  selectedAssets: Asset[];
  onSelectionChange: (assets: Asset[]) => void;
  onOperationComplete: () => void;
  allAssets: Asset[];
}

const BatchOperations: React.FC<BatchOperationsProps> = ({ 
  selectedAssets, 
  onSelectionChange, 
  onOperationComplete,
  allAssets
}) => {
  const [operationDialog, setOperationDialog] = useState<{
    isOpen: boolean;
    type: 'location' | 'status' | 'category' | null;
    value: string;
  }>({
    isOpen: false,
    type: null,
    value: ''
  });
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleSelectAll = () => {
    if (selectedAssets.length === allAssets.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...allAssets]);
    }
  };
  
  const openOperationDialog = (type: 'location' | 'status' | 'category') => {
    setOperationDialog({
      isOpen: true,
      type,
      value: ''
    });
  };
  
  const handleUpdateBatch = async () => {
    if (!operationDialog.type || !operationDialog.value) {
      toast.error("Please select a value");
      return;
    }
    
    try {
      // Update each selected asset
      for (const asset of selectedAssets) {
        const updatedAsset = { ...asset };
        
        switch (operationDialog.type) {
          case 'location':
            updatedAsset.location = operationDialog.value;
            break;
          case 'status':
            updatedAsset.status = operationDialog.value;
            break;
          case 'category':
            updatedAsset.category = operationDialog.value;
            break;
        }
        
        await updateAsset(updatedAsset);
      }
      
      toast.success(`Updated ${selectedAssets.length} assets`, {
        description: `Changed ${operationDialog.type} to "${operationDialog.value}"`
      });
      
      setOperationDialog({ isOpen: false, type: null, value: '' });
      onOperationComplete();
    } catch (error) {
      console.error("Batch update error:", error);
      toast.error("Failed to update assets", {
        description: "An error occurred during the batch operation"
      });
    }
  };
  
  const handleDeleteBatch = async () => {
    try {
      // Delete each selected asset
      for (const asset of selectedAssets) {
        await deleteAsset(asset.id);
      }
      
      toast.success(`Deleted ${selectedAssets.length} assets`);
      setConfirmDelete(false);
      onOperationComplete();
    } catch (error) {
      console.error("Batch delete error:", error);
      toast.error("Failed to delete assets", {
        description: "An error occurred during the batch operation"
      });
    }
  };
  
  const handleExportSelected = () => {
    try {
      if (selectedAssets.length === 0) {
        toast.warning("No assets selected");
        return;
      }
      
      // Use the existing CSV export functionality
      import('@/utils/csvUtils').then(({ downloadCSV }) => {
        downloadCSV(selectedAssets, `selected-assets-${new Date().toISOString().slice(0, 10)}.csv`);
        toast.success(`Exported ${selectedAssets.length} assets`);
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export assets");
    }
  };
  
  // Get unique values for dropdowns
  const locations = [...new Set(allAssets.map(a => a.location))];
  const statuses = [...new Set(allAssets.map(a => a.status))];
  const categories = [...new Set(allAssets.map(a => a.category))];
  
  return (
    <>
      <Card className={`transition-opacity ${selectedAssets.length > 0 ? 'opacity-100' : 'opacity-70'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Batch Operations ({selectedAssets.length} selected)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all" 
                checked={allAssets.length > 0 && selectedAssets.length === allAssets.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select All
              </label>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={selectedAssets.length === 0}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => openOperationDialog('location')}>
                    <Move className="mr-2 h-4 w-4" />
                    Change Location
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openOperationDialog('status')}>
                    <Tag className="mr-2 h-4 w-4" />
                    Update Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openOperationDialog('category')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Change Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportSelected}
                disabled={selectedAssets.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setConfirmDelete(true)}
                disabled={selectedAssets.length === 0}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Batch Update Dialog */}
      <Dialog open={operationDialog.isOpen} onOpenChange={(isOpen) => 
        setOperationDialog(prev => ({ ...prev, isOpen }))
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {operationDialog.type === 'location' ? 'Update Location' : 
               operationDialog.type === 'status' ? 'Update Status' : 
               'Update Category'}
            </DialogTitle>
            <DialogDescription>
              This will update {selectedAssets.length} selected assets.
            </DialogDescription>
          </DialogHeader>
          
          {operationDialog.type === 'location' && (
            <Select onValueChange={(value) => 
              setOperationDialog(prev => ({ ...prev, value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
                <SelectItem value="custom">Add new location...</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {operationDialog.type === 'status' && (
            <Select onValueChange={(value) => 
              setOperationDialog(prev => ({ ...prev, value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {operationDialog.type === 'category' && (
            <Select onValueChange={(value) => 
              setOperationDialog(prev => ({ ...prev, value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
                <SelectItem value="custom">Add new category...</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {operationDialog.value === 'custom' && (
            <Input 
              placeholder={`Enter new ${operationDialog.type}`}
              onChange={(e) => setOperationDialog(prev => ({ ...prev, value: e.target.value }))}
            />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => 
              setOperationDialog({ isOpen: false, type: null, value: '' })
            }>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatch}>Update Assets</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAssets.length} assets? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBatch}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BatchOperations;
