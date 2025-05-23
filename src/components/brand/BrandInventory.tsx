
import React from "react";
import InventoryHeader from "./inventory/InventoryHeader";
import InventorySearchBar from "./inventory/InventorySearchBar";
import InventoryActionButtons from "./inventory/InventoryActionButtons";
import CatalogUploadForm from "./inventory/CatalogUploadForm";
import CatalogList from "./inventory/CatalogList";
import { useCatalogUpload } from "./inventory/hooks/useCatalogUpload";
import { useCatalogs } from "./inventory/hooks/useCatalogs";

const BrandInventory = () => {
  const { 
    file, 
    catalogName, 
    uploading, 
    setCatalogName, 
    handleFileChange, 
    resetForm,
    uploadCatalog 
  } = useCatalogUpload();
  
  const { data: catalogs, isLoading } = useCatalogs();

  return (
    <div className="space-y-6">
      <InventoryHeader />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <InventorySearchBar />
        <InventoryActionButtons onFileSelect={handleFileChange} />
      </div>
      
      {/* Catalog Upload Form */}
      {file && (
        <CatalogUploadForm
          file={file}
          catalogName={catalogName}
          setCatalogName={setCatalogName}
          uploading={uploading}
          onCancel={resetForm}
          onSubmit={() => uploadCatalog.mutate()}
        />
      )}
      
      {/* Uploaded Catalogs List */}
      <CatalogList 
        catalogs={catalogs} 
        isLoading={isLoading} 
        onFileSelect={handleFileChange} 
      />
    </div>
  );
};

export default BrandInventory;
