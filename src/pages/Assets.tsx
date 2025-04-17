
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Filter, 
  FileDown,
  FileUp,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAssets, deleteAsset, type Asset } from "@/services/assetService";
import { useToast } from "@/hooks/use-toast";

const Assets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load assets from localStorage
  const loadAssets = useCallback(() => {
    try {
      setIsLoading(true);
      const loadedAssets = getAssets();
      setAssets(loadedAssets);
    } catch (error) {
      console.error("Error loading assets:", error);
      toast({
        title: "Error",
        description: "Failed to load assets. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      searchTerm === "" || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || asset.category === selectedCategory;
    const matchesStatus = !selectedStatus || asset.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(assets.map(asset => asset.category)));
  const statuses = Array.from(new Set(assets.map(asset => asset.status)));

  const handleDeleteClick = (id: string) => {
    setSelectedAssetId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setSelectedAssetId(null);
    }
  };

  // Completely rewritten delete handler to fix the UI hanging issue
  const handleDeleteConfirm = async () => {
    if (!selectedAssetId || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      // Find the asset to be deleted
      const assetToDelete = assets.find(asset => asset.id === selectedAssetId);
      if (!assetToDelete) {
        throw new Error("Asset not found");
      }
      
      // Optimistically update UI
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== selectedAssetId));
      
      // Close dialog immediately
      setDeleteDialogOpen(false);
      
      // Perform actual deletion
      await deleteAsset(selectedAssetId);
      
      // Show success notification
      toast({
        title: "Asset Deleted",
        description: `${assetToDelete.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting asset:", error);
      
      // Reload assets to restore correct state
      loadAssets();
      
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to delete the asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset state
      setIsDeleting(false);
      setSelectedAssetId(null);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? null : value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === "all" ? null : value);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">
              Manage your company's assets inventory
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            <Button variant="outline" size="sm">
              <FileUp className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate("/assets/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Asset
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets by name or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select onValueChange={handleCategoryChange} defaultValue="all">
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleStatusChange} defaultValue="all">
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
            <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading assets...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Asset ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Location
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Assigned To
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Purchase Date
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Purchase Price
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset, index) => (
                      <tr 
                        key={asset.id} 
                        className={`border-t transition-colors hover:bg-muted/50 ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/25"
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                          {asset.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {asset.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {asset.category}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {asset.location}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span 
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              asset.status === "In Use" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                                : asset.status === "In Storage"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : asset.status === "Under Repair"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {asset.assignedTo}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {asset.purchaseDate}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {asset.purchasePrice}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/assets/${asset.id}`)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(asset.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        No assets found. Try adjusting your filters or create a new asset.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredAssets.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <Button className="mt-4" onClick={() => navigate("/assets/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Asset
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog 
        open={deleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            closeDeleteDialog();
          }
        }}
      >
        <DialogContent 
          onPointerDownOutside={(e) => {
            if (isDeleting) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isDeleting) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={closeDeleteDialog} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Assets;
