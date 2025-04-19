
import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssets, deleteAsset, type Asset } from "@/services/assetService";
import { toast } from "sonner";
import AssetSearch from "@/components/assets/AssetSearch";
import AssetsTable from "@/components/assets/AssetsTable";

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
            <Button asChild>
              <Link to="/assets/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Link>
            </Button>
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
