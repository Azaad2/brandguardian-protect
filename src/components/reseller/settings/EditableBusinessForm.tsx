import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { formatBusinessType } from "./utils/formatters";

interface EditableBusinessFormProps {
  profile: {
    company_name: string;
    business_type: string;
    ein_number: string;
  };
  onUpdate: () => void;
}

const EditableBusinessForm = ({ profile, onUpdate }: EditableBusinessFormProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: profile.company_name,
    business_type: profile.business_type,
    ein_number: profile.ein_number,
  });
  const [isLoading, setIsLoading] = useState(false);

  const businessTypeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llc', label: 'LLC' },
    { value: 'other', label: 'Other' },
  ];

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reseller_applications')
        .update({
          company_name: formData.company_name,
          business_type: formData.business_type,
          ein_number: formData.ein_number,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating business info:', error);
        toast({
          title: "Error",
          description: "Failed to update business information",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Business information updated successfully",
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
      company_name: profile.company_name,
      business_type: profile.business_type,
      ein_number: profile.ein_number,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business Information
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
              <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
              <p className="text-sm">{profile.company_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Business Type</Label>
              <p className="text-sm">{formatBusinessType(profile.business_type)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">EIN Number</Label>
              <p className="text-sm">{profile.ein_number}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business_type">Business Type</Label>
              <Select value={formData.business_type} onValueChange={(value) => setFormData({ ...formData, business_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ein_number">EIN Number</Label>
              <Input
                id="ein_number"
                value={formData.ein_number}
                onChange={(e) => setFormData({ ...formData, ein_number: e.target.value })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableBusinessForm;