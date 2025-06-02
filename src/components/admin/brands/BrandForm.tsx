
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Brand, BrandFormData } from './types';

interface BrandFormProps {
  editingBrand: Brand | null;
  onSubmit: (formData: BrandFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const BrandForm = ({ editingBrand, onSubmit, onCancel, isLoading }: BrandFormProps) => {
  const [formData, setFormData] = useState<BrandFormData>({
    name: editingBrand?.name || '',
    website_url: editingBrand?.website_url || '',
    description: editingBrand?.description || '',
    contact_email: editingBrand?.contact_email || '',
    logo_url: editingBrand?.logo_url || '',
    categories: editingBrand?.categories?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Brand Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Contact Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            type="url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the brand..."
        />
      </div>
      
      <div>
        <Label htmlFor="categories">Categories (comma-separated)</Label>
        <Input
          id="categories"
          value={formData.categories}
          onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
          placeholder="Electronics, Home & Garden, Fashion"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {editingBrand ? 'Update Brand' : 'Add Brand'}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;
