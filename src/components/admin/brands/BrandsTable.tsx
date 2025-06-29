
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Brand } from './types';
import BrandAllocationManager from './BrandAllocationManager';

interface BrandsTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onToggleStatus: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

const BrandsTable = ({ brands, onEdit, onToggleStatus, onDelete }: BrandsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900 text-base">Brand</TableHead>
            <TableHead className="font-semibold text-gray-900 text-base">Department</TableHead>
            <TableHead className="font-semibold text-gray-900 text-base">Website</TableHead>
            <TableHead className="font-semibold text-gray-900 text-base">Contact</TableHead>
            <TableHead className="font-semibold text-gray-900 text-base">Categories</TableHead>
            <TableHead className="font-semibold text-gray-900 text-base">Status</TableHead>
            <TableHead className="font-semibold text-gray-900 text-base">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-4">
                  {brand.logo_url && (
                    <img 
                      src={brand.logo_url} 
                      alt={`${brand.name} logo`}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 text-base">{brand.name}</div>
                    {brand.description && (
                      <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">
                        {brand.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                {brand.department ? (
                  <Badge variant="outline" className="font-medium">
                    {brand.department}
                  </Badge>
                ) : (
                  <span className="text-gray-500 text-sm">No department</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                {brand.website_url ? (
                  <a 
                    href={brand.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Visit Website
                  </a>
                ) : (
                  <span className="text-gray-500">No website</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                <span className="text-gray-900 font-medium">{brand.contact_email}</span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-wrap gap-1">
                  {brand.categories?.slice(0, 2).map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs font-medium">
                      {category}
                    </Badge>
                  ))}
                  {brand.categories && brand.categories.length > 2 && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      +{brand.categories.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge 
                  variant={brand.is_active ? "default" : "secondary"}
                  className="font-medium"
                >
                  {brand.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(brand)}
                    className="h-9 w-9 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(brand)}
                    className="h-9 w-9 p-0"
                  >
                    {brand.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <BrandAllocationManager brand={brand} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">Delete Brand</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          Are you sure you want to delete "{brand.name}"? This action cannot be undone and will remove all associated data including applications and allocations.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(brand)}
                          className="font-medium"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrandsTable;
