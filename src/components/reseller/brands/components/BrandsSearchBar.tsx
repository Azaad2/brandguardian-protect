
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BrandsSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredBrandsCount: number;
}

const BrandsSearchBar = ({ searchQuery, setSearchQuery, filteredBrandsCount }: BrandsSearchBarProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search brands, departments, or categories..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span className="font-medium">{filteredBrandsCount} brands available</span>
        </div>
      </div>
    </div>
  );
};

export default BrandsSearchBar;
