
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, EyeOff } from 'lucide-react';
import { Brand } from './types';

interface BrandsTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onToggleStatus: (brand: Brand) => void;
}

const BrandsTable = ({ brands, onEdit, onToggleStatus }: BrandsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Brand</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Categories</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.map((brand) => (
          <TableRow key={brand.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {brand.logo_url && (
                  <img 
                    src={brand.logo_url} 
                    alt={`${brand.name} logo`}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div>
                  <div className="font-medium">{brand.name}</div>
                  {brand.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {brand.description}
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {brand.website_url ? (
                <a 
                  href={brand.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Website
                </a>
              ) : (
                <span className="text-muted-foreground">No website</span>
              )}
            </TableCell>
            <TableCell>{brand.contact_email}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {brand.categories?.slice(0, 2).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {brand.categories && brand.categories.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{brand.categories.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={brand.is_active ? "default" : "secondary"}>
                {brand.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(brand)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(brand)}
                >
                  {brand.is_active ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BrandsTable;
