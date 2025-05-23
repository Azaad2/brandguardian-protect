
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCatalogUpload = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [catalogName, setCatalogName] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  // Reset form
  const resetForm = () => {
    setFile(null);
    setCatalogName("");
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
      resetForm();
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

  return {
    file,
    catalogName,
    uploading,
    setCatalogName,
    handleFileChange,
    resetForm,
    uploadCatalog
  };
};
