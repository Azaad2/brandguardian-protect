
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brand, BrandFormData } from './types';

interface BrandFormProps {
  editingBrand: Brand | null;
  onSubmit: (data: BrandFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const BrandForm = ({ editingBrand, onSubmit, onCancel, isLoading }: BrandFormProps) => {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    website_url: '',
    description: '',
    contact_email: '',
    logo_url: '',
    categories: '',
    approval_rate: '',
    response_time: '',
    department: '', // Ensure department is included
  });

  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name || '',
        website_url: editingBrand.website_url || '',
        description: editingBrand.description || '',
        contact_email: editingBrand.contact_email || '',
        logo_url: editingBrand.logo_url || '',
        categories: editingBrand.categories ? editingBrand.categories.join(', ') : '',
        approval_rate: editingBrand.approval_rate ? editingBrand.approval_rate.toString() : '',
        response_time: editingBrand.response_time ? editingBrand.response_time.toString() : '',
        department: editingBrand.department || '', // Ensure department is set
      });
    }
  }, [editingBrand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof BrandFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Brand Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="e.g., Electronics, Fashion, Home & Garden"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => handleChange('website_url', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            type="url"
            value={formData.logo_url}
            onChange={(e) => handleChange('logo_url', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categories">Categories</Label>
          <Input
            id="categories"
            value={formData.categories}
            onChange={(e) => handleChange('categories', e.target.value)}
            placeholder="Electronics, Gadgets, Tech (comma separated)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="approval_rate">Approval Rate (%)</Label>
          <Input
            id="approval_rate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.approval_rate}
            onChange={(e) => handleChange('approval_rate', e.target.value)}
            placeholder="95.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response_time">Response Time (hours)</Label>
          <Input
            id="response_time"
            type="number"
            min="0"
            step="0.5"
            value={formData.response_time}
            onChange={(e) => handleChange('response_time', e.target.value)}
            placeholder="24"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          placeholder="Brief description of the brand..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : editingBrand ? 'Update Brand' : 'Add Brand'}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;
