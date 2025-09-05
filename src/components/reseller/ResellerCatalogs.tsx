
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ResellerCatalogs = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch catalogs that the reseller has access to
  const { data: accessibleCatalogs, isLoading } = useQuery({
    queryKey: ['reseller-catalogs'],
    queryFn: async () => {
      // For now, we'll fetch all approved catalogs
      // In production, this would filter by reseller access
      const { data, error } = await supabase
        .from('product_uploads')
        .select('*')
        .eq('status', 'approved');
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredCatalogs = searchQuery
    ? accessibleCatalogs?.filter((catalog: any) => 
        catalog.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : accessibleCatalogs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Catalogs</h1>
        <p className="text-muted-foreground">
          Browse catalogs from approved brands
        </p>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search catalogs..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Catalogs</CardTitle>
          <CardDescription>
            View product catalogs from approved brands
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading catalogs...</div>
          ) : filteredCatalogs && filteredCatalogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catalog Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCatalogs.map((catalog: any) => (
                  <TableRow key={catalog.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        {catalog.name}
                      </div>
                    </TableCell>
                    <TableCell>Brand ID: {catalog.brand_id}</TableCell>
                    <TableCell>{new Date(catalog.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={catalog.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" /> View Catalog
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">No catalogs available</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery 
                    ? "No catalogs match your search criteria."
                    : "You don't have access to any catalogs yet."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Contact Brands Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Products?</CardTitle>
          <CardDescription>
            Reach out to brands to request access to their catalogs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              If you're interested in accessing catalogs from specific brands, you can request access through the platform.
            </p>
            <Button>
              Request Brand Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerCatalogs;
