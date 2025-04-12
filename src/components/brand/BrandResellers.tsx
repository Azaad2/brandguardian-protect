
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Search, FilterIcon, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WholesaleBudget } from '@/types/reseller';

interface Reseller {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  businessType: string;
  dateApplied: string;
  budget: WholesaleBudget;
  products: string[];
  feedback?: string;
}

// Sample data
const resellers: Reseller[] = [
  {
    id: '1',
    name: 'Acme Distribution',
    email: 'contact@acmedist.com',
    status: 'pending',
    businessType: 'corporation',
    dateApplied: '2023-04-10',
    budget: '25k_50k',
    products: ['electronics', 'home_goods']
  },
  {
    id: '2',
    name: 'Metro Wholesale',
    email: 'orders@metrowholesale.com',
    status: 'approved',
    businessType: 'llc',
    dateApplied: '2023-04-08',
    budget: '10k_25k',
    products: ['beauty', 'health']
  },
  {
    id: '3',
    name: 'Summit Retail',
    email: 'purchasing@summitretail.com',
    status: 'approved',
    businessType: 'corporation',
    dateApplied: '2023-04-05',
    budget: '50k_100k',
    products: ['electronics', 'fashion', 'toys']
  },
  {
    id: '4',
    name: 'Harbor Markets',
    email: 'info@harbormarkets.com',
    status: 'rejected',
    businessType: 'partnership',
    dateApplied: '2023-04-02',
    budget: 'under_5k',
    products: ['grocery'],
    feedback: 'Budget too low for our minimum order requirements.'
  },
  {
    id: '5',
    name: 'Peak Distribution',
    email: 'wholesale@peakdist.com',
    status: 'pending',
    businessType: 'corporation',
    dateApplied: '2023-04-01',
    budget: '5k_10k',
    products: ['sports', 'fashion']
  },
  {
    id: '6',
    name: 'Valley Supply Co.',
    email: 'orders@valleysupply.com',
    status: 'approved',
    businessType: 'llc',
    dateApplied: '2023-03-28',
    budget: '100k_500k',
    products: ['home_goods', 'electronics', 'toys']
  },
  {
    id: '7',
    name: 'Horizon Distributors',
    email: 'sales@horizondist.com',
    status: 'rejected',
    businessType: 'individual',
    dateApplied: '2023-03-25',
    budget: 'under_5k',
    products: ['beauty'],
    feedback: 'Incomplete application information.'
  }
];

const formatBudgetDisplay = (budget: WholesaleBudget): string => {
  switch(budget) {
    case 'under_5k': return 'Under $5k';
    case '5k_10k': return '$5k-$10k';
    case '10k_25k': return '$10k-$25k';
    case '25k_50k': return '$25k-$50k';
    case '50k_100k': return '$50k-$100k';
    case 'over_100k': return 'Over $100k';
    default: return budget;
  }
};

const BrandResellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);

  const approveReseller = (id: string) => {
    toast({
      title: 'Reseller Approved',
      description: 'The reseller has been approved successfully.',
      duration: 3000,
    });
  };

  const rejectReseller = (id: string) => {
    toast({
      title: 'Reseller Rejected',
      description: 'The reseller has been rejected.',
      duration: 3000,
    });
  };

  const viewResellerDetails = (reseller: Reseller) => {
    setSelectedReseller(reseller);
  };

  const closeDetails = () => {
    setSelectedReseller(null);
  };

  const filterResellers = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    if (status === 'all') {
      return resellers.filter(reseller => 
        reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return resellers.filter(reseller => 
      reseller.status === status && 
      (reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       reseller.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resellers Management</h1>
        <p className="text-muted-foreground">Approve or reject reseller applications and manage existing partnerships.</p>
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Resellers</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              {resellers.filter(r => r.status === 'pending').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="border-none p-0 shadow-none">
          <ResellerTable 
            resellers={filterResellers('all')} 
            onApprove={approveReseller} 
            onReject={rejectReseller}
            onView={viewResellerDetails}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="border-none p-0 shadow-none">
          <ResellerTable 
            resellers={filterResellers('pending')} 
            onApprove={approveReseller} 
            onReject={rejectReseller} 
            onView={viewResellerDetails}
          />
        </TabsContent>
        
        <TabsContent value="approved" className="border-none p-0 shadow-none">
          <ResellerTable 
            resellers={filterResellers('approved')} 
            onApprove={approveReseller} 
            onReject={rejectReseller} 
            onView={viewResellerDetails}
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="border-none p-0 shadow-none">
          <ResellerTable 
            resellers={filterResellers('rejected')} 
            onApprove={approveReseller} 
            onReject={rejectReseller} 
            onView={viewResellerDetails}
          />
        </TabsContent>
      </Tabs>

      {selectedReseller && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reseller Details</CardTitle>
              <CardDescription>Complete information about the selected reseller</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={closeDetails}>
              Close
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium">Company Information</h3>
              <div className="grid gap-1">
                <div className="flex justify-between py-1">
                  <span className="font-medium text-muted-foreground">Company Name:</span>
                  <span>{selectedReseller.name}</span>
                </div>
                <div className="flex justify-between border-t py-1">
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <span>{selectedReseller.email}</span>
                </div>
                <div className="flex justify-between border-t py-1">
                  <span className="font-medium text-muted-foreground">Business Type:</span>
                  <span className="capitalize">{selectedReseller.businessType}</span>
                </div>
                <div className="flex justify-between border-t py-1">
                  <span className="font-medium text-muted-foreground">Applied On:</span>
                  <span>{selectedReseller.dateApplied}</span>
                </div>
                <div className="flex justify-between border-t py-1">
                  <span className="font-medium text-muted-foreground">Budget:</span>
                  <span>{formatBudgetDisplay(selectedReseller.budget)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium">Product Interest</h3>
              <div className="flex flex-wrap gap-2">
                {selectedReseller.products.map(product => (
                  <span 
                    key={product} 
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                  >
                    {product.replace('_', ' ')}
                  </span>
                ))}
              </div>
              
              {selectedReseller.status === 'rejected' && selectedReseller.feedback && (
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-medium">Rejection Reason</h3>
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {selectedReseller.feedback}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {selectedReseller.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => rejectReseller(selectedReseller.id)}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => approveReseller(selectedReseller.id)}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </>
            )}
            {selectedReseller.status !== 'pending' && (
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" /> View Orders
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

interface ResellerTableProps {
  resellers: Reseller[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (reseller: Reseller) => void;
}

const ResellerTable = ({ resellers, onApprove, onReject, onView }: ResellerTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resellers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No resellers found.
              </TableCell>
            </TableRow>
          ) : (
            resellers.map((reseller) => (
              <TableRow key={reseller.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{reseller.name}</div>
                    <div className="text-sm text-muted-foreground">{reseller.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {formatBudgetDisplay(reseller.budget)}
                </TableCell>
                <TableCell className="capitalize">{reseller.businessType}</TableCell>
                <TableCell>{reseller.dateApplied}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      reseller.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : reseller.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {reseller.status.charAt(0).toUpperCase() + reseller.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(reseller)}>
                      View
                    </Button>
                    {reseller.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => onReject(reseller.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => onApprove(reseller.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrandResellers;
