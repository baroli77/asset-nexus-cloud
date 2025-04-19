
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AssetSearchProps {
  onSearch: (searchTerm: string) => void;
}

const AssetSearch = React.forwardRef<HTMLInputElement, AssetSearchProps>(({ onSearch }, ref) => {
  const handleSearch = () => {
    const inputRef = ref as React.RefObject<HTMLInputElement>;
    onSearch(inputRef.current?.value || "");
  };

  return (
    <div className="flex items-center gap-2 max-w-sm">
      <Input
        type="search"
        placeholder="Search assets..."
        ref={ref}
        className="md:w-[200px] lg:w-[300px]"
      />
      <Button onClick={handleSearch} size="sm">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
});

AssetSearch.displayName = "AssetSearch";

export default AssetSearch;
