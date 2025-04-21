
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Star, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const presetFilters = [
  { id: "maintenance", label: "Maintenance Needed", filter: { status: "Under Maintenance" } },
  { id: "storage", label: "In Storage", filter: { status: "In Storage" } },
  { id: "recent", label: "Recently Added", filter: { added: "last30days" } },
  { id: "highValue", label: "High Value", filter: { value: "gt1000" } },
];

interface FilteredAssetViewsProps {
  onApplyFilter: (filter: any) => void;
}

const FilteredAssetViews: React.FC<FilteredAssetViewsProps> = ({ onApplyFilter }) => {
  const [savedFilters, setSavedFilters] = useState(() => {
    const saved = localStorage.getItem('savedAssetFilters');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newFilterName, setNewFilterName] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleApplyPresetFilter = (filterId: string, filter: any) => {
    setActiveFilter(filterId);
    onApplyFilter(filter);
    toast.success(`Applied "${filterId}" filter`);
  };

  const handleSaveCurrentFilter = () => {
    if (!newFilterName.trim()) {
      toast.error("Please enter a name for your filter");
      return;
    }

    // In a real app, we would get the current filter state from the parent
    const currentFilter = { status: "Active" }; // This is just a placeholder
    
    const newSavedFilter = {
      id: `custom-${Date.now()}`,
      label: newFilterName,
      filter: currentFilter
    };
    
    const updatedFilters = [...savedFilters, newSavedFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedAssetFilters', JSON.stringify(updatedFilters));
    
    setNewFilterName("");
    toast.success("Filter saved successfully");
  };

  const handleDeleteSavedFilter = (filterId: string) => {
    const updatedFilters = savedFilters.filter((f: any) => f.id !== filterId);
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedAssetFilters', JSON.stringify(updatedFilters));
    toast.success("Filter removed");
  };

  const clearFilters = () => {
    setActiveFilter(null);
    onApplyFilter({});
    toast.success("Filters cleared");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Saved Views
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {presetFilters.map((filter) => (
              <Badge 
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleApplyPresetFilter(filter.id, filter.filter)}
              >
                {filter.label}
              </Badge>
            ))}
            
            {savedFilters.map((filter: any) => (
              <div key={filter.id} className="flex items-center">
                <Badge 
                  variant={activeFilter === filter.id ? "default" : "secondary"}
                  className="cursor-pointer flex items-center"
                  onClick={() => handleApplyPresetFilter(filter.id, filter.filter)}
                >
                  <Star className="mr-1 h-3 w-3" />
                  {filter.label}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1"
                  onClick={() => handleDeleteSavedFilter(filter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {activeFilter && (
              <Badge 
                variant="outline" 
                className="cursor-pointer"
                onClick={clearFilters}
              >
                Clear Filters
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Input
              placeholder="Name your current filter"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveCurrentFilter} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilteredAssetViews;
