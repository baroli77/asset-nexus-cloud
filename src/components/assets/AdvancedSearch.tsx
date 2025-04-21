
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Asset } from "@/services/assetService";

interface AdvancedSearchProps {
  onSearch: (results: Asset[], filters: SearchFilters) => void;
  assets: Asset[];
}

export interface SearchFilters {
  name?: string;
  status?: string;
  category?: string;
  location?: string;
  assignedTo?: string;
  purchaseDateFrom?: Date;
  purchaseDateTo?: Date;
  priceMin?: number;
  priceMax?: number;
  customField?: {
    key: string;
    value: string;
  };
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, assets }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Extract unique values for the dropdowns
  const statuses = [...new Set(assets.map(a => a.status))];
  const categories = [...new Set(assets.map(a => a.category))];
  const locations = [...new Set(assets.map(a => a.location))];
  const assignees = [...new Set(assets.filter(a => a.assignedTo).map(a => a.assignedTo!))]
  
  // Get all possible custom field keys across all assets
  const customFieldKeys = [...new Set(
    assets
      .filter(a => a.customFields)
      .flatMap(a => Object.keys(a.customFields || {}))
  )];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    if (value && !activeFilters.includes(key)) {
      setActiveFilters(prev => [...prev, key]);
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters(prev => prev.filter(filter => filter !== key));
    }
  };
  
  const handleRemoveFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setActiveFilters(prev => prev.filter(filter => filter !== key));
  };

  const clearFilters = () => {
    setFilters({});
    setActiveFilters([]);
  };
  
  const handleSearch = () => {
    const results = assets.filter(asset => {
      // Check each filter
      if (filters.name && !asset.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      if (filters.status && asset.status !== filters.status) {
        return false;
      }
      
      if (filters.category && asset.category !== filters.category) {
        return false;
      }
      
      if (filters.location && asset.location !== filters.location) {
        return false;
      }
      
      if (filters.assignedTo && asset.assignedTo !== filters.assignedTo) {
        return false;
      }
      
      if (filters.purchaseDateFrom && asset.purchaseDate) {
        const purchaseDate = new Date(asset.purchaseDate);
        if (purchaseDate < filters.purchaseDateFrom) {
          return false;
        }
      }
      
      if (filters.purchaseDateTo && asset.purchaseDate) {
        const purchaseDate = new Date(asset.purchaseDate);
        if (purchaseDate > filters.purchaseDateTo) {
          return false;
        }
      }
      
      if (filters.priceMin && asset.purchasePrice) {
        const price = parseFloat(asset.purchasePrice);
        if (isNaN(price) || price < filters.priceMin) {
          return false;
        }
      }
      
      if (filters.priceMax && asset.purchasePrice) {
        const price = parseFloat(asset.purchasePrice);
        if (isNaN(price) || price > filters.priceMax) {
          return false;
        }
      }
      
      if (filters.customField && asset.customFields) {
        const { key, value } = filters.customField;
        const fieldValue = asset.customFields[key];
        
        if (!fieldValue || String(fieldValue).toLowerCase() !== value.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    });
    
    onSearch(results, filters);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced Search
          {activeFilters.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {activeFilters.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Advanced Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Basic Filters */}
          <div className="grid gap-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              placeholder="Search by name"
              value={filters.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any category</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={filters.location || ''}
                onValueChange={(value) => handleFilterChange('location', value)}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any location</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select
                value={filters.assignedTo || ''}
                onValueChange={(value) => handleFilterChange('assignedTo', value)}
              >
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Anyone/Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Anyone/Unassigned</SelectItem>
                  {assignees.map(assignee => (
                    <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Date Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Purchase Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.purchaseDateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.purchaseDateFrom ? (
                      format(filters.purchaseDateFrom, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.purchaseDateFrom}
                    onSelect={(date) => handleFilterChange('purchaseDateFrom', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label>Purchase Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.purchaseDateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.purchaseDateTo ? (
                      format(filters.purchaseDateTo, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.purchaseDateTo}
                    onSelect={(date) => handleFilterChange('purchaseDateTo', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Price Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priceMin">Min Price</Label>
              <Input
                id="priceMin"
                type="number"
                placeholder="Minimum"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priceMax">Max Price</Label>
              <Input
                id="priceMax"
                type="number"
                placeholder="Maximum"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
          
          {/* Custom Field Filter */}
          {customFieldKeys.length > 0 && (
            <div className="grid gap-2">
              <Label>Custom Field</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={filters.customField?.key || ''}
                  onValueChange={(value) => handleFilterChange('customField', { 
                    key: value, 
                    value: filters.customField?.value || '' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {customFieldKeys.map(key => (
                      <SelectItem key={key} value={key}>
                        {key.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Field value"
                  value={filters.customField?.value || ''}
                  onChange={(e) => handleFilterChange('customField', { 
                    key: filters.customField?.key || '', 
                    value: e.target.value 
                  })}
                  disabled={!filters.customField?.key}
                />
              </div>
            </div>
          )}
          
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-2">
              <Label className="mb-2 block">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map(filter => (
                  <div 
                    key={filter}
                    className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                  >
                    <span>
                      {filter === 'customField' 
                        ? `${filters.customField?.key}: ${filters.customField?.value}` 
                        : filter === 'purchaseDateFrom'
                        ? `From: ${format(filters.purchaseDateFrom!, "MMM d, yyyy")}`
                        : filter === 'purchaseDateTo'
                        ? `To: ${format(filters.purchaseDateTo!, "MMM d, yyyy")}`
                        : filter === 'priceMin'
                        ? `Min: $${filters.priceMin}`
                        : filter === 'priceMax'
                        ? `Max: $${filters.priceMax}`
                        : `${filter}: ${filters[filter as keyof SearchFilters]}`}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-1 h-4 w-4"
                      onClick={() => handleRemoveFilter(filter)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSearch}>Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch;
