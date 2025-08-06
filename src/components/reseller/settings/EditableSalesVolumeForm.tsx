import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { formatSalesVolume } from "./utils/formatters";

interface EditableSalesVolumeFormProps {
  profile: {
    sales_volume: string;
  };
  onUpdate: () => void;
}

const EditableSalesVolumeForm = ({ profile, onUpdate }: EditableSalesVolumeFormProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState(profile.sales_volume);
  const [isLoading, setIsLoading] = useState(false);

  const volumeOptions = [
    { value: 'under_10k', label: 'Under $10,000' },
    { value: '10k_50k', label: '$10,000 - $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: '100k_500k', label: '$100,000 - $500,000' },
    { value: '500k_1m', label: '$500,000 - $1 million' },
    { value: 'over_1m', label: 'Over $1 million' },
  ];

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reseller_applications')
        .update({
          sales_volume: selectedVolume,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating sales volume:', error);
        toast({
          title: "Error",
          description: "Failed to update sales volume",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Sales volume updated successfully",
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
    setSelectedVolume(profile.sales_volume);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sales Volume
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
          <p className="text-sm">{formatSalesVolume(profile.sales_volume)}</p>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="volume">Monthly Sales Volume</Label>
            <Select value={selectedVolume} onValueChange={setSelectedVolume}>
              <SelectTrigger>
                <SelectValue placeholder="Select your sales volume range" />
              </SelectTrigger>
              <SelectContent>
                {volumeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableSalesVolumeForm;