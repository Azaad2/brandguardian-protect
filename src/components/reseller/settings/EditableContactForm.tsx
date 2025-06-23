
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface EditableContactFormProps {
  profile: {
    email: string;
    phone: string;
    linkedin?: string;
  };
  onUpdate: () => void;
}

const EditableContactForm = ({ profile, onUpdate }: EditableContactFormProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: profile.email,
    phone: profile.phone,
    linkedin: profile.linkedin || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reseller_applications')
        .update({
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin || null,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating contact info:', error);
        toast({
          title: "Error",
          description: "Failed to update contact information",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Contact information updated successfully",
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
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.linkedin || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
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
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm">{profile.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              <p className="text-sm">{profile.phone}</p>
            </div>
            {profile.linkedin && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">LinkedIn</Label>
                <p className="text-sm">{profile.linkedin}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="linkedin">LinkedIn (optional)</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableContactForm;
