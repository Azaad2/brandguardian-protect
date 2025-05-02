
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Award, ShoppingCart } from 'lucide-react';

const ResellerBenefitCards = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brandguardian-600" />
            Access to Top Brands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Partner with reputable brands looking for trusted resellers and gain access to exclusive product lines.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-brandguardian-600" />
            Compliance Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Get the tools and support you need to ensure MAP compliance and brand guideline adherence.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-brandguardian-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Track your sales performance across multiple marketplaces and optimize your listings for better results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerBenefitCards;
