
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const brands = [
  {
    name: "TechElite",
    category: "Electronics",
    status: "Approved",
    productsCount: 45,
    minOrder: "$2,500",
    lastOrder: "2024-04-15"
  },
  {
    name: "HomeStyle",
    category: "Home & Garden",
    status: "Approved",
    productsCount: 32,
    minOrder: "$1,500",
    lastOrder: "2024-04-10"
  },
  {
    name: "FashionPro",
    category: "Apparel",
    status: "Pending",
    productsCount: 28,
    minOrder: "$1,000",
    lastOrder: "-"
  },
  {
    name: "BeautyEssentials",
    category: "Beauty & Personal Care",
    status: "Approved",
    productsCount: 56,
    minOrder: "$2,000",
    lastOrder: "2024-04-12"
  }
];

const ResellerBrands = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Partnerships</h1>
        <p className="text-muted-foreground">Browse and manage your brand partnerships</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Min. Order</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.name}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>{brand.category}</TableCell>
                  <TableCell>{brand.productsCount}</TableCell>
                  <TableCell>{brand.minOrder}</TableCell>
                  <TableCell>{brand.lastOrder}</TableCell>
                  <TableCell>
                    <Badge variant={brand.status === 'Approved' ? 'default' : 'secondary'}>
                      {brand.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerBrands;
