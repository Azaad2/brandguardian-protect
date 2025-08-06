import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface EditableMarketplaceFormProps {
  profile: {
    amazon_seller_id?: string;
    walmart_seller_id?: string;
    ebay_seller_id?: string;
  };
  onUpdate: () => void;
}

const EditableMarketplaceForm = ({ profile, onUpdate }: EditableMarketplaceFormProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    amazon_seller_id: profile.amazon_seller_id || '',
    walmart_seller_id: profile.walmart_seller_id || '',
    ebay_seller_id: profile.ebay_seller_id || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reseller_applications')
        .update({
          amazon_seller_id: formData.amazon_seller_id || null,
          walmart_seller_id: formData.walmart_seller_id || null,
          ebay_seller_id: formData.ebay_seller_id || null,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating marketplace info:', error);
        toast({
          title: "Error",
          description: "Failed to update marketplace information",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Marketplace information updated successfully",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      amazon_seller_id: profile.amazon_seller_id || '',
      walmart_seller_id: profile.walmart_seller_id || '',
      ebay_seller_id: profile.ebay_seller_id || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Marketplace Information
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Amazon Seller ID</Label>
              <p className="text-sm">{profile.amazon_seller_id || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Walmart Seller ID</Label>
              <p className="text-sm">{profile.walmart_seller_id || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">eBay Seller ID</Label>
              <p className="text-sm">{profile.ebay_seller_id || 'Not provided'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amazon_seller_id">Amazon Seller ID</Label>
              <Input
                id="amazon_seller_id"
                value={formData.amazon_seller_id}
                onChange={(e) => setFormData({ ...formData, amazon_seller_id: e.target.value })}
                placeholder="Amazon seller ID"
              />
            </div>
            <div>
              <Label htmlFor="walmart_seller_id">Walmart Seller ID</Label>
              <Input
                id="walmart_seller_id"
                value={formData.walmart_seller_id}
                onChange={(e) => setFormData({ ...formData, walmart_seller_id: e.target.value })}
                placeholder="Walmart seller ID"
              />
            </div>
            <div>
              <Label htmlFor="ebay_seller_id">eBay Seller ID</Label>
              <Input
                id="ebay_seller_id"
                value={formData.ebay_seller_id}
                onChange={(e) => setFormData({ ...formData, ebay_seller_id: e.target.value })}
                placeholder="eBay seller ID"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableMarketplaceForm;