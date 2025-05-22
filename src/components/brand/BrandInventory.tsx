import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Filter, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BrandInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [catalogName, setCatalogName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch existing catalogs/uploads
  const { data: catalogs, isLoading } = useQuery({
    queryKey: ['brand-catalogs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('product_uploads')
        .select('*')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-set catalog name from filename if not already set
      if (!catalogName) {
        setCatalogName(selectedFile.name.split('.')[0]);
      }
    }
  };

  // Handle catalog upload
  const uploadCatalog = useMutation({
    mutationFn: async () => {
      if (!file || !catalogName) {
        throw new Error("File and catalog name are required");
      }

      setUploading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const filePath = `catalogs/${user.id}/${Date.now()}.${fileExt}`;
        
        // Upload file to Storage
        const { error: uploadError } = await supabase.storage
          .from('brand-catalogs')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('brand-catalogs')
          .getPublicUrl(filePath);
        
        // Create catalog record in database
        const { error: dbError } = await supabase
          .from('product_uploads')
          .insert([
            { 
              name: catalogName,
              brand_id: user.id, 
              file_url: publicUrl,
              status: 'pending'
            }
          ]);
        
        if (dbError) throw dbError;
        
        return { success: true };
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Catalog uploaded successfully",
        description: "Your catalog has been submitted for admin approval.",
      });
      // Reset form
      setFile(null);
      setCatalogName("");
      // Refresh catalogs list
      queryClient.invalidateQueries({ queryKey: ['brand-catalogs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload catalog. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Manage your product catalog and stock levels</p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
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
              onChange={handleFileChange}
            />
          </label>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Catalog Upload Form */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Catalog</CardTitle>
            <CardDescription>
              Submit your product catalog for admin approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Selected File</label>
                <p className="text-sm">{file.name} ({Math.round(file.size / 1024)} KB)</p>
              </div>
              <div>
                <label htmlFor="catalog-name" className="text-sm font-medium">Catalog Name</label>
                <Input 
                  id="catalog-name"
                  value={catalogName}
                  onChange={(e) => setCatalogName(e.target.value)}
                  placeholder="Enter catalog name"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFile(null);
                    setCatalogName("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => uploadCatalog.mutate()}
                  disabled={uploading || !catalogName}
                >
                  {uploading ? "Uploading..." : "Submit for Approval"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Uploaded Catalogs List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Catalogs</CardTitle>
          <CardDescription>
            View and manage your uploaded product catalogs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ... keep existing code (isLoading check) */}
          {isLoading ? (
            <div className="text-center py-4">Loading catalogs...</div>
          ) : catalogs && catalogs.length > 0 ? (
            <div className="space-y-4">
              {catalogs.map((catalog: any) => (
                <div key={catalog.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{catalog.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {new Date(catalog.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(catalog.status)}`}>
                      {catalog.status.charAt(0).toUpperCase() + catalog.status.slice(1)}
                    </span>
                    {/* Fixed: Changed `asChild` to use a regular Button with an onClick handler */}
                    <Button variant="ghost" size="sm" onClick={() => window.open(catalog.file_url, '_blank')}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <h3 className="mb-1 text-lg font-medium">No catalogs uploaded yet</h3>
                <p className="text-muted-foreground">
                  Upload your product catalog for admin approval.
                </p>
                <div className="mt-4">
                  <label htmlFor="first-catalog-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Catalog
                    </Button>
                    <input
                      id="first-catalog-upload"
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandInventory;
