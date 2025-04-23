
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Check, ExternalLink, Filter, Info, Search, ShoppingBag } from 'lucide-react';

interface Listing {
  id: string;
  productName: string;
  marketplace: 'Amazon' | 'Walmart' | 'eBay' | 'Shopify';
  seller: string;
  price: number;
  status: 'compliant' | 'non-compliant' | 'unauthorized';
  mapPrice: number;
  url: string;
}

const BrandListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');

  // Sample data - in a real app, this would come from an API
  const listings: Listing[] = [
    {
      id: '1',
      productName: 'Premium Skincare Collection',
      marketplace: 'Amazon',
      seller: 'Metro Wholesale',
      price: 49.99,
      status: 'compliant',
      mapPrice: 49.99,
      url: 'https://amazon.com/product/1'
    },
    {
      id: '2',
      productName: 'Advanced Hair Growth Formula',
      marketplace: 'Amazon',
      seller: 'Summit Retail',
      price: 29.99,
      status: 'compliant',
      mapPrice: 29.99,
      url: 'https://amazon.com/product/2'
    },
    {
      id: '3',
      productName: 'Premium Skincare Collection',
      marketplace: 'Walmart',
      seller: 'Valley Supply Co.',
      price: 44.99,
      status: 'non-compliant',
      mapPrice: 49.99,
      url: 'https://walmart.com/product/3'
    },
    {
      id: '4',
      productName: 'Professional Teeth Whitening Kit',
      marketplace: 'eBay',
      seller: 'ValuSellers',
      price: 31.99,
      status: 'unauthorized',
      mapPrice: 34.99,
      url: 'https://ebay.com/product/4'
    },
    {
      id: '5',
      productName: 'Advanced Hair Growth Formula',
      marketplace: 'Shopify',
      seller: 'Direct Beauty',
      price: 29.99,
      status: 'compliant',
      mapPrice: 29.99,
      url: 'https://directbeauty.com/product/5'
    },
    {
      id: '6',
      productName: 'Night Repair Serum',
      marketplace: 'Amazon',
      seller: 'Horizon Distributors',
      price: 34.99,
      status: 'non-compliant',
      mapPrice: 39.99,
      url: 'https://amazon.com/product/6'
    }
  ];

  const filteredListings = listings.filter(listing => 
    (selectedMarketplace === 'all' || listing.marketplace.toLowerCase() === selectedMarketplace) &&
    (listing.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     listing.seller.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: Listing['status']) => {
    switch (status) {
      case 'compliant':
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Compliant</span>;
      case 'non-compliant':
        return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">MAP Violation</span>;
      case 'unauthorized':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">Unauthorized</span>;
      default:
        return null;
    }
  };

  const getPriceDisplay = (listing: Listing) => {
    if (listing.status === 'non-compliant') {
      return (
        <div>
          <span className="font-medium text-amber-600">${listing.price.toFixed(2)}</span>
          <div className="text-xs text-muted-foreground">
            MAP: ${listing.mapPrice.toFixed(2)}
          </div>
        </div>
      );
    }
    return <span>${listing.price.toFixed(2)}</span>;
  };

  const getMarketplaceIcon = (marketplace: Listing['marketplace']) => {
    switch (marketplace) {
      case 'Amazon':
        return <ShoppingBag className="h-4 w-4 text-orange-500" />;
      case 'Walmart':
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'eBay':
        return <ShoppingBag className="h-4 w-4 text-red-500" />;
      case 'Shopify':
        return <ShoppingBag className="h-4 w-4 text-green-500" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  // Calculate summary stats
  const totalListings = listings.length;
  const complianceIssues = listings.filter(l => l.status !== 'compliant').length;
  const totalMarketplaces = [...new Set(listings.map(l => l.marketplace))].length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketplace Listings</h1>
        <p className="text-muted-foreground">Monitor your product listings across all marketplaces</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">Across all marketplaces</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceIssues}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Marketplaces</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMarketplaces}</div>
            <p className="text-xs text-muted-foreground">Platforms with active listings</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setSelectedMarketplace('all')}
          >
            All Marketplaces
          </TabsTrigger>
          <TabsTrigger 
            value="amazon" 
            onClick={() => setSelectedMarketplace('amazon')}
          >
            Amazon
          </TabsTrigger>
          <TabsTrigger 
            value="walmart" 
            onClick={() => setSelectedMarketplace('walmart')}
          >
            Walmart
          </TabsTrigger>
          <TabsTrigger 
            value="ebay" 
            onClick={() => setSelectedMarketplace('ebay')}
          >
            eBay
          </TabsTrigger>
          <TabsTrigger 
            value="shopify" 
            onClick={() => setSelectedMarketplace('shopify')}
          >
            Shopify
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="border-none p-0 shadow-none">
          <ListingsTable 
            listings={filteredListings} 
            getStatusBadge={getStatusBadge} 
            getPriceDisplay={getPriceDisplay}
            getMarketplaceIcon={getMarketplaceIcon}
          />
        </TabsContent>
        
        <TabsContent value="amazon" className="border-none p-0 shadow-none">
          <ListingsTable 
            listings={filteredListings} 
            getStatusBadge={getStatusBadge} 
            getPriceDisplay={getPriceDisplay}
            getMarketplaceIcon={getMarketplaceIcon}
          />
        </TabsContent>
        
        <TabsContent value="walmart" className="border-none p-0 shadow-none">
          <ListingsTable 
            listings={filteredListings} 
            getStatusBadge={getStatusBadge} 
            getPriceDisplay={getPriceDisplay}
            getMarketplaceIcon={getMarketplaceIcon}
          />
        </TabsContent>
        
        <TabsContent value="ebay" className="border-none p-0 shadow-none">
          <ListingsTable 
            listings={filteredListings} 
            getStatusBadge={getStatusBadge} 
            getPriceDisplay={getPriceDisplay}
            getMarketplaceIcon={getMarketplaceIcon}
          />
        </TabsContent>
        
        <TabsContent value="shopify" className="border-none p-0 shadow-none">
          <ListingsTable 
            listings={filteredListings} 
            getStatusBadge={getStatusBadge} 
            getPriceDisplay={getPriceDisplay}
            getMarketplaceIcon={getMarketplaceIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ListingsTableProps {
  listings: Listing[];
  getStatusBadge: (status: Listing['status']) => React.ReactNode;
  getPriceDisplay: (listing: Listing) => React.ReactNode;
  getMarketplaceIcon: (marketplace: Listing['marketplace']) => React.ReactNode;
}

const ListingsTable = ({ 
  listings, 
  getStatusBadge, 
  getPriceDisplay,
  getMarketplaceIcon
}: ListingsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No listings found.
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.productName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getMarketplaceIcon(listing.marketplace)}
                    <span>{listing.marketplace}</span>
                  </div>
                </TableCell>
                <TableCell>{listing.seller}</TableCell>
                <TableCell>{getPriceDisplay(listing)}</TableCell>
                <TableCell>{getStatusBadge(listing.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" title="View listing">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {listing.status === 'non-compliant' && (
                      <Button variant="outline" size="sm" className="text-amber-600">
                        Report
                      </Button>
                    )}
                    {listing.status === 'unauthorized' && (
                      <Button variant="outline" size="sm" className="text-red-600">
                        Take Action
                      </Button>
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

export default BrandListings;
