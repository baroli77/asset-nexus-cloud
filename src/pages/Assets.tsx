
import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, Import, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssets, deleteAsset, createAsset, type Asset } from "@/services/assetService";
import { toast } from "sonner";
import AssetSearch from "@/components/assets/AssetSearch";
import AssetsTable from "@/components/assets/AssetsTable";
import { downloadCSV, readCSV } from "@/utils/csvUtils";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const assetsData = await getAssets();
        setAssets(assetsData);
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
      setAssets(assets.filter((asset) => asset.id !== id));
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
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleImportAssets = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    try {
      const importedAssets = await readCSV(file);
      
      for (const asset of importedAssets) {
        await createAsset(asset);
      }
      
      const updatedAssets = await getAssets();
      setAssets(updatedAssets);
      
      toast.success(`Successfully imported ${importedAssets.length} assets`);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import assets", {
        description: "Please check your CSV file format"
      });
    }
    
    event.target.value = '';
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">
              Manage assets across your organization
            </p>
          </div>
          <div className="flex gap-4">
            <AssetSearch ref={searchRef} onSearch={handleSearch} />
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportAssets}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export
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

        <div className="grid gap-4">
          <div className="border rounded-md overflow-hidden">
            <AssetsTable 
              assets={filteredAssets}
              loading={loading}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Assets;
