
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomeLink from "@/components/navigation/HomeLink";

const Admin = () => {
  // Sample data - in a real app, this would come from a database
  const inquiries = [
    {
      id: "INQ-001",
      companyName: "Tech Innovators Inc.",
      contactPerson: "John Smith",
      email: "john@techinnovators.com",
      primaryConcern: "amazon",
      productCount: "50+",
      timestamp: "2025-04-01T14:30:00Z",
    },
    {
      id: "INQ-002",
      companyName: "Wellness Products Co.",
      contactPerson: "Sarah Lee",
      email: "sarah@wellnessproducts.com",
      primaryConcern: "walmart_ebay",
      productCount: "20-49",
      timestamp: "2025-04-02T09:15:00Z",
    },
    {
      id: "INQ-003",
      companyName: "Fashion Forward",
      contactPerson: "Michael Chen",
      email: "michael@fashionforward.com",
      primaryConcern: "all",
      productCount: "100+",
      timestamp: "2025-04-03T16:45:00Z",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMarketplaceName = (code: string) => {
    const marketplaces: Record<string, string> = {
      amazon: "Amazon",
      walmart: "Walmart",
      ebay: "eBay",
      amazon_walmart: "Amazon & Walmart",
      amazon_ebay: "Amazon & eBay",
      walmart_ebay: "Walmart & eBay",
      all: "All Marketplaces",
      other: "Other",
    };
    return marketplaces[code] || code;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <HomeLink />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Recent Inquiries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketplaces
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inquiry.contactPerson}
                      </div>
                      <div className="text-sm text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {getMarketplaceName(inquiry.primaryConcern)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.productCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
