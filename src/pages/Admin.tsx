
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { ContactSubmission } from "@/components/landing/ContactSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load submissions from localStorage
    const storedSubmissions = localStorage.getItem('contactSubmissions');
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedSubmissions = submissions.filter(submission => submission.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
    
    toast({
      title: "Submission deleted",
      description: "The contact submission has been removed",
      variant: "destructive",
    });
  };

  const handleExport = () => {
    try {
      const jsonStr = JSON.stringify(submissions, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bndbox-contacts-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Contact submissions exported to JSON",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Something went wrong while exporting submissions",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BndBox</title>
        <meta name="description" content="Admin dashboard for BndBox to manage contact form submissions" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">View and manage contact form submissions</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={submissions.length === 0}
            >
              Export Submissions
            </Button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="pt-6 px-6 text-center">
              <div className="py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-600">
                  Once customers fill out the contact form, their information will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{submission.companyName}</CardTitle>
                      <CardDescription>
                        Submitted on {new Date(submission.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge>{submission.primaryConcern}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p className="text-gray-900">{submission.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{submission.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{submission.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Products on Amazon</p>
                      <p className="text-gray-900">{submission.productCount}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-0 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(submission.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog 
        open={selectedSubmission !== null} 
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        {selectedSubmission && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Contact Submission Details</DialogTitle>
              <DialogDescription>
                Submitted on {new Date(selectedSubmission.timestamp).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h4 className="font-medium text-gray-900">Company Information</h4>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p>{selectedSubmission.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Products on Amazon</p>
                    <p>{selectedSubmission.productCount}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p>{selectedSubmission.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{selectedSubmission.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Primary Concern</p>
                    <p>{selectedSubmission.primaryConcern}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Admin;
