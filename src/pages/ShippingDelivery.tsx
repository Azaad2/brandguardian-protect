
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, MapPin, Package, Shield, AlertCircle } from 'lucide-react';

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Shipping & Delivery - BndBox</title>
        <meta name="description" content="BndBox Shipping and Delivery Information - Learn about our shipping policies, delivery timelines, and logistics for brands and resellers." />
      </Helmet>
      
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Shipping & Delivery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive shipping and delivery information for brands and resellers on the BndBox marketplace platform.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Truck className="h-12 w-12 mx-auto text-brandguardian-600 mb-4" />
              <CardTitle>Flexible Shipping</CardTitle>
              <CardDescription>
                Multiple shipping options to meet your business needs
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 mx-auto text-brandguardian-600 mb-4" />
              <CardTitle>Fast Processing</CardTitle>
              <CardDescription>
                Quick order processing and fulfillment coordination
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-brandguardian-600 mb-4" />
              <CardTitle>Secure Delivery</CardTitle>
              <CardDescription>
                Tracked and insured shipments for peace of mind
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How Shipping Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                How Shipping Works on BndBox
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-brandguardian-100 text-brandguardian-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Order Placement</h4>
                    <p className="text-sm text-gray-600">Reseller places order through the BndBox platform</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-brandguardian-100 text-brandguardian-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Brand Fulfillment</h4>
                    <p className="text-sm text-gray-600">Brand processes and ships directly to reseller</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-brandguardian-100 text-brandguardian-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Tracking & Updates</h4>
                    <p className="text-sm text-gray-600">Both parties receive tracking information and updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-brandguardian-100 text-brandguardian-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Delivery Confirmation</h4>
                    <p className="text-sm text-gray-600">Delivery confirmation and transaction completion</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Processing Time</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Standard orders: 1-3 business days</li>
                  <li>• Bulk orders: 3-5 business days</li>
                  <li>• Custom orders: 5-10 business days</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Shipping Methods</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ground shipping (3-7 business days)</li>
                  <li>• Expedited shipping (2-3 business days)</li>
                  <li>• Express shipping (1-2 business days)</li>
                  <li>• Freight shipping (for large orders)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Geographic Coverage</h4>
                <p className="text-sm text-gray-600">
                  Shipping available throughout the United States, with select brands offering international shipping.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="mt-12 space-y-8">
          {/* For Brands */}
          <Card>
            <CardHeader>
              <CardTitle>For Brands: Shipping Requirements</CardTitle>
              <CardDescription>
                Guidelines and requirements for brands fulfilling orders on BndBox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Fulfillment Responsibilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Required Actions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Process orders within stated timeframes</li>
                      <li>• Provide accurate tracking information</li>
                      <li>• Use appropriate packaging materials</li>
                      <li>• Include all required documentation</li>
                      <li>• Maintain inventory accuracy</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Standards</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use reputable shipping carriers</li>
                      <li>• Provide insurance for high-value items</li>
                      <li>• Include delivery confirmation</li>
                      <li>• Follow packaging best practices</li>
                      <li>• Maintain shipping records</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Cost Structure</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Free Shipping Thresholds:</strong> Many brands offer free shipping on orders above certain amounts (typically $500-$1,000).
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Shipping Calculations:</strong> Brands set their own shipping rates based on weight, dimensions, and destination.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Special Handling:</strong> Additional fees may apply for oversized, fragile, or hazardous materials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* For Resellers */}
          <Card>
            <CardHeader>
              <CardTitle>For Resellers: Shipping Information</CardTitle>
              <CardDescription>
                What resellers need to know about shipping and delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Delivery Expectations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Standard Delivery</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Processing: 1-3 business days</li>
                      <li>• Transit: 3-7 business days</li>
                      <li>• Total time: 4-10 business days</li>
                      <li>• Tracking provided</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Expedited Options</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Express: 1-3 business days total</li>
                      <li>• Overnight: Next business day</li>
                      <li>• Additional fees apply</li>
                      <li>• Subject to availability</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Address Requirements</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Important:</strong> Ensure your shipping address is complete and accurate to avoid delays.
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Include complete business name</li>
                        <li>• Provide accurate street address</li>
                        <li>• Include suite/unit numbers if applicable</li>
                        <li>• Verify ZIP codes and city names</li>
                        <li>• Include contact phone number</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card>
            <CardHeader>
              <CardTitle>Special Circumstances</CardTitle>
              <CardDescription>
                Handling of special shipping situations and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Damaged or Lost Shipments</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Reporting:</strong> Report damaged or lost shipments within 48 hours of delivery date.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Documentation:</strong> Provide photos and carrier delivery confirmation.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Resolution:</strong> BndBox will coordinate with the brand for replacement or refund.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">International Shipping</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Availability:</strong> Limited to select brands and products.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Customs:</strong> Recipient responsible for customs duties and taxes.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Restrictions:</strong> Some products may not be eligible for international shipping.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Bulk and Freight Orders</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Large Orders:</strong> Orders exceeding certain size or weight limits may require freight shipping.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Delivery Requirements:</strong> Freight deliveries may require dock access or forklift availability.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Scheduling:</strong> Freight deliveries typically require appointment scheduling.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Support</CardTitle>
              <CardDescription>
                Get help with shipping questions and issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email:</strong> shipping@bndbox.com</p>
                    <p><strong>Phone:</strong> 1-800-BNDBOX-1</p>
                    <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">What to Include</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Order number or reference</li>
                    <li>• Tracking number (if available)</li>
                    <li>• Description of the issue</li>
                    <li>• Photos (for damage claims)</li>
                    <li>• Preferred resolution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShippingDelivery;
