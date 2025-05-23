
import React from "react";
import { Filter, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryActionButtonsProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InventoryActionButtons = ({ onFileSelect }: InventoryActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button variant="outline" size="sm" type="button">
          <Upload className="mr-2 h-4 w-4" />
          Upload Catalog
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.pdf"
          onChange={onFileSelect}
        />
      </label>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
};

export default InventoryActionButtons;
