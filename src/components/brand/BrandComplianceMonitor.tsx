
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, 
  ArrowDownUp, 
  Check, 
  Clock, 
  Eye, 
  Filter, 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Trash 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ComplianceIssue {
  id: string;
  type: 'map_violation' | 'unauthorized_seller' | 'content_issue';
  productName: string;
  seller: string;
  marketplace: string;
  detectedDate: string;
  status: 'open' | 'in_progress' | 'resolved';
  details: string;
  priority: 'high' | 'medium' | 'low';
}

const BrandComplianceMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Sample data - in a real app, this would come from an API
  const complianceIssues: ComplianceIssue[] = [
    {
      id: '1',
      type: 'map_violation',
      productName: 'Premium Skincare Collection',
      seller: 'Valley Supply Co.',
      marketplace: 'Walmart',
      detectedDate: '2023-04-20',
      status: 'open',
      details: 'Listed at $44.99, below MAP of $49.99',
      priority: 'high'
    },
    {
      id: '2',
      type: 'unauthorized_seller',
      productName: 'Professional Teeth Whitening Kit',
      seller: 'ValuSellers',
      marketplace: 'eBay',
      detectedDate: '2023-04-19',
      status: 'in_progress',
      details: 'Unauthorized seller listing product without approval',
      priority: 'high'
    },
    {
      id: '3',
      type: 'map_violation',
      productName: 'Night Repair Serum',
      seller: 'Horizon Distributors',
      marketplace: 'Amazon',
      detectedDate: '2023-04-18',
      status: 'open',
      details: 'Listed at $34.99, below MAP of $39.99',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'content_issue',
      productName: 'Advanced Hair Growth Formula',
      seller: 'Summit Retail',
      marketplace: 'Amazon',
      detectedDate: '2023-04-15',
      status: 'resolved',
      details: 'Incorrect product description and misleading claims',
      priority: 'medium'
    },
    {
      id: '5',
      type: 'content_issue',
      productName: 'Premium Skincare Collection',
      seller: 'Metro Wholesale',
      marketplace: 'Amazon',
      detectedDate: '2023-04-12',
      status: 'resolved',
      details: 'Using outdated product images',
      priority: 'low'
    },
    {
      id: '6',
      type: 'unauthorized_seller',
      productName: 'Night Repair Serum',
      seller: 'BeautyDiscounts',
      marketplace: 'eBay',
      detectedDate: '2023-04-10',
      status: 'resolved',
      details: 'Unauthorized seller removed after cease and desist',
      priority: 'high'
    }
  ];

  const filterIssues = (issues: ComplianceIssue[]) => {
    let filtered = issues;
    
    // Filter by tab selection
    if (selectedTab !== 'all') {
      if (selectedTab === 'map') {
        filtered = filtered.filter(issue => issue.type === 'map_violation');
      } else if (selectedTab === 'unauthorized') {
        filtered = filtered.filter(issue => issue.type === 'unauthorized_seller');
      } else if (selectedTab === 'content') {
        filtered = filtered.filter(issue => issue.type === 'content_issue');
      } else if (selectedTab === 'open') {
        filtered = filtered.filter(issue => issue.status === 'open' || issue.status === 'in_progress');
      } else if (selectedTab === 'resolved') {
        filtered = filtered.filter(issue => issue.status === 'resolved');
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.marketplace.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredIssues = filterIssues(complianceIssues);

  const getTypeIcon = (type: ComplianceIssue['type']) => {
    switch (type) {
      case 'map_violation':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'unauthorized_seller':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'content_issue':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: ComplianceIssue['type']) => {
    switch (type) {
      case 'map_violation':
        return 'MAP Violation';
      case 'unauthorized_seller':
        return 'Unauthorized Seller';
      case 'content_issue':
        return 'Content Issue';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: ComplianceIssue['status']) => {
    switch (status) {
      case 'open':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">Open</span>;
      case 'in_progress':
        return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">In Progress</span>;
      case 'resolved':
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Resolved</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: ComplianceIssue['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">High</span>;
      case 'medium':
        return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">Medium</span>;
      case 'low':
        return <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">Low</span>;
      default:
        return null;
    }
  };

  const handleActionClick = (issue: ComplianceIssue) => {
    const actions = {
      'map_violation': 'sent a MAP policy violation notice to',
      'unauthorized_seller': 'sent a cease and desist notice to',
      'content_issue': 'requested content correction from'
    };
    
    toast({
      title: 'Action Taken',
      description: `Successfully ${actions[issue.type]} ${issue.seller}.`,
      duration: 3000,
    });
  };

  const handleResolveClick = (issue: ComplianceIssue) => {
    toast({
      title: 'Issue Resolved',
      description: `The compliance issue with ${issue.productName} has been marked as resolved.`,
      duration: 3000,
    });
  };

  const handleDeleteClick = (issue: ComplianceIssue) => {
    toast({
      title: 'Issue Deleted',
      description: `The compliance issue has been deleted from your tracking list.`,
      duration: 3000,
    });
  };

  // Calculate summary stats
  const openIssues = complianceIssues.filter(i => i.status === 'open').length;
  const inProgressIssues = complianceIssues.filter(i => i.status === 'in_progress').length;
  const resolvedIssues = complianceIssues.filter(i => i.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Monitoring</h1>
        <p className="text-muted-foreground">Track and resolve MAP violations, unauthorized sellers, and content issues</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssues}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressIssues}</div>
            <p className="text-xs text-muted-foreground">Currently being addressed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssues}</div>
            <p className="text-xs text-muted-foreground">Successfully handled issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
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
          <Button variant="outline" size="sm">
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="map">MAP Violations</TabsTrigger>
          <TabsTrigger value="unauthorized">Unauthorized Sellers</TabsTrigger>
          <TabsTrigger value="content">Content Issues</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="border-none p-0 shadow-none">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead>Detected</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No compliance issues found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(issue.type)}
                          <span>{getTypeLabel(issue.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{issue.productName}</TableCell>
                      <TableCell>{issue.seller}</TableCell>
                      <TableCell>{issue.marketplace}</TableCell>
                      <TableCell>{issue.detectedDate}</TableCell>
                      <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {issue.status !== 'resolved' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                title="Take action" 
                                onClick={() => handleActionClick(issue)}
                              >
                                Action
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600"
                                title="Mark as resolved" 
                                onClick={() => handleResolveClick(issue)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600" 
                            title="Delete"
                            onClick={() => handleDeleteClick(issue)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Compliance Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Resources</CardTitle>
          <CardDescription>Tools and templates to help manage compliance issues</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">MAP Policy Template</CardTitle>
            </CardHeader>
            <CardContent className="pb-0 text-sm text-muted-foreground">
              Create or update your MAP policy with our standardized template.
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">Download Template</Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cease & Desist Letter</CardTitle>
            </CardHeader>
            <CardContent className="pb-0 text-sm text-muted-foreground">
              Legal template for addressing unauthorized sellers.
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">Download Template</Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand Registry Guide</CardTitle>
            </CardHeader>
            <CardContent className="pb-0 text-sm text-muted-foreground">
              Step-by-step guide for registering your brand on marketplaces.
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View Guide</Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Schedule Consultation</CardTitle>
            </CardHeader>
            <CardContent className="pb-0 text-sm text-muted-foreground">
              Speak with our compliance experts for tailored advice.
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">Book a Call</Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandComplianceMonitor;
