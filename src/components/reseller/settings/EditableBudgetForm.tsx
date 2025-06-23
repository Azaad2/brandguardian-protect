
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { formatWholesaleBudget } from "./utils/formatters";

interface EditableBudgetFormProps {
  profile: {
    wholesale_budget: string;
  };
  onUpdate: () => void;
}

const EditableBudgetForm = ({ profile, onUpdate }: EditableBudgetFormProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(profile.wholesale_budget);
  const [isLoading, setIsLoading] = useState(false);

  const budgetOptions = [
    { value: 'under_5k', label: 'Under $5,000' },
    { value: '5k_10k', label: '$5,000 - $10,000' },
    { value: '10k_25k', label: '$10,000 - $25,000' },
    { value: '25k_50k', label: '$25,000 - $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: '100k_500k', label: '$100,000 - $500,000' },
    { value: 'over_100k', label: 'Over $100,000' },
  ];

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reseller_applications')
        .update({
          wholesale_budget: selectedBudget,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating budget:', error);
        toast({
          title: "Error",
          description: "Failed to update wholesale budget",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Wholesale budget updated successfully",
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
    setSelectedBudget(profile.wholesale_budget);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Wholesale Budget
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
          <p className="text-sm">{formatWholesaleBudget(profile.wholesale_budget)}</p>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Wholesale Budget</Label>
            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Select your budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map((option) => (
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

export default EditableBudgetForm;
