
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, FilterIcon, ExternalLink, Users, CheckCircle } from 'lucide-react';
import { useBrandResellers } from '@/hooks/use-brand-data';

const BrandResellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: allocations = [], isLoading, error } = useBrandResellers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAllocations = allocations.filter(allocation => {
    const reseller = allocation.reseller;
    if (!reseller) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      reseller.company_name?.toLowerCase().includes(searchLower) ||
      reseller.full_name?.toLowerCase().includes(searchLower) ||
      reseller.email?.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resellers Management</h1>
          <p className="text-muted-foreground">Manage your authorized reseller network</p>
        </div>
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center">
              <h3 className="mb-1 text-lg font-medium text-red-600">Error loading resellers</h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resellers Management</h1>
        <p className="text-muted-foreground">Manage your authorized reseller network</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Resellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allocations.length}</div>
            <p className="text-xs text-muted-foreground">Authorized partners</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Resellers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allocations.length}</div>
            <p className="text-xs text-muted-foreground">Currently authorized</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resellers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authorized Resellers</CardTitle>
          <CardDescription>Your current authorized reseller network</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAllocations.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <h3 className="mb-1 text-lg font-medium">
                  {allocations.length === 0 ? 'No authorized resellers yet' : 'No resellers found'}
                </h3>
                <p className="text-muted-foreground">
                  {allocations.length === 0 
                    ? 'When resellers are approved for your brand, they will appear here.'
                    : 'Try adjusting your search terms.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Authorized Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">
                          {allocation.reseller?.company_name || allocation.reseller?.full_name || 'Unknown Company'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {allocation.reseller?.full_name && allocation.reseller?.company_name 
                            ? allocation.reseller.full_name 
                            : 'Contact Person'
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {allocation.reseller?.email || 'No email'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(allocation.allocated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Orders
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandResellers;
