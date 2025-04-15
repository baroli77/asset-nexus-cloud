
import { useState } from "react";
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
  Trash2
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
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock asset data
const mockAssets = [
  { 
    id: "A-1001", 
    name: "MacBook Pro 16\"", 
    category: "Electronics", 
    location: "HQ - Floor 2", 
    status: "In Use", 
    assignedTo: "John Doe",
    purchaseDate: "2023-01-15", 
    purchasePrice: "$2,499.00"
  },
  { 
    id: "A-1002", 
    name: "Standing Desk", 
    category: "Furniture", 
    location: "HQ - Floor 1", 
    status: "In Use", 
    assignedTo: "Jane Smith",
    purchaseDate: "2023-02-20", 
    purchasePrice: "$350.00"
  },
  { 
    id: "A-1003", 
    name: "Projector", 
    category: "Office Equipment", 
    location: "Conference Room A", 
    status: "In Use", 
    assignedTo: "Meeting Room A",
    purchaseDate: "2022-11-05", 
    purchasePrice: "$799.00"
  },
  { 
    id: "A-1004", 
    name: "Server Rack", 
    category: "IT Hardware", 
    location: "Server Room", 
    status: "In Use", 
    assignedTo: "IT Department",
    purchaseDate: "2022-08-30", 
    purchasePrice: "$1,200.00"
  },
  { 
    id: "A-1005", 
    name: "Office Chair", 
    category: "Furniture", 
    location: "HQ - Floor 3", 
    status: "In Storage", 
    assignedTo: "Unassigned",
    purchaseDate: "2023-03-10", 
    purchasePrice: "$180.00"
  },
  { 
    id: "A-1006", 
    name: "Printer/Scanner", 
    category: "Office Equipment", 
    location: "HQ - Floor 2", 
    status: "Under Repair", 
    assignedTo: "Marketing Team",
    purchaseDate: "2022-05-15", 
    purchasePrice: "$450.00"
  },
  { 
    id: "A-1007", 
    name: "Software License - Adobe CC", 
    category: "Software Licenses", 
    location: "Digital Asset", 
    status: "In Use", 
    assignedTo: "Design Team",
    purchaseDate: "2023-04-01", 
    purchasePrice: "$599.99/yr"
  },
  { 
    id: "A-1008", 
    name: "Smartphone - iPhone 13", 
    category: "Electronics", 
    location: "Mobile", 
    status: "In Use", 
    assignedTo: "Alex Johnson",
    purchaseDate: "2022-10-12", 
    purchasePrice: "$999.00"
  },
];

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Filter assets based on search term and filters
  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = 
      searchTerm === "" || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || asset.category === selectedCategory;
    const matchesStatus = !selectedStatus || asset.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Extract unique categories and statuses for filters
  const categories = Array.from(new Set(mockAssets.map(asset => asset.category)));
  const statuses = Array.from(new Set(mockAssets.map(asset => asset.status)));

  const handleDeleteClick = (id: string) => {
    setSelectedAssetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would call an API to delete the asset
    console.log(`Deleting asset with ID: ${selectedAssetId}`);
    setDeleteDialogOpen(false);
    setSelectedAssetId(null);
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
            <Button onClick={() => window.location.href = "/assets/new"}>
              <Plus className="mr-2 h-4 w-4" />
              New Asset
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
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

        {/* Assets Table */}
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
                {filteredAssets.map((asset, index) => (
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
                          <DropdownMenuItem onClick={() => window.location.href = `/assets/${asset.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(asset.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAssets.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No assets found. Try adjusting your filters or create a new asset.</p>
              <Button className="mt-4" onClick={() => window.location.href = "/assets/new"}>
                <Plus className="mr-2 h-4 w-4" />
                New Asset
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Assets;
