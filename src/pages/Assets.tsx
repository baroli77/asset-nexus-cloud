
import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, Import, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssets, deleteAsset, createAsset, type Asset } from "@/services/assetService";
import { toast } from "sonner";
import AssetSearch from "@/components/assets/AssetSearch";
import AssetsTable from "@/components/assets/AssetsTable";
import { downloadCSV, readCSV } from "@/utils/csvUtils";
import { exportAssetsToPDF } from "@/utils/pdfUtils";
import FilteredAssetViews from "@/components/assets/FilteredAssetViews";
import BatchOperations from "@/components/assets/BatchOperations";
import AdvancedSearch, { SearchFilters } from "@/components/assets/AdvancedSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { validateAsset, displayValidationErrors } from "@/utils/validationUtils";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [view, setView] = useState<"table" | "grid">("table");
  const searchRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const assetsData = await getAssets();
        setAssets(assetsData);
        setFilteredAssets(assetsData);
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("Error fetching assets", {
          description: "Could not retrieve the asset list.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      const updatedAssets = assets.filter((asset) => asset.id !== id);
      setAssets(updatedAssets);
      setFilteredAssets(prevFiltered => 
        prevFiltered.filter((asset) => asset.id !== id)
      );
      toast.success("Asset deleted", {
        description: "The asset has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Error deleting asset", {
        description: "Failed to delete the asset.",
      });
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    if (!searchTerm.trim()) {
      // If search is cleared, apply any active filters
      applyFilters(assets, activeFilters);
    } else {
      // Apply search to already filtered assets or all assets if no filters
      const baseAssets = Object.keys(activeFilters).length > 0 
        ? filteredAssets 
        : assets;
        
      setFilteredAssets(
        baseAssets.filter((asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        )
      );
    }
  };

  const applyFilters = (assetsData: Asset[], filters: SearchFilters) => {
    setActiveFilters(filters);
    
    if (Object.keys(filters).length === 0) {
      // If no filters, use the search term only
      if (search) {
        handleSearch(search);
      } else {
        setFilteredAssets(assetsData);
      }
      return;
    }
    
    // Apply filters first
    let filtered = assetsData;
    
    // Then apply the search term to the filtered results
    if (search) {
      filtered = filtered.filter((asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.id.toLowerCase().includes(search.toLowerCase()) ||
        asset.category.toLowerCase().includes(search.toLowerCase()) ||
        asset.location.toLowerCase().includes(search.toLowerCase()) ||
        (asset.assignedTo?.toLowerCase().includes(search.toLowerCase()) || false)
      );
    }
    
    setFilteredAssets(filtered);
  };

  const handleExportAssets = () => {
    try {
      if (!assets || assets.length === 0) {
        toast.warning("No assets to export");
        return;
      }
      
      downloadCSV(assets, `assets-export-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("Assets exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export assets", {
        description: "An error occurred during export"
      });
    }
  };
  
  const handleExportPDF = async () => {
    try {
      if (!assets || assets.length === 0) {
        toast.warning("No assets to export");
        return;
      }
      
      await exportAssetsToPDF(assets);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF", {
        description: "An error occurred during PDF export"
      });
    }
  };

  const handleImportAssets = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    try {
      const importedAssets = await readCSV(file);
      
      // Validate imported assets
      let validAssets = 0;
      let invalidAssets = 0;
      
      for (const asset of importedAssets) {
        const validationErrors = validateAsset(asset, assets);
        
        if (validationErrors.length === 0) {
          await createAsset(asset);
          validAssets++;
        } else {
          console.warn(`Invalid asset: ${asset.name}`, validationErrors);
          invalidAssets++;
        }
      }
      
      const updatedAssets = await getAssets();
      setAssets(updatedAssets);
      setFilteredAssets(updatedAssets);
      
      if (invalidAssets > 0) {
        toast.warning(`Imported ${validAssets} assets with ${invalidAssets} errors`, {
          description: "Some assets could not be imported due to validation errors"
        });
      } else {
        toast.success(`Successfully imported ${validAssets} assets`);
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import assets", {
        description: "Please check your CSV file format"
      });
    }
    
    event.target.value = '';
  };
  
  const handleOperationComplete = async () => {
    setSelectedAssets([]);
    
    try {
      setLoading(true);
      const assetsData = await getAssets();
      setAssets(assetsData);
      applyFilters(assetsData, activeFilters);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Error refreshing assets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">
              Manage assets across your organization
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            {!isMobile && (
              <AssetSearch ref={searchRef} onSearch={handleSearch} />
            )}
            
            <div className="flex items-center gap-2">
              <AdvancedSearch 
                onSearch={(results, filters) => {
                  setFilteredAssets(results);
                  setActiveFilters(filters);
                }} 
                assets={assets}
              />
              
              <Button variant="outline" onClick={handleExportAssets}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV
              </Button>
              
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <Import className="w-4 h-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleImportAssets}
                  />
                </label>
              </Button>
              
              <Button asChild>
                <Link to="/assets/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="mb-4">
            <AssetSearch ref={searchRef} onSearch={handleSearch} />
          </div>
        )}
        
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-6">
            <FilteredAssetViews 
              onApplyFilter={(filter) => {
                applyFilters(assets, filter);
              }} 
            />
            
            <BatchOperations 
              selectedAssets={selectedAssets}
              onSelectionChange={setSelectedAssets}
              onOperationComplete={handleOperationComplete}
              allAssets={filteredAssets}
            />
          </div>
          
          <div className="space-y-4">
            <Card>
              <Tabs defaultValue="table" className="w-full" onValueChange={(value) => setView(value as "table" | "grid")}>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="text-sm text-muted-foreground">
                    {filteredAssets.length} assets 
                    {Object.keys(activeFilters).length > 0 ? " (filtered)" : ""}
                  </div>
                  <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="table" className="m-0">
                  <AssetsTable 
                    assets={filteredAssets}
                    loading={loading}
                    onDelete={handleDelete}
                    selectedAssets={selectedAssets}
                    onSelectionChange={setSelectedAssets}
                  />
                </TabsContent>
                
                <TabsContent value="grid" className="m-0">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="h-[180px] animate-pulse bg-muted"></Card>
                      ))
                    ) : filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <Link to={`/assets/${asset.id}`} key={asset.id}>
                          <Card className="h-[180px] cursor-pointer hover:shadow-md transition-shadow">
                            <div className="p-4 h-full flex flex-col">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium truncate">{asset.name}</h3>
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  asset.status === 'In Use' ? 'bg-green-100 text-green-800' : 
                                  asset.status === 'Under Repair' ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {asset.status}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>ID: {asset.id}</p>
                                <p>Category: {asset.category}</p>
                                <p>Location: {asset.location}</p>
                              </div>
                              <div className="mt-auto text-xs text-muted-foreground">
                                {asset.assignedTo ? `Assigned to: ${asset.assignedTo}` : "Unassigned"}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center text-muted-foreground">
                        No assets found
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Assets;
