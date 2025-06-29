
import React from "react";
import { Asset } from "@/services/assetService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Package, Trash2 } from "lucide-react";
import { getStatusColor } from "@/utils/statusColors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";

interface AssetsTableProps {
  assets: Asset[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  selectedAssets: Asset[];
  onSelectionChange: (assets: Asset[]) => void;
}

const AssetsTable: React.FC<AssetsTableProps> = ({ 
  assets, 
  loading, 
  onDelete, 
  selectedAssets, 
  onSelectionChange 
}) => {
  const navigate = useNavigate();

  const isSelected = (asset: Asset) => {
    return selectedAssets.some(selected => selected.id === asset.id);
  };

  const toggleSelection = (asset: Asset) => {
    if (isSelected(asset)) {
      onSelectionChange(selectedAssets.filter(selected => selected.id !== asset.id));
    } else {
      onSelectionChange([...selectedAssets, asset]);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error in delete operation:", error);
    }
  };

  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              <TableCell><Skeleton className="w-[100px]" /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell className="text-right"><Skeleton className="w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (assets.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No assets found.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]">
            <span className="sr-only">Select</span>
          </TableHead>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id} className={isSelected(asset) ? "bg-muted/50" : ""}>
            <TableCell>
              <Checkbox
                checked={isSelected(asset)}
                onCheckedChange={() => toggleSelection(asset)}
                aria-label={`Select ${asset.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">{asset.id}</TableCell>
            <TableCell className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>{asset.name}</span>
            </TableCell>
            <TableCell>{asset.category}</TableCell>
            <TableCell>{asset.location}</TableCell>
            <TableCell>
              {asset.status && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(asset.status).bg} ${getStatusColor(asset.status).text}`}>
                  {asset.status}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/assets/${asset.id}`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDelete(asset.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssetsTable;
